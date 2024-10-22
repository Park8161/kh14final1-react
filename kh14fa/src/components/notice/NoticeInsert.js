import axios from "axios";
import Jumbotron from "../Jumbotron";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";

const NoticeInsert = () => {
    //navigate
    const navigate = useNavigate();

    //state
    const [input, setInput] = useState({
        noticeType: "",
        noticeTitle: "",
        noticeContent: "",
    });

    //callback
    const changeInput = useCallback(e => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const saveNotice = useCallback(async () => {
        //input의 형식 검사 후 차단 또는 허용

        const resp = await axios.post("/notice/insert", input);
        //알림코드
        navigate("/notice/list");
    }, [input]);
    

    //view
    return (<>
        <Jumbotron title="새 글 등록" />

        <div className="row mt-4">
            <div className="col">
                <label>종류</label>
                <select name="noticeType" className="form-select"
                    value={input.noticeType} onChange={changeInput}>
                    <option value="">선택하세요</option>
                    <option value="공지">공지</option>
                    <option value="이벤트">이벤트</option>
                </select>
            </div>
        </div>
        <div className="row mt-4">
            <div className="col">
                <label>제목</label>
                <input type="text" name="noticeTitle" className="form-control"
                    value={input.noticeTitle} onChange={changeInput} />
            </div>
        </div>
        <div className="row mt-4">
    <div className="col">
        <label>내용</label>
        <textarea 
            name="noticeContent" 
            className="form-control" 
            value={input.noticeContent} 
            onChange={changeInput} 
            rows={15} // 초기 높이
            style={{ resize: 'none' }} // 크기 조절 비활성화 (선택 사항)
        />
        </div>
    </div>

        <div className="row mt-4">
            <div className="col text-center">
                <button type="button" className="btn btn-lg btn-success"
                    onClick={saveNotice}>등록</button>
                <button type="button" className="btn btn-lg btn-secondary ms-2"
                    onClick={e => navigate("/notice/list")}>목록</button>
            </div>
        </div>
    </>);
};
export default NoticeInsert;