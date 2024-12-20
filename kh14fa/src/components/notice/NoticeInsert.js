import axios from "axios";
import Jumbotron from "../Jumbotron";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const NoticeInsert = () => {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        noticeType: "",
        noticeTitle: "",
        noticeContent: "",
        attachList: [],
    });

    const [images, setImages] = useState([]);
    const inputFileRef = useRef(null);

    const changeInput = useCallback(e => {
        if (e.target.type === "file") {
            const files = Array.from(e.target.files);
            setInput(prev => ({
                ...prev,
                attachList: files
            }));
            const imageUrls = files.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                });
            });
            Promise.all(imageUrls).then(urls => {
                setImages(urls); // 이미지 URL을 상태로 설정
            });
        } else {
            setInput(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    }, []);

    const noticeInsert = useCallback(async () => {
        const formData = new FormData();

        // 파일 첨부
        input.attachList.forEach(file => {
            formData.append("attachList", file);
        });

        formData.append("noticeType", input.noticeType);
        formData.append("noticeTitle", input.noticeTitle);
        formData.append("noticeContent", input.noticeContent);

        await axios.post("/notice/insert", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success("공지사항 등록 완료");
        navigate("/notice/list");
    }, [input, navigate]);

    const saveNotice = useCallback(async () => {
        if (!input.noticeType) {
            toast.error("분류를 선택해 주세요");
            return;
        }
        if (!input.noticeTitle) {
            toast.error("제목을 입력해 주세요");
            return;
        }
        if (!input.noticeContent) {
            toast.error("내용을 입력해 주세요");
            return;
        }

        // "이벤트" 선택 시 파일 첨부 여부 확인
        if (input.noticeType === "이벤트" && input.attachList.length === 0) {
            toast.error("파일첨부는 필수입니다");
            return; // 실행 중단
        }

        // 유효성 검사 통과 시 API 호출
        await noticeInsert();
    }, [input, noticeInsert]);

    return (
        <>
            {/* <Jumbotron title="새 글 등록" /> */}
            <div className="row">
                <div className="col-8 offset-2">

                    <div className="row mt-4">
                        <div className="col">
                            <label>분류</label>
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
                            <label>파일</label>
                            <input type="file" className="form-control" name="attachList" multiple accept="image/*" onChange={changeInput} ref={inputFileRef} />
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                            ))}
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
                        <div className="col text-end">
                            <button type="button" className="btn btn-secondary me-3" onClick={e=>navigate("/notice/list")}>
                                돌아가기
                            </button>
                            <button type="button" className="btn btn-success" onClick={saveNotice}>
                                등록하기
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default NoticeInsert;
