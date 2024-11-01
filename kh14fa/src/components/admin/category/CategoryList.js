import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { FaMagnifyingGlass } from "react-icons/fa6";
import { Modal } from 'bootstrap';
import { IoMdClose } from "react-icons/io";
import { FaAsterisk } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const CategoryList = () => {
    //ref
    const deleteCategoryModal = useRef();

    //state
    const [categories, setCategories] = useState([]); // 전체 카테고리 리스트
    const [filteredCategories, setFilteredCategories] = useState([]); // 검색 필터된 카테고리 리스트
    const [keyword, setKeyword] = useState(''); // 검색어
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수
    const [categoryToDelete, setCategoryToDelete] = useState([]); // 삭제할 카테고리

    const navigate = useNavigate();

    // 카테고리 목록을 불러오는 API 호출
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/admin/category/listP");                
                setCategories(response.data);  // 전체 카테고리 리스트
                setFilteredCategories(response.data); // 초기 필터된 카테고리 리스트도 전체로 설정
            } catch (error) {
                console.error("Error fetching category data", error);
            }
        };

        fetchCategories(); // async 함수 호출
    }, []);

    // 페이지
    const getPagedCategories = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredCategories.slice(startIndex, endIndex);
    };

    // 카테고리 삭제 처리
    const handleDelete = (categoryNo) => {
        axios.delete(`/admin/category/delete/${categoryNo}`)
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
                return category.categoryName.toLowerCase().includes(keyword.toLowerCase());
            });
            setFilteredCategories(filtered); // 필터된 카테고리 리스트 업데이트
        }

        setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
        // setKeyword(''); // 검색 후 입력값 초기화
    };

    // 대분류, 중분류, 소분류 필터
    const filterCategoryList = (depth) => {
        const filtered = categories.filter(category => category.categoryDepth === depth);
        setFilteredCategories(filtered);
    };

    // 전체보기 필터
    const showAllCategories = () => {
        setFilteredCategories(categories);
    };

    // 카테고리 삭제 모달
    const openDcModal = useCallback((category)=>{
        const modal = Modal.getOrCreateInstance(deleteCategoryModal.current);
        modal.show();
        // console.log(category);
        setCategoryToDelete(category);
    }, [deleteCategoryModal]);

    const closeDcModal = useCallback(()=>{
        const modal = Modal.getInstance(deleteCategoryModal.current);
        modal.hide();
    },[deleteCategoryModal]);

    return (
        <>
            

            {/* 검색창 */}
            <div className="row mt-2">
                <div className="col-md-4 offset-md-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control w-auto"
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            placeholder="카테고리 이름 검색"
                        />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={searchCategoryList}>
                            <FaMagnifyingGlass /> 검색
                        </button>
                    </div>
                </div>
            </div>

            {/*  카테고리 필터 버튼 / 카테고리 추가 버튼 */}
            <div className="row mt-4">
                <div className="col-4 offset-2 text-start">
                    <button
                        className="btn btn-outline-secondary me-2"
                        onClick={showAllCategories}>
                        전체보기
                    </button>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => filterCategoryList(1)}>
                        대분류
                    </button>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => filterCategoryList(2)}>
                        중분류
                    </button>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => filterCategoryList(3)}>
                        소분류
                    </button>
                </div>
                <div className="col-4 text-end">
                    <Link to="/admin/category/insert">
                        <button className="btn btn-success">카테고리 추가</button>
                    </Link>
                </div>
            </div>

            {/* 카테고리 목록 테이블 */}
            <div className="row mt-4">
                <div className="col-8 offset-2">
                    <table className="table border table-hover table-no-borders text-center">
                        <thead className="border-bottom">
                            <tr>
                                <th className="py-2">카테고리 이름</th>
                                <th className="py-2">타입</th>
                                <th className="py-2">대분류</th>
                                <th className="py-2">중분류</th>
                                <th className="py-2">소분류</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPagedCategories().map(category => (
                                <tr key={category.categoryNo}>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        {category.categoryDepth === 1 && '대분류'}
                                        {category.categoryDepth === 2 && '중분류'}
                                        {category.categoryDepth === 3 && '소분류'}
                                    </td>
                                    <td>{category.categoryDepth === 1 && category.categoryName}</td>
                                    <td>{category.categoryDepth === 2 && categories.filter(cat => cat.categoyNo === category.categoryGroup)[0]?.categoryName}</td>
                                    <td>{category.categoryDepth === 3 && category.categoryUpper}</td>
                                    <td>
                                        <Link to={`/admin/category/edit/${category.categoryNo}`}>
                                            <button className="btn btn-primary me-2 btn-sm">수정</button>
                                        </Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => openDcModal(category)}>
                                            삭제
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
                        disabled={page === 1 || filteredCategories.length === 0}
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

            {/* 카테고리 삭제 모달 */}
            <div className="modal fade" table="-1" ref={deleteCategoryModal} data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">

                            {/* 모달 헤더 - 제목, x버튼 */}
                            <div className="modal-header">
                                <p className="modal-title">카테고리 삭제</p>
                                <button type="button" className='btn-close btn-manual-close' onClick={closeDcModal}/>
                            </div>

                            {/* 모달 본문 */}
                            <div className="modal-body">
                                
                                <div className='row'>
                                    <div className='col d-flex justyfy-content-center align-items-center'>
                                    <FaAsterisk className="text-danger" />
                                    선택한 카테고리 [{categoryToDelete.categoryName}]가 삭제됩니다.
                                    <FaAsterisk className="text-danger" />
                                    </div>
                                </div>

                                <div className='row mt-4'>
                                    <div className='col'>
                                        <input type='text' className='form-control'
                                        value={categories.filter(cat => cat.categoryNo === categoryToDelete.categoryGroup)[0]?.categoryName}
                                        onChange={()=>{}} readOnly/>                                        
                                    </div>
                                </div>
                                {(categoryToDelete.categoryDepth === 2 || categoryToDelete.categoryDepth === 3) && (
                                <div className='row mt-4'>
                                    <div className='col'>
                                        <input type='text' className='form-control'
                                        value={categories.filter(cat => cat.categoryNo === categoryToDelete.categoryUpper)[0]?.categoryName}
                                        onChange={()=>{}} readOnly/>                                        
                                    </div>
                                </div>
                                )}
                                {categoryToDelete.categoryDepth === 3 && (
                                <div className='row mt-4'>
                                    <div className='col'>
                                        <input type='text' className='form-control'
                                        value={categories.filter(cat => cat.categoryNo === categoryToDelete.categoryNo)[0]?.categoryName}
                                        onChange={()=>{}} readOnly/>                                        
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                            <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeDcModal}>
                            닫기<IoMdClose className="ms-1 btn-lg-white"/>
                        </button>
                        <button type="button" className="btn btn-danger" 
                                    onClick={()=>{
                                        handleDelete(categoryToDelete.categoryNo);//삭제 처리
                                        closeDcModal(); // 모달 닫기
                                        }}>
                            삭제<MdDeleteForever className="ms-1"/>
                        </button>
                    </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryList;
