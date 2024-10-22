import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";

const QnaDetail = ()=>{
    //파라미터 읽는 명령
    const {qnaNo} = useParams();

    const navigate = useNavigate();

    //state
    const [qna, setQna] = useState(null);
    const [load, setLoad] = useState(false);

    //effect
    useEffect(()=>{
        loadQna();
    }, []);

    //callback
    const loadQna = useCallback(async ()=>{
        try{
            const resp = await axios.get("/qna/" + qnaNo);
            setQna(resp.data);
        }
        catch(e){
            setQna(null);
        }
        setLoad(true);
    }, [qna, qnaNo]);

    const deleteQna = useCallback(async ()=>{
        await axios.delete("/qna/" + qnaNo);
        navigate("/qna/list");
    }, [qna, qnaNo]);

    if(load === false){
        return (<>
            <Jumbotron title={"?번 글 상세 정보"}/>

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

            {/*버튼*/}
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

    if(qna === null){
        return <Navigate to ="/notFound"/>
    }

    return(<>
        <Jumbotron title={qnaNo + "번 글 상세정보"}/>

        <div className="row mt-4">
            <div className="row sm-3">
                작성자
        </div>
        <div className="col-sm-9">
            {qna.qnaWriter}
        </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                종류
            </div>
            <div className="col-sm-9">
                {qna.qnaType}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                제목
            </div>
            <div className="col-sm-9">
                {qna.qnaTitle}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                내용
            </div>
            <div className="col-sm-9">
                {qna.qnaContent}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                작성시간
            </div>
            <div className="col-sm-9">
                {qna.qnaWtime}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                수정시간
            </div>
            <div className="col-sm-9">
                {qna.qnaUtime}
            </div>
        </div>

        <div className="row mt-4">
            <div className="col-sm-3">
                조회수
            </div>
            <div className="col-sm-9">
                {qna.qnaViews}
            </div>
        </div>

        {/*버튼*/}
        <div className="row mt-4">
            <div className="col text-end">
                <button className="btn btn-success"
                onClick={e=>navigate("/qna/insert")}>등록</button>
                <button className="btn btn-secondary ms-2"
                    onClick={e=>navigate("/qna/list")}>목록</button>
                <button className="btn btn-warning ms-2"
                    onClick={e=>navigate("/qna/edit/"+qnaNo)}>수정</button>
                <button className="btn btn-danger ms-2"
                    onClick={deleteQna}>삭제</button>
            </div>
        </div>
    </>);
};

export default QnaDetail;