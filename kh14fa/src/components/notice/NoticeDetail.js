import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router"
import Jumbotron from "../Jumbotron";
import Modal from "react-bootstrap/Modal";

const NoticeDetail = () => {
    //파라미터 읽는 명령
    const { noticeNo } = useParams();

    //이동 도구
    const navigate = useNavigate();

    //state
    const [notice, setNotice] = useState(null);
    const [load, setLoad] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    //effect
    useEffect(() => {
        loadNotice();
    }, [noticeNo]);

    //callback
    const loadNotice = useCallback(async () => {
        try {
            const resp = await axios.get("/notice/detail/" + noticeNo);
            setNotice(resp.data);
        }
        catch (e) {
            setNotice(null);
        }
        setLoad(true);
    }, [noticeNo]);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const deleteNotice = useCallback(async () => {
        try {
            await axios.delete("http://localhost:8080/notice/delete/" + notice.noticeNo);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error deleting notice", error);
        }
    }, [notice]);

    const handleCloseDeleteModal = () => setShowDeleteModal(false); // 삭제 확인 모달 닫기
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false); // 삭제 완료 모달 닫기
        navigate("/notice/list"); // 삭제 완료 후 목록으로 이동
    };

    if (load === false) {
        return (
        <>
            <Jumbotron title={"?번 글 상세정보"} />
        </>
        );
    }
    if (notice == null) {
        return <Navigate to="/notFound" />;
    }

    return (
        <>
            <Jumbotron title={noticeNo + "번 글 상세정보"}/>

            <div className="row mt-4">
                <div className="col-sm-3">작성자</div>
                <div className="col-sm-9">{notice.noticeWriter}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">분류</div>
                <div className="col-sm-9">{notice.noticeType}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">제목</div>
                <div className="col-sm-9">{notice.noticeTitle}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">내용</div>
                <div className="col-sm-9">{notice.noticeContent}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">작성시간</div>
                <div className="col-sm-9">{notice.noticeWtime}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">수정시간</div>
                <div className="col-sm-9">{notice.noticeUtime}</div>
            </div>
            <div className="row mt-4">
                <div className="col-sm-3">조회수</div>
                <div className="col-sm-9">{notice.noticeViews}</div>
            </div>

            {/*버튼들*/}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-secondary ms-2" onClick={() => navigate("/notice/list")}>목록</button>
                    <button className="btn btn-info ms-2" onClick={() => navigate("/notice/edit/" + noticeNo)}>수정</button>
                    <button className="btn btn-danger ms-2" onClick={handleDeleteClick}>삭제</button>
                </div>
            </div>

            {/* 삭제 확인 모달 */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={deleteNotice}>
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
        </>
    );
};

export default NoticeDetail;