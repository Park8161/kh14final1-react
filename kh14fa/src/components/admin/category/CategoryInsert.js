import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { GrRefresh } from "react-icons/gr";

const CategoryInsert = () => {
    // navigate
    const navigate = useNavigate();

    ///state
    const [category, setCategory] = useState([]);
    const [group1, setGroup1] = useState();
    const [group2, setGroup2] = useState();
    const [group3, setGroup3] = useState();
    const [categoryName, setCategoryName] = useState("");
    const [input, setInput] = useState({
        categoryDepth: "",
        categoryName: "",
        categoryUpper: 0
    });

    //effect
    useEffect(() => {
        loadCategory();
    }, []);

    // 카테고리 리스트 가져오기
    const loadCategory = useCallback(async () => {
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);
    }, [category]);

    // 카테고리 찾아주기
    const findCategory = useCallback(() => {
        const findCat = category.filter(category => category.categoryName === categoryName)[0] || "";
        setGroup3(findCat.categoryNo);
        setGroup2(findCat.categoryUpper);
        setGroup1(findCat.categoryGroup);
    }, [categoryName]);

    // 카테고리 입력 하다가 갑자기 대분류 선택하고 싶어질 때 누르는 카테고리 리셋 버튼
    const resetCategory = useCallback(() => {
        setGroup1();
        setGroup2();
        setGroup3();
    }, [group1, group2, group3]);

    const existenceCategory = useCallback(()=>{
        return category.some(category => category.categoryName === categoryName);
    },[category, categoryName]);

    const insertCategory = useCallback(async (input) => {
        try {
            if(existenceCategory()){
                toast.error("이미 존재하는 카테고리");
                return;
            }
            const response = await axios.post("/admin/category/insert", input);
            toast.success("카테고리 등록 완료");
            navigate("/admin/category/list")
        }
        catch (e) {
            toast.error("카테고리 정보 재확인 바람");
        }
    }, [existenceCategory]);

    // 매우 중요한것임, 카테고리 선택에 따라 값 바꿔서 input에다가 넣어줌 
    const changeInput = useMemo(() => {
        const depth = ((group1 === undefined || group1 === 0) ? (1) : ((group2 === undefined || group2 === 0) ? 2 : 3))
        setInput({
            ...input,
            categoryDepth: depth,
            categoryName: categoryName,
            categoryUpper: (depth === 1 ? (0) : (depth === 2 ? (group1) : (group2)))
        });
    }, [group1, group2, categoryName]);



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
                    <input type="text" className="form-control" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
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
                <button className="btn btn-success mt-3" onClick={e => insertCategory(input)}>
                    완료
                </button>
                <button className="btn btn-secondary mt-3" onClick={() => navigate('/admin/category/list')}>
                    취소
                </button>            
        </div>

    </>);
};

export default CategoryInsert;
