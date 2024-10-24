import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const NoticeList = () => {
    const [notice, setNotice] = useState([]); // 전체 공지사항 리스트
    const [filteredNotice, setFilteredNotice] = useState([]); // 검색 필터된 공지사항 리스트
    const [column, setColumn] = useState('');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    const navigate = useNavigate();

    // 공지사항 목록을 불러오는 API 호출
    useEffect(() => {
        loadNoticeList();
    }, []);
    
    // 기본적인 리스트 불러오기 (검색X)
    const loadNoticeList = useCallback(async()=>{
        const response = await axios.get('/notice/list');
        setNotice(response.data);
    },[notice]);

    // 검색기능 있는 리스트
    const searchNoticeList = useCallback(async()=>{
        // column, keyword가 없다면 차단
        if(column.trim().length === 0) return loadNoticeList();
        if(keyword.trim().length === 0) return loadNoticeList();

        const response = await axios.get(`/notice/list/column/${encodeURIComponent(column)}/keyword/${encodeURIComponent(keyword)}`);
        setNotice(response.data);
    },[column,keyword]);

    // 공지사항 정렬 (최근 글이 위로)
    const sortedFilteredNotice = [...notice].sort((a, b) => new Date(b.noticeWtime) - new Date(a.noticeWtime));

    // 페이지 
    const getPagedNotice = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedFilteredNotice.slice(startIndex, endIndex);
    };

    // 공지사항 삭제 처리
    const deleteNotice = (noticeNo) => {
        axios.delete(`/notice/delete/${noticeNo}`)
        setNotice(notice.filter(n => n.noticeNo !== noticeNo));
    };

    // 검색 기능 실행
    // const searchNoticeList = () => {
    //     if (keyword.trim() === "") {
    //         setFilteredNotice(notice); // 검색어가 없으면 전체 공지사항으로 복원
    //     } else {
    //         const filtered = notice.filter(notic => {
    //             return notic[column] && notic[column].toString().toLowerCase().includes(keyword.toLowerCase());
    //         });
    //         setFilteredNotice(filtered); // 필터된 공지사항 리스트 업데이트
    //     }
    //     setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
    // };

    return (
        <>
            <Jumbotron title="공지사항 게시글" />
            {/* 검색창 */}
            <div className="row mt-4">
                <div className="col">
                    <div className="input-group">
                        <div className="col-3">
                            <select className="form-select" name="column" value={column} onChange={e => setColumn(e.target.value)}>
                                <option value="">선택</option>  
                                <option value="notice_title">제목</option>
                                <option value="notice_type">종류</option>
                            </select>
                        </div>
                        <div className="col-7">
                            <input type="search" className="form-control" name="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} />
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-secondary w-100" onClick={searchNoticeList}>
                                <FaMagnifyingGlass />
                                검색
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 등록 버튼 */}
            <div className="row mt-4">
                <div className="col">
                    <button className="btn btn-success ms-2" onClick={() => navigate("/notice/insert")}>
                        <FaPlus />
                        등록
                    </button>
                </div>
            </div>

            {/* 목록 표시 자리 */}
            <div className="row mt-4">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table text-nowrap">
                            <thead>
                                <tr>
                                    <th>글 번호</th>
                                    <th>제목</th>
                                    <th>분류</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>수정일</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPagedNotice().map(n => (
                                    <tr key={n.noticeNo}>
                                        <td>{n.noticeNo}</td>
                                        <td>
                                            <NavLink to={`/notice/detail/${n.noticeNo}`}>
                                                {n.noticeTitle}
                                            </NavLink>
                                        </td>
                                        <td>{n.noticeType}</td>
                                        <td>{n.noticeWriter}</td>
                                        <td>{n.noticeWtime}</td>
                                        <td>{n.noticeUtime}</td>
                                        <td>{n.noticeViews}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 페이징 */}
            <div className="row mt-4">
                <div className="col text-center">
                    <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        이전
                    </button>
                    <span className="mx-3">Page {page} of {Math.ceil(sortedFilteredNotice.length / pageSize)}</span>
                    <button className="btn btn-outline-primary" disabled={page === Math.ceil(sortedFilteredNotice.length / pageSize)} onClick={() => setPage(page + 1)}>
                        다음
                    </button>
                </div>
            </div>
        </>
    );
};

export default NoticeList;
