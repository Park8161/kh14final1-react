import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../Jumbotron";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const NoticeList = ()=>{
    //navigator
    const navigate = useNavigate();

    //state
    const [noticeList, setNoticeList] = useState([]);

    const [column, setColumn] = useState("notice_title");
    const [keyword, setKeyword] = useState("");
    
    const searchNoticeList = useCallback(async ()=>{
        if(keyword.trim().length === 0) {
            loadNoticeList();
            return;
        }

        const encodeKeyword = encodeURIComponent(keyword);
        const resp = await axios.get(`/notice/column/${column}/keyword/${encodeKeyword}`);
        setNoticeList(resp.data);
    }, [column, keyword, noticeList]);

    //effect
    useEffect(()=>{
        loadNoticeList();
    }, []);

    //callback
    const loadNoticeList = useCallback(async ()=>{
        const resp = await axios.get("/notice/");
        setNoticeList(resp.data);
    }, [noticeList]);

    return(<>
        <Jumbotron title="공지사항 게시글"/>

        {/*검색창*/}
        <div className="row mt-4">
            <div className="col">
            <div className="input-group">
                    <div className="col-3">
                        <select className="form-select" 
                            value={column} onChange={e=>setColumn(e.target.value)}>
                            <option value="notice_title">제목</option>
                            <option value="notice_type">종류</option>
                        </select>
                    </div>
                    <div className="col-7">
                        <input type="text" className="form-control"
                            value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                    </div>
                    <div className="col-2">
                        <button type="button" className="btn btn-secondary w-100"
                                onClick={searchNoticeList}>
                            <FaMagnifyingGlass/>
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
                            onClick={e=>navigate("/notice/insert")}>
                    <FaPlus/>
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
                                <th>글 번호</th>
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
                            {noticeList.map(notice=>{
                            <tr key={notice.noticeNo}>
                                <td>{notice.noticeNo}</td>
                                <td>
                                    <NavLink to={"/notice/detail/"+notice.noticeNo}>
                                        {notice.noticeTitle}
                                    </NavLink>
                                </td>
                                <td>{notice.noticeType}</td>
                                <td>{notice.noticeWriter}</td>
                                <td>{notice.noticeContent}</td>
                                <td>{notice.noticeWtime}</td>
                                <td>{notice.noticeUtime}</td>
                                <td>{notice.noticeViews}</td>
                            </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
    </>);
};

export default NoticeList;