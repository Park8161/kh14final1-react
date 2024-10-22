import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";

const NoticeEdit = () => {
    const { noticeNo } = useParams();
    const navigate = useNavigate();

    //state
    const [notice, setNotice] = useState(null);

    //effect
    useEffect(() => {
        loadNotice();
    }, []);

    //callback
    const loadNotice = useCallback(async () => {
        try {
            const resp = await axios.get("/notice/edit", noticeNo);
            setNotice(resp.data);
        }
        catch (e) {
            setNotice(null);
        }
    }, [notice, noticeNo]);

    const changeNotice = useCallback(e => {
        setNotice({
            ...notice,
            [e.target.name]: e.target.value
        });
    }, [notice]);


const editNotice = useCallback(async () => {
    await axios.put("", notice);
    navigate("/notice/detail" + noticeNo);//상세
}, [notice]);

//view
return (notice !== null ? (<>
    <Jumbotron title={notice.noticeNo+"번 글 수정"}/>

    <div className="row mt-4">
        <div className="col">
            <label>종류</label>
            <input type="text" name="noticeType" className="form-control"
                value={notice.noticeType} onChange={changeNotice}/>
        </div>
    </div>

    <div className="row mt-4">
        <div className="col">
            <label>제목</label>
            <input type="text" name="noticeTitle" className="form-control"
                value={notice.noticeTitle} onChange={changeNotice}/>
        </div>
    </div>

    <div className="row mt-4">
        <div className="col">
            <label>내용</label>
            <input type="text" name="noticeContent" className="form-control"
                value={notice.noticeContent} onChange={changeNotice}/>
        </div>
    </div>

    <div className="row mt-4">
        <div className="col text-center">
            <button type="button" className="btn btn-lg btn-success"
                onClick={editNotice}>수정</button>
            <button type="button" className="btn btn-lg btn-success"
                    onClick={navigate("/notice/list")}>목록</button>
        </div>
    </div>
    </>) : (<></>));
};

export default NoticeEdit;