import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { memberLevelState } from "../../utils/recoil";
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기

const QnaList = () => {
    const [qna, setQna] = useState([]); // 전체 공지사항 리스트
    const [filteredQna, setFilteredQna] = useState([]); // 검색 필터된 공지사항 리스트
    const [column, setColumn] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    const navigate = useNavigate();

    // 리코일
    const memberLevel = useRecoilValue(memberLevelState); // 사용자 권한 상태


    useEffect(() => {
        loadQnaList();
    }, []);

    // 기본적인 리스트 불러오기 (검색X)
    const loadQnaList = useCallback(async () => {
        const response = await axios.get("/qna/list");
        setQna(response.data);
    }, []);

    // 검색기능 있는 리스트
    const searchQnaList = useCallback(async () => {
        // column, keyword가 없다면 차단
        if (column.trim().length === 0) return loadQnaList();
        if (keyword.trim().length === 0) return loadQnaList();

        const response = await axios.get(`/qna/list/column/${encodeURIComponent(column)}/keyword/${encodeURIComponent(keyword)}`);
        setQna(response.data);
    }, [column, keyword]);

    // 공지사항 정렬 (최근 글이 위로)
    const sortedFilteredQna = [...qna].sort((a, b) => new Date(b.qnaWtime) - new Date(a.qnaWtime));

    // 페이지 
    const getPagedQna = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedFilteredQna.slice(startIndex, endIndex);
    };

    return (
        <>
            {/* 검색창 */}
            <div className="row mt-4">
                <div className="col-6 offset-3">
                    <div className="input-group">
                            <select className="form-select w-auto" name="column" value={column} onChange={e => setColumn(e.target.value)}>
                                <option value="">선택</option>
                                <option value="qna_title">제목</option>
                                <option value="qna_type">분류</option>
                            </select>
                            <input type="search" className="form-control w-auto" name="keyword" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="검색어 입력"/>
                            <button type="button" className="btn btn-secondary" onClick={searchQnaList}>
                                <FaMagnifyingGlass />
                                검색
                            </button>
                        </div>
                    </div>
            {/* 등록 버튼 */}
            {memberLevel !== "관리자" &&(
            <div className="col-3 text-start">
                    <button className="btn btn-success" onClick={e=>navigate("/qna/insert")}>
                        <FaPlus />
                        등록
                    </button>
                </div>
        )}
        </div>

            {/* 목록 표시 자리 */}
            <div className="row mt-4">
                <div className="col-8 offset-2">
                    {/*<div className="table-responsive">*/}
                        <table className="table border table-hover table-no-borders text-center">
                            <thead>
                                <tr>
                                    <th>글 번호</th>
                                    <th>분류</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPagedQna().map(q => (
                                    <tr key={q.qnaNo} className="cursor-pointer" onClick={e=>navigate(`/qna/detail/${q.qnaNo}`)}>
                                        <td>{q.qnaNo}</td>
                                        <td>{q.qnaType}</td>
                                        <td className="text-start ps-4" style={{maxWidth:"350px"}}>{q.qnaTitle} [{q.qnaReplies}]
                                        </td>
                                        <td>{q.qnaWriter}</td>
                                        {q.qnaUtime ? (
                                        <td>
                                            {moment(q.qnaUtime).format("YYYY-MM-DD")}(수정됨)
                                        </td>
                                        ) : (
                                        <td>
                                            {moment(q.qnaWtime).format("YYYY-MM-DD")}  
                                        </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            {/* 페이징 */}
            <div className="row mt-4">
                <div className="col text-center">
                    <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
                        이전
                    </button>
                    <span className="mx-3">{page} / {Math.ceil(sortedFilteredQna.length / pageSize)}</span>
                    <button className="btn btn-outline-primary" disabled={page === Math.ceil(sortedFilteredQna.length / pageSize)} onClick={() => setPage(page + 1)}>
                        다음
                    </button>
                </div>
            </div>
        </>
    );
};

export default QnaList;
