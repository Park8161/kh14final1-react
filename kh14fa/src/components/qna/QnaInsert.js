import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import Jumbotron from "../Jumbotron";
import { ToastContainer, toast } from 'react-toastify'; // 추가

const QnaInsert = () => {
    // navigate
    const navigate = useNavigate();

    // state
    const [input, setInput] = useState({
        qnaType: "",
        qnaTitle: "",
        qnaContent: "",
    });

    // callback
    const changeInput = useCallback(e => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const saveQna = useCallback(async () => {
        // 입력 값 검증
        if (!input.qnaType) {
            toast.error("분류를 선택해 주세요");
            return;
        }
        if (!input.qnaTitle) {
            toast.error("제목을 입력해 주세요");
            return;
        }
        if (!input.qnaContent) {
            toast.error("내용을 입력해 주세요");
            return;
        }
        
        try {
            const resp = await axios.post("/qna/insert", input);
            navigate("/qna/list");
        } catch (error) {
            toast.error("오류가 발생했습니다."); // 추가 오류 처리
        }
    }, [input, navigate]);

    // view
    return (
        <>
            <Jumbotron title="QnA 등록" />
            <ToastContainer /> {/* 알림 컨테이너 추가 */}

            <div className="row mt-4">
                <div className="col">
                    <label>분류</label>
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
                        value={input.qnaTitle} onChange={changeInput} />
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
                        rows={15}
                        style={{ resize: 'none' }}
                    />
                </div>
            </div>

            <div className="row mt-4 text-end">
                <div className="col mt-4">
                    <button type="button" className="btn btn-success me-3"
                        onClick={saveQna}>등록</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={e => navigate("/qna/list")}>목록</button>
                </div>
            </div>
        </>
    );
};

export default QnaInsert;
