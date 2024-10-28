import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { toast } from "react-toastify";
import { FaAsterisk } from "react-icons/fa6";

const NoticeEdit = () => {
    //navigate
    const navigate = useNavigate();

    const {noticeNo} = useParams();

    //파일선택
    const inputFileRef = useRef(null);

    const [attachImages, setAttachImages] = useState([]);//보낼 추가첨부사진이미지
    const [updateFileList, setUpdateFileList] = useState([]);
    const [loadImages, setLoadImages] = useState([]);

    //state
    const [notice, setNotice] = useState({});
    const [edit, setEdit] = useState({
        noticeType: "",
        noticeTitle: "",
        noticeContent: "",
    });

    //effect
    useEffect(() => {
        loadNotice();
    }, []);

    //callback

    
    const loadNotice = useCallback(async () => {
        const resp = await axios.get("/notice/detail/" + noticeNo);
        setEdit(resp.data);
    }, [notice, edit]);
    const returnBack = useCallback(() => {
        navigate(-1);
    }, []); 
    const goNoticeEdit = useCallback(async () => {
        const resp = await axios.put("/notice/edit/"+noticeNo, edit);
        navigate("/notice/list");

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
            <Jumbotron title={`${edit.noticeWriter}의 게시글`} content="게시글 수정" />

            <div className="row mt-4">
            <div className="col-3">분류<FaAsterisk className="text-danger" /></div> 
                        <select type="text" className="form-control" placeholder="분류"
                            name="noticeType" value={edit.noticeType} onChange={changeEdit}>
                            <option value="">선택하세요</option>
                    <option>공지</option>
                    <option>이벤트</option>
                    </select>
                    </div>

                <div className="row mt-4">
                <div className="col-3">제목<FaAsterisk className="text-danger" /></div>
                    <input className="form-control" placeholder="제목"
                        name="noticeTitle" value={edit.noticeTitle} onChange={changeEdit}></input>
                </div>
                <div className="row mt-4">
                    <div className="col-3">내용<FaAsterisk className="text-danger" /></div>
                        <textarea className="form-control" placeholder="내용"
                            name="noticeContent" value={edit.noticeContent} onChange={changeEdit}  rows={15}
                            style={{ resize : 'none'}} />
                </div>

                <div className="row mt-4 text-end">
                    <div className="col mt-4">
                        <button className="btn btn-danger me-3" onClick={returnBack}>
                            돌아가기
                        </button>
                        <button className="btn btn-info" onClick={goNoticeEdit} >
                            수정하기
                        </button>
                    </div>
                </div>
        </>

    );
};
export default NoticeEdit;