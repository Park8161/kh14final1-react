import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { toast } from "react-toastify";
import { FaAsterisk } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";

const NoticeEdit = () => {
    const navigate = useNavigate();
    const { noticeNo } = useParams();

    const [input, setInput] = useState({
        notice: {
            noticeType: "",
            noticeTitle: "",
            noticeContent: "",
            attachList: [],
        },
        images: [],
    });

    const inputFileRef = useRef(null);
    const [attachImages, setAttachImages] = useState([]);
    const [loadImages, setLoadImages] = useState([]);

    useEffect(() => {
        loadGetNotice();
    }, [noticeNo]);

    const loadGetNotice = useCallback(async () => {
        // try {
            const resp = await axios.get(`/notice/detail/${noticeNo}`);
            setInput(prevInput => ({
                ...prevInput,
                notice: {
                    ...prevInput.notice,
                    ...resp.data.noticeDto,
                },
            }));
            setLoadImages(resp.data.images);
        // } catch (error) {
        //     console.error("Error loading notice:", error);
        // }
    }, [noticeNo]);

    const targetChange = useCallback(e => {
        if (e.target.type === "file") {
            const files = Array.from(e.target.files);
            setInput(prevInput => ({
                ...prevInput,
                notice: {
                    ...prevInput.notice,
                    attachList: files,
                },
            }));

            const imageUrls = files.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise(resolve => {
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                });
            });

            Promise.all(imageUrls).then(urls => {
                setAttachImages(urls);
            });
        } else {
            setInput(prevInput => ({
                ...prevInput,
                notice: {
                    ...prevInput.notice,
                    [e.target.name]: e.target.value,
                },
            }));
        }
    }, []);

    const deleteImage = useCallback(target => {
        setLoadImages(prevImages => prevImages.filter(image => image !== target));
    }, []);

    const deleteAttachImage = useCallback(target => {
        setAttachImages(prevImages => prevImages.filter(image => image !== target));
    }, []);

    const goNoticeEdit = useCallback(async () => {
        const formData = new FormData();
        const fileList = input.notice.attachList;

        if (fileList && fileList.length > 0) {
            for (let i = 0; i < fileList.length; i++) {
                formData.append("attachList", fileList[i]);
            }
        }

        formData.append("noticeType", input.notice.noticeType);
        formData.append("noticeTitle", input.notice.noticeTitle);
        formData.append("noticeContent", input.notice.noticeContent);
        formData.append("noticeNo", noticeNo);
        formData.append("originList", loadImages);

        //console.log("Input Data:", input); // 추가된 로그

        try {
            await axios.post("/notice/edit", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success("게시글 수정완료");
            navigate("/notice/list");
        } catch (error) {
           // console.error("Error editing notice:", error);
            toast.error("게시글 수정 실패");
        }
    }, [input, navigate]);

    return (
        <>
            <Jumbotron title={`${input.notice.noticeWriter}의 게시글`} content="게시글 수정" />

            <div className="row mt-4">
                <div className="col-3">분류<FaAsterisk className="text-danger" /></div>
                <select className="form-control" name="noticeType" value={input.notice.noticeType} onChange={targetChange}>
                    <option value="">선택하세요</option>
                    <option value="공지">공지</option>
                    <option value="이벤트">이벤트</option>
                </select>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>기존 이미지 파일</label>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label className="form-label">파일</label>
                    <input type="file" className="form-control" name="attachList" multiple accept="image/*"
                        onChange={targetChange} ref={inputFileRef} />

                    {attachImages.map((image, index) => (
                        <div key={index} style={{ position: "relative", display: "inline-block" }}>
                            <img src={image} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                            <MdCancel style={{ position: "absolute", top: "10px", right: "10px", color: "red" }} size={20} onClick={() => deleteAttachImage(image)} />
                        </div>
                    ))}
                    {loadImages.map((image, index) => (
                        <div key={index} style={{ position: "relative", display: "inline-block" }}>
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${image}`} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                            <MdCancel style={{ position: "absolute", top: "10px", right: "10px", color: "red" }} size={20} onClick={() => deleteImage(image)} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-3">제목<FaAsterisk className="text-danger" /></div>
                <input className="form-control" placeholder="제목"
                    name="noticeTitle" value={input.notice.noticeTitle} onChange={targetChange} />
            </div>

            <div className="row mt-4">
                <div className="col-3">내용<FaAsterisk className="text-danger" /></div>
                <textarea className="form-control" placeholder="내용"
                    name="noticeContent" value={input.notice.noticeContent} onChange={targetChange} rows={15} style={{ resize: 'none' }} />
            </div>

            <div className="row mt-4 text-end">
                <div className="col mt-4">
                    <button className="btn btn-danger me-3" onClick={() => navigate(-1)}>돌아가기</button>
                    <button className="btn btn-info" onClick={goNoticeEdit}>수정하기</button>
                </div>
            </div>
        </>
    );
};

export default NoticeEdit;
