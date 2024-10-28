
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import { GrRefresh } from "react-icons/gr";

const CategoryEdit = () => {
    // navigate
    const navigate = useNavigate();

    ///state
    const [category, setCategory] = useState([]);
    const [group1, setGroup1] = useState();
    const [group2, setGroup2] = useState();
    const [group3, setGroup3] = useState();
    //  const [categoryName, setCategoryName] = useState("");
    const { categoryNo } = useParams(); // categoryNo 가져오기
    const [input, setInput] = useState({
        categoryName: "",
        categoryGroup: "",
        categoryUpper: "",
        categoryDepth: ""
    });

    //effect
    useEffect(() => {
        loadCategory();
    }, []);

    // 카테고리 리스트 가져오기
    const loadCategory = useCallback(async () => {
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);
        loadInfo();
    }, [category]);

    // 카테고리 로드
    const loadInfo = useCallback(async () => {
        try {
            const resp = await axios.get(`/admin/category/detail/${categoryNo}`);
            setInput(resp.data); // 받아온 데이터로 초기화
        } catch (e) {
            console.error("Error loading category:", e);
        }
    }, [categoryNo]);

    // 카테고리 입력 하다가 갑자기 대분류 선택하고 싶어질 때 누르는 카테고리 리셋 버튼
    const resetCategory = useCallback(() => {
        loadInfo();
        setGroup1();
        setGroup2();
        setGroup3();
    }, [group1, group2, group3]);

    // 카테고리 수정 처리
    const updateCategory = useCallback(async (e) => {
        // e.preventDefault(); // 기본 제출 이벤트 방지
        if (checkContains() === true) {
            toast.error("하위카테고리 존재로 인해 수정 불가");
            return;
        }

        try {
            await axios.post(`/admin/category/update/${categoryNo}`, input);
            toast.success('카테고리 수정 완료');
            navigate("/admin/category/list"); // 수정 후 목록으로 이동
        } catch (error) {
            toast.error('카테고리 정보 재확인 바람');
        }
    }, [input, categoryNo]);

    // 매우 중요한것임, 카테고리 선택에 따라 값 바꿔서 input에다가 넣어줌 
    const changeInput = useMemo(() => {
        const depth = ((group1 === undefined || group1 === 0) ? (1) : ((group2 === undefined || group2 === 0) ? 2 : 3))
        setInput({
            ...input,
            categoryDepth: depth,
            categoryName: input.categoryName,
            categoryUpper: (depth === 1 ? (0) : (depth === 2 ? (group1) : (group2)))
        });
    }, [group1, group2]);

    const checkContains = useCallback(async () => {
        const resp = await axios.get("/admin/category/contains/" + categoryNo);
        return resp.data;
    }, []);

    return (<>

        <div className="row mt-4">
            <div className="col-9">
                <label>
                    카테고리
                </label>
                <div className="input-group">
                    <button className='btn btn-secondary text-light' onClick={resetCategory}>
                        <GrRefresh />
                    </button>
                    <input type="text" className="form-control"                             
                            value={input.categoryName} 
                            onChange={e => setInput({...input, categoryName: e.target.value })} />
                </div>
            </div>
        </div>
        <div className="row mt-2">
            <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                {category.filter(category => category.categoryDepth === 1).map((cat) => (
                    <ul className="list-group" key={cat.categoryNo}>
                        <li className={"list-group-item list-group-item-action " + (group1 === cat.categoryNo && "bg-secondary text-light")}
                            onClick={e => (setGroup1(parseInt(e.target.value)), setGroup2(0))} value={cat.categoryNo}>
                            {cat.categoryName}
                        </li>
                    </ul>
                ))}
            </div>
            <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                {category.filter(category => (category.categoryDepth === 2 && category.categoryGroup === group1)).map((cat) => (
                    <ul className="list-group" key={cat.categoryNo}>
                        <li className={"list-group-item list-group-item-action " + (group2 === cat.categoryNo && "bg-secondary text-light")}
                            onClick={e => (setGroup2(parseInt(e.target.value)), setGroup3(0))} value={cat.categoryNo}>
                            {cat.categoryName}
                        </li>
                    </ul>
                ))}
            </div>
            <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                {category.filter(category => (category.categoryDepth === 3 && category.categoryGroup === group1 && category.categoryUpper === group2)).map((cat) => (
                    <ul className="list-group" key={cat.categoryNo}>
                        <li className={"list-group-item list-group-item-action " + (group3 === cat.categoryNo && "bg-secondary text-light")} value={cat.categoryNo}>
                            {cat.categoryName}
                        </li>
                    </ul>
                ))}
            </div>
        </div>

        {/* 취소 버튼 추가 */}
        <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-success mt-3" onClick={e => updateCategory(input)}>
                완료
            </button>
            <button className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/admin/category/list')}>
                취소
            </button>
        </div>

    </>);
};
export default CategoryEdit;