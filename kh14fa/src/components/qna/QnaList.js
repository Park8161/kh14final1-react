import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router"
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const QnaList = () => {
    //navigator
    const navigate = useNavigate();

    //state
    const [qnaList, setQnaList] = useState([]);

    const [column, setColumn] = useState("qna_title");
    const [keyword, setKeyword] = useState("");

    const searchQnaList = useCallback(async () => {
        if (keyword.trim().length === 0) {
            loadQnaList();
            return;
        }

        const endcodeKeyword = encodeURIComponent(keyword);
        const resp = await axios.get(`/qna/column/${column}/keyword/${endcodeKeyword}`);
        setQnaList(resp.data);
    }, [column, keyword, qnaList]);

    //effect
    useEffect(() => {
        loadQnaList();
    }, []);

    //callback
    const loadQnaList = useCallback(async () => {
        const resp = await axios.get("/qna/");
        setQnaList(resp.data);
    }, [qnaList]);

    return (<>
        <Jumbotron title="QnA" />

        {/*검색창*/}
        <div className="row mt-4">
            <div className="col">
                <div className="input-group">
                    <div className="col-3">
                        <select className="form-select"
                            value={column} onChange={e => setColumn(e.target.value)}>
                            <option value="qna_title">제목</option>
                            <option value="qna_type">종류</option>
                        </select>
                    </div>
                    <div className="col-7">
                        <input type="text" className="form-control"
                            value={keyword} onChange={e => setColumn(e.target.value)} />
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-secondary w-100"
                            onClick={searchQnaList}>
                            <FaMagnifyingGlass />
                            검색
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/*등록 버튼*/}
        <div className="row mt-4">
            <div className="col">
                <button className="btn btn-success ms-2"
                    onClick={e => navigate("/qna/insert")}>
                    <FaPlus />
                    등록
                </button>
            </div>
        </div>

        {/*목록 표시 자리*/}
        <div className="row mt-4">
            <div className="col">
                <div className="table-responsive">
                    <table className="table text-nowrap">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>종류</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>수정일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qnaList.map(qna => {
                                <tr key={qna.qnaNo}>
                                    <td>{qna.qnaNo}</td>
                                    <td>
                                        <NavLink to={"/qna/detail/" + qna.qnaNo}>
                                            {qna.qnaTitle}
                                        </NavLink>
                                    </td>
                                    <td>{qna.qnaType}</td>
                                    <td>{qna.qnaWriter}</td>
                                    <td>{qna.qnaContent}</td>
                                    <td>{qna.qnaWtime}</td>
                                    <td>{qna.qnaUtime}</td>
                                    <td>{qna.qnaViews}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>);
};

export default QnaList;