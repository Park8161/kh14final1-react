import axios from "axios";
import { useEffect, useState } from "react";
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const NoticeList = () => {
    const [notice, setNotice] = useState([]); // 전체 공지사항 리스트
    const [filteredNotice, setFilteredNotice] = useState([]); // 검색 필터된 공지사항 리스트
    const [column, setColumn] = useState('notice_title');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    const navigate = useNavigate();

    // 공지사항 목록을 불러오는 API 호출
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:8080/notice/list');
                setNotice(response.data);
                setFilteredNotice(response.data); // 초기 필터된 공지사항 리스트도 전체로 설정
            } catch (error) {
                console.error("Error fetching notice data", error);
            }
        };

        fetchNotices();
    }, []);

    // 공지사항 정렬 (최근 글이 위로)
    const sortedFilteredNotice = [...filteredNotice].sort((a, b) => new Date(b.noticeWtime) - new Date(a.noticeWtime));

    // 페이지 
    const getPagedNotice = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedFilteredNotice.slice(startIndex, endIndex);
    };

    // 공지사항 삭제 처리
    const handleDelete = (noticeNo) => {
        axios.delete(`http://localhost:8080/notice/delete/${noticeNo}`)
            .then(() => {
                setNotice(notice.filter(n => n.noticeNo !== noticeNo));
                setFilteredNotice(filteredNotice.filter(n => n.noticeNo !== noticeNo));
            })
            .catch(error => {
                console.error("Error deleting notice", error);
            });
    };

    // 검색 기능 실행
    const searchNoticeList = () => {
        if (keyword.trim() === "") {
            setFilteredNotice(notice); // 검색어가 없으면 전체 공지사항으로 복원
        } else {
            const filtered = notice.filter(notic => {
                return notic[column] && notic[column].toString().toLowerCase().includes(keyword.toLowerCase());
            });
            setFilteredNotice(filtered); // 필터된 공지사항 리스트 업데이트
        }
        setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
    };

    return (
        <>
            <Jumbotron title="공지사항 게시글" />
            {/* 검색창 */}
            <div className="row mt-4">
                <div className="col">
                    <div className="input-group">
                        <div className="col-3">
                            <select className="form-select" value={column} onChange={e => setColumn(e.target.value)}>
                                <option value="notice_title">제목</option>
                                <option value="notice_type">종류</option>
                            </select>
                        </div>
                        <div className="col-7">
                            <input type="text" className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} />
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
