import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Jumbotron from '../../Jumbotron';
import { toast } from 'react-toastify';

const CategoryEdit = () => {
    const { categoryNo } = useParams(); // categoryNo 가져오기
    const [categories, setCategories] = useState([]); // 대,중,소 카테고리 데이터
    const [input, setInput] = useState({
        categoryName: "",
        categoryGroup: "",
        categoryUpper: "",
        categoryDepth: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadCategory();
        loadFilter();
    }, []);

    // 카테고리 로드
    const loadCategory = useCallback(async () => {
        try {
            const resp = await axios.get(`/admin/category/detail/${categoryNo}`);
            setInput(resp.data); // 받아온 데이터로 초기화
        } catch (e) {
            console.error("Error loading category:", e);
        }
    }, [categoryNo]);

    // 대,중,소 카테고리 데이터 로드
    const loadFilter = useCallback(async () => {
        try {
            const resp = await axios.get("/admin/category/listP");
            setCategories(resp.data);
        } catch (e) {
            console.error("Error loading categories:", e);
        }
    }, []);

    // 카테고리 변경 처리
    const changeCat = useCallback(e => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    }, [input]);

    // 카테고리 수정 처리
    const updateCat = useCallback(async (e) => {
        e.preventDefault(); // 기본 제출 이벤트 방지
        try {
            await axios.post(`/admin/category/update/${categoryNo}`, input);
            toast.success('카테고리가 수정되었습니다.');
            navigate("/admin/category/list"); // 수정 후 목록으로 이동
        } catch (error) {
            toast.error('카테고리 수정에 실패했습니다.');
        }
    }, [input, categoryNo, navigate]);

    return (
        <>
            <Jumbotron title="카테고리 수정" />
            <div className="container mt-4">
                <form onSubmit={updateCat}>
                    {/* 카테고리 이름 필드 */}
                    <div className="mb-3">
                        <label className="form-label">카테고리 이름</label>
                        <input
                            type="text"
                            className="form-control"
                            name="categoryName"
                            value={input.categoryName || ''} // null인 경우 빈 문자열
                            onChange={changeCat}
                            required
                        />
                    </div>

                    {/* 대분류 수정 가능 */}
                    {/* {input.categoryDepth === 1 && (
                        <div className="mb-3">
                            <label className="form-label">대분류</label>
                            <select
                                className="form-select"
                                name="categoryGroup"
                                value={input.categoryGroup || ''} // null인 경우 빈 문자열
                                onChange={changeCat}
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.filter(c => c.categoryDepth === 1).map(category => (
                                    <option key={category.categoryNo} value={category.categoryNo}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )} */}

                    {/* 중분류 수정 가능 */}
                    {input.categoryDepth === 2 && (
                        <div className="mb-3">
                            <label className="form-label">대분류</label>
                            <select
                                className="form-select"
                                name="categoryGroup"
                                value={input.categoryGroup || ''} // null인 경우 빈 문자열
                                onChange={changeCat}
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.filter(c => c.categoryDepth === 1).map(category => (
                                    <option key={category.categoryNo} value={category.categoryNo}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>                           
                        </div>
                    )}

                    {/* 소분류 수정 가능 */}
                    {input.categoryDepth === 3 && (
                        <div className="mb-3">
                            <label className="form-label">대분류</label>
                            <select
                                className="form-select"
                                name="categoryGroup"
                                value={input.categoryGroup || ''} // null인 경우 빈 문자열
                                onChange={changeCat}
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.filter(c => c.categoryDepth === 1).map(category => (
                                    <option key={category.categoryNo} value={category.categoryNo}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>

                            <label className="form-label mt-3">중분류</label>
                            <select
                                className="form-select"
                                name="categoryUpper"
                                value={input.categoryUpper || ''}
                                onChange={changeCat}
                                required
                            >
                                <option value="">선택하세요</option>
                                {categories.filter(c => c.categoryDepth === 2).map(category => (
                                    <option key={category.categoryNo} value={category.categoryNo}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary">수정하기</button>
                    <button type="button" className='btn btn-secondary ms-2' onClick={() => navigate('/admin/category/list')}>
                        취소하기
                    </button>
                </form>
            </div>
        </>
    );
};

export default CategoryEdit;
