import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";
import { memberIdState, memberLevelState } from "../../utils/recoil";

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
    const [replies, setReplies] = useState([]); // 답글 목록
    const [showReplyDeleteModal, setShowReplyDeleteModal] = useState(false);
    const [replyToDelete, setReplyToDelete] = useState(null);

    // 수정 상태
    const [showEditModal, setShowEditModal] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [replyToEdit, setReplyToEdit] = useState(null);

    useEffect(() => {
        loadQna();
        loadReplies(); // 답글 로드
    }, [qnaNo]);

    const loadQna = useCallback(async () => {
        try {
            const resp = await axios.get("/qna/detail/" + qnaNo);
            setQna(resp.data);
            setEditContent(resp.data.qnaContent); // 초기 수정 내용 설정
        } catch (e) {
            setQna(null);
        }
        setLoad(true);
    }, [qnaNo]);

    const loadReplies = useCallback(async () => {
        try {
            const resp = await axios.get(`/qna/reply/list?replyQna=${qnaNo}`); // 답글 API
            setReplies(resp.data);
        } catch (e) {
            // console.error("답글 로드 중 오류 발생", e);
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
            // console.error("QnA 삭제 중 오류 발생", error);
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
        if (!reply) return; // 답글이 비어있으면 무시
        try {
            await axios.post(`/qna/reply/insert?replyQna=${qnaNo}`, { replyContent: reply }); // 답글 추가 API
            setReply(""); // 입력란 비우기
            loadReplies(); // 답글 목록 새로고침
            toast.success("답글이 추가되었습니다!"); // 성공 알림
        } catch (e) {
            // console.error("답글 추가 중 오류 발생", e);
        }
    };

    const deleteReply = useCallback(async () => {
        if (!replyToDelete) return;
        try {
            await axios.delete(`/qna/reply/delete/${replyToDelete}`); // 답글 삭제 API
            setShowReplyDeleteModal(false);
            loadReplies(); // 답글 목록 새로고침
            toast.success("답글이 삭제되었습니다."); // 성공 알림
        } catch (error) {
            // console.error("답글 삭제 중 오류 발생", error);
        }
    }, [replyToDelete]);

    const handleEditChange = (e) => {
        setEditContent(e.target.value);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`/qna/reply/edit/${replyToEdit}`, { replyNo: replyToEdit, replyContent: editContent });
            setShowEditModal(false);
            toast.success("수정이 완료되었습니다."); // 성공 알림
            loadReplies(); // 답글 목록 새로고침
        } catch (error) {
            // console.error("답글 수정 중 오류 발생", error);
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
            <Jumbotron title={qnaNo + "번 글 상세정보"} />

            {/* QnA 정보 표시 */}
            <div className="row mt-4">
                <div className="col-sm-3">작성자</div>
                <div className="col-sm-9">{qna.qnaWriter}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">분류</div>
                <div className="col-sm-9">{qna.qnaType}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">제목</div>
                <div className="col-sm-9">{qna.qnaTitle}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">내용</div>
                <div className="col-sm-9">
                    <span style={{ wordBreak: 'break-word', display: 'inline-block', maxWidth: '100%' }}>
                        {qna.qnaContent} {qna.edited && <span>(수정됨)</span>}
                    </span>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">작성시간</div>
                <div className="col-sm-9">{qna.qnaWtime}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">수정시간</div>
                <div className="col-sm-9">{qna.qnaUtime}</div>
            </div>

            {/* 답글 입력 */}
            {memberLevel === "관리자" &&(
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
                    <ul className="list-group">
                        {replies.slice().reverse().map((replyItem) => (
                            <li key={replyItem.replyNo} className="list-group-item">
                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    {replyItem.replyUtime ? (
                                        <>
                                            {new Date(replyItem.replyUtime).toLocaleString()} (수정됨)
                                        </>
                                    ) : (
                                        new Date(replyItem.replyWtime).toLocaleString() // 답글 생성 시간
                                    )}
                                </div>
                                <div>
                                    <strong>관리자     :      </strong>
                                    <span style={{ wordBreak: 'break-word', display: 'inline-block', maxWidth: '100%' }}>
                                        {replyItem.replyContent} {/* 답글 내용 */}
                                    </span>
                                </div>
                                {/* 답글 작성자에 따라 수정/삭제 버튼 조건부 렌더링 */}
                                {replyItem.replyWriter === memberId && (
                                    <>
                                        <button className="btn btn-danger btn-sm float-end" onClick={() => {
                                            setReplyToDelete(replyItem.replyNo); // 삭제할 답글 설정
                                            setShowReplyDeleteModal(true); // 모달 표시
                                        }}>
                                            삭제
                                        </button>
                                        <button className="btn btn-info btn-sm float-end me-2" onClick={() => {
                                            setReplyToEdit(replyItem.replyNo); // 수정할 답글 설정
                                            setEditContent(replyItem.replyContent); // 수정할 내용 설정
                                            setShowEditModal(true); // 수정 모달 표시
                                        }}>
                                            수정
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}

                    </ul>
                ) : (
                    <p>답글이 없습니다.</p>
                )}
            </div>

            {/* 버튼들 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-secondary ms-2" onClick={() => navigate("/qna/list")}>목록</button>
                    {/* QnA 작성자에 따라 수정/삭제 버튼 조건부 렌더링 */}
                    {qna.qnaWriter === memberId && (
                        <>
                            <button className="btn btn-info ms-2" onClick={() => {
                                navigate("/qna/edit/" + qnaNo)
                            }}>수정</button>
                            <button className="btn btn-danger ms-2" onClick={handleDeleteClick}>삭제</button>
                        </>
                    )}
                </div>
            </div>

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
