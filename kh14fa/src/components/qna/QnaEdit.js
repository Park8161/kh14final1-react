import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { toast } from "react-toastify";
import { FaAsterisk } from "react-icons/fa6";

const QnaEdit = () => {
    //navigate
    const navigate = useNavigate();

    const {qnaNo} = useParams();

    //state
    const [qna, setQna] = useState({});
    const [edit, setEdit] = useState({
        qnaType: "",
        qnaTitle: "",
        qnaContent: "",
    });

    //effect
    useEffect(() => {
        loadQna();
    }, []);

    //callback
    const loadQna = useCallback(async () => {
        const resp = await axios.get("/qna/detail/" + qnaNo);
        setEdit(resp.data);
    }, [qna, edit]);
    const returnBack = useCallback(() => {
        navigate(-1);
    }, []); 
    const goQnaEdit = useCallback(async () => {
        const resp = await axios.put("/qna/edit/"+qnaNo, edit);
        navigate("/qna/list");

        //알림코드
        toast.success("게시글 수정 완료!");
    }, [edit]);
    const changeEdit = useCallback((e) => {
        setEdit({
            ...edit,
            [e.target.name]: e.target.value
        });
    }, [edit]);

    //view
    return (
        <>

            <div className="row mt-4">
            <div className="col-3">분류<FaAsterisk className="text-danger" /></div> 
                        <select type="text" className="form-control" placeholder="분류"
                            name="qnaType" value={edit.qnaType} onChange={changeEdit}>
                            <option value="">선택하세요</option>
                    <option>일반문의</option>
                    <option>거래문의</option>
                    <option>사이트오류</option>
                    <option>차단문의</option>
                    <option>기타</option>
                    </select>
                    </div>

                <div className="row mt-4">
                <div className="col-3">제목<FaAsterisk className="text-danger" /></div>
                    <input className="form-control" placeholder="제목"
                        name="qnaTitle" value={edit.qnaTitle} onChange={changeEdit}></input>
                </div>
                <div className="row mt-4">
                    <div className="col-3">내용<FaAsterisk className="text-danger" /></div>
                        <textarea className="form-control" placeholder="내용"
                            name="qnaContent" value={edit.qnaContent} onChange={changeEdit}  rows={15}
                            style={{ resize : 'none'}} />
                </div>

                <div className="row mt-4 text-end">
                    <div className="col mt-4">
                        <button className="btn btn-danger me-3" onClick={returnBack}>
                            돌아가기
                        </button>
                        <button className="btn btn-info" onClick={goQnaEdit} >
                            수정하기
                        </button>
                    </div>
                </div>
        </>

    );
};
export default QnaEdit;