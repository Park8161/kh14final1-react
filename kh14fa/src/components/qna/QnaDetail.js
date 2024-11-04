import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";
import { memberIdState, memberLevelState } from "../../utils/recoil";
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기

const QnaDetail = () => {
    const { qnaNo } = useParams();
    const navigate = useNavigate();

    // 리코일 state
    const memberId = useRecoilValue(memberIdState);
    const memberLevel = useRecoilValue(memberLevelState);

    const [qna, setQna] = useState(null);
    const [load, setLoad] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // 답글 상태
    const [reply, setReply] = useState("");
    const [replies, setReplies] = useState([]);
    const [showReplyDeleteModal, setShowReplyDeleteModal] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);

    // 수정 상태
    const [showEditModal, setShowEditModal] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [replyToEdit, setReplyToEdit] = useState(null);

    useEffect(() => {
        loadQna();
        loadReplies();
    }, [qnaNo]);

    const loadQna = useCallback(async () => {
        try {
            const resp = await axios.get("/qna/detail/" + qnaNo);
            setQna(resp.data);
            setEditContent(resp.data.qnaContent);
        } catch (e) {
            setQna(null);
        }
        setLoad(true);
    }, [qnaNo]);

    const loadReplies = useCallback(async () => {
        try {
            const resp = await axios.get(`/qna/reply/list?replyQna=${qnaNo}`);
            setReplies(resp.data);
        } catch (e) {
            // 오류 처리
        }
    }, [qnaNo]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const deleteQna = useCallback(async () => {
        try {
            await axios.delete("http://localhost:8080/qna/delete/" + qna.qnaNo);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            // 오류 처리
        }
    }, [qna]);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/qna/list");
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!reply) return;
        try {
            await axios.post(`/qna/reply/insert?replyQna=${qnaNo}`, { replyContent: reply });
            setReply("");
            loadReplies();
            toast.success("답글이 추가되었습니다!");
        } catch (e) {
            // 오류 처리
        }
    };

    const deleteReply = useCallback(async () => {
        if (!replyToDelete) return;
        try {
            await axios.delete(`/qna/reply/delete/${replyToDelete}`);
            setShowReplyDeleteModal(false);
            loadReplies();
            toast.success("답글이 삭제되었습니다.");
        } catch (error) {
            // 오류 처리
        }
    }, [replyToDelete]);

    const handleEditChange = (e) => {
        setEditContent(e.target.value);
    };

    const handleEditSubmit = async () => {
        if (!editContent.trim()) {
            toast.error("수정할 내용을 입력하세요"); // 내용이 비어있으면 알림 표시
            return; // 함수 종료
        }

        try {
            await axios.put(`/qna/reply/edit/${replyToEdit}`, { replyNo: replyToEdit, replyContent: editContent });
            setShowEditModal(false);
            toast.success("수정이 완료되었습니다.");
            loadReplies();
        } catch (error) {
            // 오류 처리
        }
    };

    if (load === false) {
        return (
            <>
                <Jumbotron title={"?번 글 상세 정보"} />
                {/* ... 로딩 상태 UI ... */}
            </>
        );
    }

    if (qna === null) {
        return <Navigate to="/notFound" />;
    }

    return (
        <>
            <div className="row mt-4">
                <div className="col-8 offset-2 border">

                    {/* QnA 정보 표시 */}
                    <div className="row mt-4">
                        <div className="col text-center" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                            {qna.qnaTitle}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col" style={{ opacity: 0.6 }}>
                            분류 : {qna.qnaType}
                        </div>
                    </div>
                    <div className="col" style={{ opacity: 0.6 }}>
                        작성시각 : {moment(qna.qnaWtime).format("YYYY-MM-DD")}
                        {qna.edited && <span> (수정됨)</span>}
                    </div>
                    <div className="col" style={{ opacity: 0.6 }}>
                        작성자 : {qna.qnaWriter}</div>
                    <div className="row mt-4">
                        <div className="col mb-4">
                            <div className="qna-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%' }}>
                                {qna.qnaContent} {qna.edited && <span>(수정됨)</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-8 offset-2 text-end pe-0">
                    <button className="btn btn-secondary ms-2" onClick={() => navigate("/qna/list")}>목록</button>
                    {qna.qnaWriter === memberId && (
                        <>
                            <button className="btn btn-info ms-2" onClick={() => {
                                navigate("/qna/edit/" + qnaNo)
                            }}>수정</button>
                            <button className="btn btn-danger ms-2" onClick={handleDeleteClick}>삭제</button>
                        </>
                    )}
                </div>


                {/* 답글 입력 */}
                <div className="row mt-4">
                    <div className="col-8 offset-2">
                        {memberLevel === "관리자" && (
                            <div className="mt-4">
                                <h5>답글 작성</h5>
                                <form onSubmit={handleReplySubmit}>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={reply}
                                        onChange={handleReplyChange}
                                        placeholder="답글을 입력하세요"
                                    />
                                    <button className="btn btn-primary float-end mt-2" type="submit">답글 추가</button>
                                </form>
                            </div>
                        )}

                        {/* 답글 목록 */}
                        <div className="mt-4">
                            <h5>답글 목록</h5>
                            {replies.length > 0 ? (
                                <ul className="list-group" style={{ listStyleType: 'none', padding: 0 }}>
                                    {replies.slice().reverse().map((replyItem) => (
                                        <li key={replyItem.replyNo} className="list-group-item" style={{ padding: '15px', borderBottom: '1px solid #e9ecef' }}>
                                            <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
                                                {replyItem.replyUtime ? (
                                                    <span>
                                                        {moment(replyItem.replyUtime).format("YYYY-MM-DD")}(수정됨)
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {moment(replyItem.replyWtime).format("YYYY-MM-DD")}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <strong>관리자:</strong>
                                                <span style={{ wordBreak: 'break-word', display: 'inline-block', maxWidth: '100%', marginLeft: '5px' }}>
                                                    {replyItem.replyContent}
                                                </span>
                                            </div>
                                            {replyItem.replyWriter === memberId && (
                                                <div className="float-end mt-2">
                                                    <button className="btn btn-danger btn-sm me-2" onClick={() => {
                                                        setReplyToDelete(replyItem.replyNo);
                                                        setShowReplyDeleteModal(true);
                                                    }}>
                                                        삭제
                                                    </button>
                                                    <button className="btn btn-info btn-sm" onClick={() => {
                                                        setReplyToEdit(replyItem.replyNo);
                                                        setEditContent(replyItem.replyContent);
                                                        setShowEditModal(true);
                                                    }}>
                                                        수정
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>답글이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* 버튼들 */}
            {/* <div className="row mt-4">
                <div className="col-8 offset-2 text-end pe-0">
                    <button className="btn btn-secondary ms-2" onClick={() => navigate("/qna/list")}>목록</button>
                    {qna.qnaWriter === memberId && (
                        <>
                            <button className="btn btn-info ms-2" onClick={() => {
                                navigate("/qna/edit/" + qnaNo)
                            }}>수정</button>
                            <button className="btn btn-danger ms-2" onClick={handleDeleteClick}>삭제</button>
                        </>
                    )}
                </div>
            </div> */}

            {/* 삭제 확인 모달 */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={deleteQna}>
                        삭제
                    </button>
                    <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                        취소
                    </button>
                </Modal.Footer>
            </Modal>

            {/* 삭제 완료 모달 */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제 완료</Modal.Title>
                </Modal.Header>
                <Modal.Body>삭제가 완료되었습니다.</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleCloseSuccessModal}>
                        확인
                    </button>
                </Modal.Footer>
            </Modal>

            {/* 답글 삭제 확인 모달 */}
            <Modal show={showReplyDeleteModal} onHide={() => setShowReplyDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={deleteReply}>
                        삭제
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowReplyDeleteModal(false)}>
                        취소
                    </button>
                </Modal.Footer>
            </Modal>

            {/* 수정 모달 */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>수정하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={editContent}
                        onChange={handleEditChange}
                        placeholder="수정할 내용을 입력하세요"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleEditSubmit}>
                        수정
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                        취소
                    </button>
                </Modal.Footer>
            </Modal>

            {/* 토스트 컨테이너 */}
            <ToastContainer />
        </>
    );
};

export default QnaDetail;
