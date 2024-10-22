import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";

const QnaEdit =()=>{
    const { qnaNo } = useParams();
    const navigate = useNavigate();

    //state
    const [qna, setQna] = useState(null);

    //effect
    useEffect(()=>{
        loadQna();
    }, []);
    
    //callback
    const loadQna = useCallback(async ()=>{
        try{
            const resp = await axios.get("/qna/", qnaNo);
            setQna(resp.data);
        }
        catch(e){
            setQna(null);
        }
    }, [qna, qnaNo]);

    const changeQna = useCallback(e=>{
        setQna({
            ...qna,
            [e.target.name] : e.target.value
        });
    }, [qna]);

    const editQna = useCallback(async ()=>{
        await axios.put("", qna);
        navigate("/qna/" + qnaNo);//상세
    }, [qna]);

    //view
    return (qna !== null ? (<>
        <Jumbotron title={qna.qnaNo+"번 Qna 수정"}/>

        <div className="row mt-4">
            <div className="col">
                <label>종류0</label>
                <input type="text" name="qnaType" className="form-control"
                    value={qna.qnaType} onChange={changeQna}/>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col">
                <label>내용</label>
                <input type="text" name="qnaContent" className="form-control"
                    value={qna.qnaContent} onChange={changeQna}/>
            </div>
        </div>

        <div className="row mt-4">
            <div className="col text-center">
                <button type="button" className="btn btn-lg btn-success"
                    onClick={editQna}>수정</button>
                <button type="button" className="btn btn-lg btn-success"
                    onClick={navigate("/qna/list")}>목록</button>
            </div>
        </div>
    </>) : (<></>));
};

export default QnaEdit;