import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import Jumbotron from "../Jumbotron";

const QnaInsert = ()=>{
    //navigate
    const navigate = useNavigate();

    //state
    const [input, setInput] = useState({
        qnaType : "",
        qnaTitle : "",
        qnaContent : "",
    });

    //callback
    const changeInput = useCallback(e=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    }, [input]);

    const saveQna = useCallback(async ()=>{
        const resp = await axios.Axios.post("/qna/", input);
        navigate("/qna/list");
    }, [input]);

    //view
    return(<>
        <Jumbotron title="QnA 등록"/>

        <div className="row mt-4">
            <div className="col">
                <label>종류</label>
                <select name="qnaType" className="form-select"
                    value={input.qnaType} onChange={changeInput}>
                    <option value="">선택하세요</option>
                    <option value="일반문의">일반문의</option>
                    <option value="거래문의">거래문의</option>
                    <option value="사이트오류">사이트오류</option>
                    <option value="차단문의">차단문의</option>
                    <option value="기타">기타</option>
                </select>
            </div>
        </div>
        <div className="row mt-4">
            <div className="col">
                <label>제목</label>
                <input type="text" name="qnaTitle" className="form-control"
                    value={input.qnaTitle} onChange={changeInput}/>
            </div>
        </div>
        <div className="row mt-4">
            <div className="col">
                <label>내용</label>
                <textarea
                    name="qnaContent"
                    className="form-control"
                    value={input.qnaContent}
                    onChange={changeInput}
                    row={15}
                    style={{ resize : 'none'}}
                />
            </div>
        </div>

        <div className="row mt-4">
            <div className="col text-center">
                <button type="button" className="btn btn-lg btn-success"
                    onClick={saveQna}>등록</button>
                <button type="button" className="btn btn-lg btn-secondary ms-2"
                    onClick={e => navigate("/qna/list")}>목록</button>
            </div>
        </div>
    </>);
};

export default QnaInsert;