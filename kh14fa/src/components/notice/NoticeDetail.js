import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router"
import Jumbotron from "../Jumbotron";

const NoticeDetail = ()=>{
    //파라미터 읽는 명령
    const {noticeNo} = useParams();

    //이동 도구
    const navigate = useNavigate();

    //state
    const [notice, setNotice] = useState(null);
    const [load, setLoad] = useState(false);

    //effect
    useEffect(()=>{
        loadNotice();
    }, []);

    //callback
    const loadNotice = useCallback(async ()=>{
        try{
            const resp = await axios.get("/notice/" + noticeNo);
            setNotice(resp.data);
        }
        catch(e){
            setNotice(null);
        }
        setLoad(true);
    }, [notice, noticeNo]);
    
    const deleteNotice = useCallback(async ()=>{
        await axios.delete("/notice/" + noticeNo);
        navigate("/notice/list");
    }, [notice, noticeNo]);

    if(load === false){
        return (<>
            <Jumbotron title={"?번 글 상세정보"}/>

            <div className="row mt-4">
                <div className="col-sm-3">
                    작성자
                </div>
                <div className="col-sm-9">
                    <span className="placeholder col-6"></span>
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-sm-3">
                    종류
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">
                    제목
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">
                    내용
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">
                    작성시간
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">
                    수정시간
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">
                    조회수
                </div>
                <div className="col-sm-9">
                <span className="placeholder col-4"></span>
                </div>
            </div>

            {/*버튼들*/}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-success placeholder col-2">등록</button>
                    <button className="btn btn-secondary placeholder col-2 ms-2">목록</button>
                    <button className="btn btn-warning placeholder col-2 ms-2">수정</button>
                    <button className="btn btn-danger placeholder col-2 ms-2">삭제</button>
                </div>
            </div>
        </>);
    }

    if(notice === null){
        return <Navigate to="/notFound"/>
    }

    return(<>
        <Jumbotron title={noticeNo + "번 글 상세정보"}/>

        <div className="row mt-4">
            <div className="col-sm-3">
                작성자
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                종류
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                제목
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                내용
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                작성시간
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                수정시간
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                조회수
            </div>
            <div className="col-sm-9">
                {notice.noticeWriter}
            </div>
        </div>

        {/*버튼들*/}
        <div className="row mt-4">
            <div className="col text-end">
                <button className="btn btn-success"
                onClick={e=>navigate("/notice/insert")}>등록</button>
                <button className="btn btn-secondary ms-2"
                    onClick={e=>navigate("/notice/list")}>목록</button>
                <button className="btn btn-warning ms-2"
                    onClick={e=>navigate("/notice/edit/"+noticeNo)}>수정</button>
                <button className="btn btn-danger ms-2"
                    onClick={deleteNotice}>삭제</button>
            </div>
        </div>

    </>);
};

export default NoticeDetail;