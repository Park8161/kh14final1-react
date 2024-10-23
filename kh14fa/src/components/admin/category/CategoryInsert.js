import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const CategoryInsert = () => {
    const [categoryDepth, setCategoryDepth] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryGroup, setCategoryGroup] = useState(0);
    const [categoryUpper, setCategoryUpper] = useState('');
    const [categoryLower, setCategoryLower] = useState('');

    const [filteredCategoryGroup, setFilteredCategoryGroup] = useState([]);
    const [filteredCategoryUpper, setFilteredCategoryUpper] = useState([]);
    const [filteredCategoryLower, setFilteredCategoryLower] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/admin/category/listP");
                const data = response.data;
                setFilteredCategoryGroup(data.filter(cat => cat.categoryDepth === 1));
                // console.log(response.data);
                setFilteredCategoryLower(data.filter(cat => cat.categoryDepth === 2));
                console.log(filteredCategoryLower);
            } catch (error) {
                toast.error('카테고리 목록을 가져오는 데 실패했습니다.');
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryDepthChange = (e) => {
        const value = e.target.value;
        setCategoryDepth(value);
        setCategoryGroup('');
        setCategoryUpper('');
        setCategoryName('');
        setFilteredCategoryUpper([]);
    };

    const handleCategoryGroupChange = async (e) => {
        const value = e.target.value;
        setCategoryGroup(value);
        setCategoryUpper('');
        setCategoryName('');

        // 중분류 목록 필터링
        // try {
        //     const response = await axios.get(`/admin/category/upper/${value}`);
        //     const upperCategories = response.data;
        //     setFilteredCategoryUpper(upperCategories);
        // } catch (error) {
        //     toast.error('중분류 목록을 가져오는 데 실패했습니다.');
        // }
        setFilteredCategoryUpper(filteredCategoryGroup.filter(category => category.categoryDepth == 2));
        // console.log(filteredCategoryGroup);
    };

    const handleCategoryUpperChange = useCallback((e) => {
        setCategoryUpper(e.target.value);
    }, [categoryUpper]);

    const handleCategoryLowerChange = useCallback((e) => {
        setCategoryLower(e.target.value);
    }, [categoryLower]);


    const handleSubmit = useCallback(async () => {
        // 입력값 검증
        if (!categoryName.trim()) {
            toast.error("카테고리 이름을 입력해주세요.");
            return;
        }
        if (categoryDepth === '1' && !categoryName) {
            toast.error("대분류 이름을 입력해주세요.");
            return;
        }
        if (categoryDepth === '2' && !categoryUpper) {
            toast.error("대분류를 먼저 선택해주세요.");
            return;
        }
        if (categoryDepth === '2' && !categoryName) {
            toast.error("중분류 이름을 입력해주세요.");
            return;
        }
        if (categoryDepth === '3' && !categoryUpper) {
            toast.error("중분류를 먼저 선택해주세요.");
            return;
        }
        if (categoryDepth === '3' && !categoryName) {
            toast.error("소분류 이름을 입력해주세요.");
            return;
        }
        // console.log(categoryUpper);

        // 카테고리 데이터 구성
        const newCategory = {
            categoryName,
            categoryGroup,
            categoryUpper: parseInt(categoryLower),
            categoryDepth: parseInt(categoryDepth, 10) // 숫자로 변환
        };

        // console.log(newCategory.categoryUpper);
        // 카테고리 추가 API 호출
        try {
            await axios.post("/admin/category/insert", newCategory);
            toast.success('카테고리가 추가되었습니다.');
            // 상태 초기화
            setCategoryDepth('');
            setCategoryGroup('');
            setCategoryUpper('');
            setCategoryName('');
            setFilteredCategoryUpper([]);
            navigate("/admin/category/list");
        } catch (error) {
            toast.error('카테고리 추가에 실패했습니다.');
        }
    }, [categoryDepth, categoryName, categoryUpper, categoryGroup]);

    return (
        <div className="container">
            <h2>카테고리 추가</h2>

            {/* 카테고리 항목 선택 */}
            <div className="form-group">
                <label>카테고리 항목 선택</label>
                <select
                    className="form-control"
                    value={categoryDepth}
                    onChange={handleCategoryDepthChange}
                >
                    <option value="">선택하세요</option>
                    <option value="1">대분류</option>
                    <option value="2">중분류</option>
                    <option value="3">소분류</option>
                </select>
            </div>

            {/* 대분류 추가 */}
            {categoryDepth === '1' && (
                <div className="form-group">
                    <label>대분류 이름</label>
                    <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="대분류 이름을 입력하세요"
                    />
                    <button className="btn btn-primary mt-2" onClick={handleSubmit}>대분류 추가</button>
                </div>
            )}

            {/* 중분류 추가 */}
            {categoryDepth === '2' && (
                <div>
                    <div className="form-group">
                        <label>대분류 선택</label>
                        <select
                            className="form-control"
                            value={categoryUpper}
                            onChange={handleCategoryUpperChange}
                        >
                            <option value="">대분류 선택</option>
                            {filteredCategoryGroup.map(cat => (
                                <option key={cat.categoryNo} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {categoryUpper && (
                        <div className="form-group">
                            <label>중분류 이름</label>
                            <input
                                type="text"
                                className="form-control"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="중분류 이름을 입력하세요"
                            />
                            <button className="btn btn-primary mt-2" onClick={handleSubmit}>중분류 추가</button>
                        </div>
                    )}
                </div>
            )}

            {/* 소분류 추가 */}
            {categoryDepth === '3' && (
                <div>
                    <div className="form-group">
                        <label>대분류 선택</label>
                        <select
                            className="form-control"
                            value={categoryUpper}
                            onChange={handleCategoryUpperChange}
                        >
                            <option value="">대분류 선택</option>
                            {filteredCategoryGroup.map(cat => (
                                <option key={cat.categoryNo} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {categoryUpper && (
                        <div className="form-group">
                            <label>중분류 선택</label>
                            <select
                                className="form-control"
                                value={categoryLower}
                                onChange={handleCategoryLowerChange}
                            >
                                <option value="">중분류 선택</option>
                                {filteredCategoryLower.map(cat => (
                                    <option key={cat.categoryNo} value={cat.categoryNo}>
                                        {cat.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {categoryLower && (
                        <div className="form-group">
                            <label>소분류 이름</label>
                            <input
                                type="text"
                                className="form-control"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="소분류 이름을 입력하세요"
                            />
                            <button className="btn btn-primary mt-2" onClick={handleSubmit}>소분류 추가</button>
                        </div>
                    )}
                </div>
            )}

            {/* 취소 버튼 추가 */}
            <button className="btn btn-secondary mt-3" onClick={() => navigate('/admin/category/list')}>
                취소
            </button>
        </div>
    );
};

export default CategoryInsert;
