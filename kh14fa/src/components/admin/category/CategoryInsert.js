import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryInsert = () => {
    const [categoryDepth, setCategoryDepth] = useState(''); // 대분류, 중분류, 소분류 선택
    const [categoryName, setCategoryName] = useState(''); // 카테고리 이름
    const [categoryGroup, setCategoryGroup] = useState(''); // 대분류 선택
    const [categoryUpper, setCategoryUpper] = useState(''); // 중분류 선택

    const [filteredCategoryGroup, setFilteredCategoryGroup] = useState([]); // 대분류 목록
    const [filteredCategoryUpper, setFilteredCategoryUpper] = useState([]); // 중분류 목록

    // 대분류, 중분류, 소분류 목록을 초기화합니다.
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/admin/category/listP");
                const data = response.data;

                // 대분류만 필터링하여 저장
                setFilteredCategoryGroup(data.filter(cat => cat.categoryDepth === 1));
            } catch (error) {
                toast.error('카테고리 목록을 가져오는 데 실패했습니다.');
            }
        };

        fetchCategories();
    }, []);

    // 카테고리 항목 선택 시
    const handleCategoryDepthChange = (e) => {
        setCategoryDepth(e.target.value);
        setCategoryGroup(''); // 대분류 초기화
        setCategoryUpper(''); // 중분류 초기화
        setCategoryName(''); // 입력값 초기화
    };

    // 대분류 선택 시
    const handleCategoryGroupChange = (e) => {
        const value = e.target.value;
        setCategoryGroup(value);

        // 선택된 대분류에 해당하는 중분류 목록 필터링
        const filteredUpper = filteredCategoryGroup.filter(cat => cat.categoryGroup === parseInt(value));
        setFilteredCategoryUpper(filteredUpper);
    };

    // 카테고리 추가 요청
    const handleSubmit = async () => {
        // 유효성 검사
        if (!categoryName.trim()) {
            toast.error("카테고리 이름을 입력해주세요.");
            return;
        }
        if (categoryDepth === '1' && !categoryName) {
            toast.error("대분류 이름을 입력해주세요.");
            return;
        }
        if (categoryDepth === '2' && !categoryGroup) {
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

        const newCategory = {
            categoryName,
            categoryGroup,
            categoryUpper,
            categoryDepth: categoryDepth === '1' ? 1 : categoryDepth === '2' ? 2 : 3
        };

        try {
            await axios.post("/admin/category/insert", newCategory);
            toast.success('카테고리가 추가되었습니다.');
        } catch (error) {
            toast.error('카테고리 추가에 실패했습니다.');
        }
    };

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

            {/* 대분류 선택 시 대분류 추가 */}
            {categoryDepth === '1' && (
                <div className="form-group">
                    <label>대분류 선택</label>
                    <select
                        className="form-control"
                        value={categoryGroup}
                        onChange={handleCategoryGroupChange}
                    >
                        <option value="">대분류 선택</option>
                        {filteredCategoryGroup.map(cat => (
                            <option key={cat.categoryNo} value={cat.categoryNo}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                    {categoryGroup && (
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
                </div>
            )}

            {/* 중분류 선택 시 대분류와 중분류 추가 */}
            {categoryDepth === '2' && categoryGroup && (
                <div>
                    <div className="form-group">
                        <label>중분류 선택</label>
                        <select
                            className="form-control"
                            value={categoryUpper}
                            onChange={(e) => setCategoryUpper(e.target.value)}
                        >
                            <option value="">중분류 선택</option>
                            {filteredCategoryUpper.map(cat => (
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

            {/* 소분류 선택 시 대분류, 중분류, 소분류 추가 */}
            {categoryDepth === '3' && categoryGroup && categoryUpper && (
                <div>
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
                </div>
            )}
        </div>
    );
};

export default CategoryInsert;
