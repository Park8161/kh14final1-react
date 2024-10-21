import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Jumbotron from '../../Jumbotron'; 
import { FaMagnifyingGlass } from "react-icons/fa6";

const CategoryList = () => {
    const [categories, setCategories] = useState([]); // 전체 카테고리 리스트
    const [filteredCategories, setFilteredCategories] = useState([]); // 검색 필터된 카테고리 리스트
    const [column, setColumn] = useState('category_name');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    const navigate = useNavigate();

    // 카테고리 목록을 불러오는 API 호출
    useEffect(async() => {
        axios.get('http://localhost:8080/admin/category/listP')
            .then(response => {
                setCategories(response.data);  // 전체 카테고리 리스트
                setFilteredCategories(response.data); // 초기 필터된 카테고리 리스트도 전체로 설정
            })
            .catch(error => {
                console.error("Error fetching category data", error);
            });
    }, []); 

    // 페이지 
    const getPagedCategories = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredCategories.slice(startIndex, endIndex);
    };

    // 카테고리 삭제 처리
    const handleDelete = (categoryNo) => {
        axios.delete(`http://localhost:8080/admin/category/delete/${categoryNo}`)
            .then(() => {
                setCategories(categories.filter(category => category.categoryNo !== categoryNo));
                setFilteredCategories(filteredCategories.filter(category => category.categoryNo !== categoryNo));
            })
            .catch(error => {
                console.error("Error deleting category", error);
            });
    };


    // 검색 기능 실행
    const searchCategoryList = () => {
        if (keyword === "") {
            setFilteredCategories(categories); // 검색어가 없으면 전체 카테고리로 복원
        } else {
            const filtered = categories.filter(category => {
                return category[column].toLowerCase().includes(keyword.toLowerCase());
            });
            setFilteredCategories(filtered); // 필터된 카테고리 리스트 업데이트
        }
        setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
    };

    return (
        <>
            <Jumbotron title="카테고리 리스트" />

            {/* 검색창 */}
            <div className="row mt-2">
                <div className="col-md-6 offset-md-3">
                    <div className="input-group">
                        <select name="column" className="form-select w-auto"
                            value={column} onChange={e => setColumn(e.target.value)}>
                            <option value="category_name">카테고리 이름</option>
                            <option value="category_group">대분류</option>
                            <option value="category_depth">소분류</option>
                        </select>

                        <input type="text" className="form-control w-auto"
                            value={keyword} onChange={e => setKeyword(e.target.value)} />

                        <button type="button" className="btn btn-secondary"
                            onClick={searchCategoryList}>
                            <FaMagnifyingGlass /> 검색
                        </button>
                    </div>
                </div>
            </div>

            {/* 카테고리 추가 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/admin/category/add")}>
                        카테고리 추가
                    </button>
                </div>
            </div>

            {/* 카테고리 목록 테이블 */}
            <div className="row mt-4 ">
                <div className="col ">
                    <table className="table table-striped text-center ">
                        <thead>
                            <tr>
                                <th>카테고리 이름</th>
                                <th>타입</th>
                                <th>대분류</th>
                                <th>중분류</th>
                                <th>소분류</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPagedCategories().map(category => (
                                <tr key={category.categoryNo}>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        {category.categoryDepth === 1 && ('대분류')}
                                        {category.categoryDepth === 2 && ('중분류')}
                                        {category.categoryDepth === 3 && ('소분류')}
                                    </td>
                                    {category.categoryDepth===1  && (<>
                                        <td>{category.categoryNo}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        </>
                                    )}
                                    {category.categoryDepth===2 && (<>
                                        <td>{category.categoryGroup}</td>
                                        <td>{category.categoryNo}</td>
                                        <td>-</td>
                                        </>
                                    )}
                                    {category.categoryDepth===3  && (<>
                                        <td>{category.categoryGroup}</td>
                                        <td>{category.categoryUpper}</td>
                                        <td>{category.categoryNo}</td>
                                        </>
                                    )}
                                    {/* <td>{category.categoryGroup}</td>
                                    <td>{category.categoryUpper ?? 'None'}</td>
                                    <td>{category.categoryDepth}</td> */}
                                    <td>
                                        <Link to={`/admin/category/edit/${category.categoryNo}`}>
                                            <button className="btn btn-primary me-2">Edit</button>
                                        </Link>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(category.categoryNo)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 페이징 */}
            <div className="row mt-4">
                <div className="col text-center">
                    <button
                        className="btn btn-outline-primary"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}>
                        이전
                    </button>
                    <span className="mx-3">Page {page} of {Math.ceil(filteredCategories.length / pageSize)}</span>
                    <button
                        className="btn btn-outline-primary"
                        disabled={page === Math.ceil(filteredCategories.length / pageSize)}
                        onClick={() => setPage(page + 1)}>
                        다음
                    </button>
                </div>
            </div>
        </>
    );
};

export default CategoryList;
