import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Jumbotron from '../../Jumbotron';
import { toast } from 'react-toastify';

const CategoryEdit = () => {
    const { categoryNo } = useParams(); // URL에서 categoryNo 가져오기
    const [category, setCategory] = useState({}); // 수정할 카테고리 데이터
    const navigate = useNavigate();
    const [input, setInput] = useState({
        categoryName:"",
        categoryGroup:"",
        categoryUpper:"",
        categoryDepth:""        
    });

    useEffect(() => {
        loadCategory();
    }, []);

    // 카테고리 로드
    const loadCategory = useCallback(async () => {
        try {
            const resp = await axios.get(`/admin/category/detail/${categoryNo}`);
            setCategory(resp.data);
        } catch (e) {
            console.error("Error loading category:", e);
            setCategory({}); // 에러 발생 시 빈 객체로 설정
        }
    }, []);

    // 카테고리 변경 처리
    const changeCat = useCallback(e => {
        setCategory({
            ...category,
            [e.target.name]: e.target.value,
        });
    }, [category]);

    // 카테고리 수정 처리
    const updateCat = useCallback(async (e) => {
        e.preventDefault(); // 기본 제출 이벤트 방지
        try {
            const response = await axios.post(`/admin/category/update/${categoryNo}`, category);
            toast.success('카테고리가 수정되었습니다.');
            navigate("/admin/category/list"); // 수정 후 목록으로 이동
            
        } catch (error) {
            toast.error('카테고리 수정에 실패했습니다.');
        }
    }, [category, categoryNo, navigate]);

    // category가 존재하는지 확인 후 렌더링
    if (!category) {
        return <div>Loading...</div>; // 로딩 중 상태
    }

    return (
        <>
            <Jumbotron title="카테고리 수정" />
            <div className="container mt-4">
                <form onSubmit={updateCat}>
                    <div className="mb-3">
                        <label className="form-label">카테고리 이름</label>
                        <input
                            type="text"
                            className="form-control"
                            name="categoryName"
                            value={category.categoryName || ''} // null인 경우 빈 문자열
                            onChange={changeCat}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">타입</label>
                        <select
                            className="form-select"
                            name="categoryDepth"
                            value={category.categoryDepth || ''} // null인 경우 빈 문자열
                            onChange={changeCat}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="1">대분류</option>
                            <option value="2">중분류</option>
                            <option value="3">소분류</option>
                        </select>
                    </div>
                    
                        <button type="submit" className="btn btn-primary">수정하기</button>
                        <button type="button" className='btn btn-secondary ms-2'
                                    onClick={() => navigate('/admin/category/list')}>
                            취소하기
                        </button>
                    
                </form>
            </div>
        </>
    );
};

export default CategoryEdit;
