import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { GoPencil } from "react-icons/go";

const QnaList = () => {
    const [qna, setQna] = useState([]); // 전체 공지사항 리스트
    const [filteredQna, setFilteredQna] = useState([]); // 검색 필터된 공지사항 리스트
    const [column, setColumn] = useState('qna_title');
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    const navigate = useNavigate();

    // 공지사항 목록을 불러오는 API 호출
    useEffect(() => {
        // const fetchQnas = async () => {
        //     try {
        //         const response = await axios.get('http://localhost:8080/qna/list');
        //         setQna(response.data);
        //         setFilteredQna(response.data); // 초기 필터된 공지사항 리스트도 전체로 설정
        //     } catch (error) {
        //         console.error("Error fetching qna data", error);
        //     }
        // };

        fetchQnas();
    }, []);

    const fetchQnas = useCallback( async () => {
        try {
            const response = await axios.get('http://localhost:8080/qna/list');
            setQna(response.data);
            setFilteredQna(response.data); // 초기 필터된 공지사항 리스트도 전체로 설정
        } catch (error) {
            console.error("Error fetching qna data", error);
        }
    },[qna, filteredQna]);


    // 공지사항 정렬 (최근 글이 위로)
    const sortedFilteredQna = [...filteredQna].sort((a, b) => new Date(b.qnaWtime) - new Date(a.qnaWtime));

    // 페이지 
    const getPagedQna = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedFilteredQna.slice(startIndex, endIndex);
    };

    // 공지사항 삭제 처리
    const deleteQna = useCallback(async(qna)=>{
        const choice = window.confirm("정말 삭제하시겠습니까?");
        // if(choice == false) return;

        await axios.delete("http://localhost/qna/" + qna.qnaNo);
        fetchQnas();
    })

    // 검색 기능 실행
    const searchQnaList = () => {
        if (keyword.trim() === "") {
            setFilteredQna(qna); // 검색어가 없으면 전체 공지사항으로 복원
        } else {
            const filtered = qna.filter(qn => {
                return qn[column] && qn[column].toString().toLowerCase().includes(keyword.toLowerCase());
            });
            setFilteredQna(filtered); // 필터된 공지사항 리스트 업데이트
        }
        setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
    };

    return (
        <>
            <Jumbotron title="1:1문의 게시글" />
            {/* 검색창 */}
            <div className="row mt-4">
                <div className="col">
                    <div className="input-group">
                        <div className="col-3">
                            <select className="form-select" value={column} onChange={e => setColumn(e.target.value)}>
                                <option value="qna_title">제목</option>
                                <option value="qna_type">분류</option>
                            </select>
                        </div>
                        <div className="col-7">
                            <input type="text" className="form-control" value={keyword} onChange={e => setKeyword(e.target.value)} />
                        </div>
                        <div className="col-2">
                            <button type="button" className="btn btn-secondary w-100" onClick={searchQnaList}>
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
                    <button className="btn btn-success ms-2" onClick={() => navigate("/qna/insert")}>
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
                                    <th>내용</th>
                                    <th>작성일</th>
                                    <th>수정일</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPagedQna().map(q => (
                                    <tr key={q.qnaNo}>
                                        <td>{q.qnaNo}</td>
                                        <td>
                                            <NavLink to={`/qna/detail/${q.qnaNo}`}>
                                                {q.qnaTitle}
                                            </NavLink>
                                        </td>
                                        <td>{q.qnaType}</td>
                                        <td>{q.qnaWriter}</td>
                                        <td>{q.qnaContent}</td>
                                        <td>{q.qnaWtime}</td>
                                        <td>{q.qnaUtime}</td>
                                        <td>{q.qnaViews}</td>
                                        <td>
                                            <GoPencil className="text-warning"
                                                onClick={e=>deleteQna(qna)}/>
                                        </td>
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
                    <span className="mx-3">Page {page} of {Math.ceil(sortedFilteredQna.length / pageSize)}</span>
                    <button className="btn btn-outline-primary" disabled={page === Math.ceil(sortedFilteredQna.length / pageSize)} onClick={() => setPage(page + 1)}>
                        다음
                    </button>
                </div>
            </div>
        </>
    );
};

export default QnaList;
