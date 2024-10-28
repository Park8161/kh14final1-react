import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { toast } from 'react-toastify'; // toast 추가
import 'react-toastify/dist/ReactToastify.css'; // toast 스타일 추가
import Modal from "react-bootstrap/Modal"; // Bootstrap 모달 사용

const NoticeDetail = () => {
    const { noticeNo } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState(null);
    const [load, setLoad] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [images, setImages] = useState();

    useEffect(() => {
        loadNotice();
    }, [noticeNo]);

    const loadNotice = useCallback(async () => {
        try {
            const resp = await axios.get("/notice/detail/" + noticeNo);
            setNotice(resp.data.noticeDto);
            setImages(resp.data.images);
        } catch (e) {
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
            toast.success("삭제가 완료되었습니다."); // 삭제 완료 toast
            setShowDeleteModal(false);
            navigate("/notice/list"); // 삭제 후 목록으로 이동
        } catch (error) {
            console.error("Error deleting notice", error);
            toast.error("삭제에 실패했습니다."); // 실패 toast
        }
    }, [notice, navigate]);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);

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
            <Jumbotron title={noticeNo + "번 글 상세정보"} />

            {/* 이미지 슬라이드 */}
            <div className="col-6">
                <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {images.map((image, index) => (
                            <button type="button" data-bs-target="#carouselExampleCaptions" key={index} data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current="true" aria-label={"Slide " + index}></button>
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {images.map((image, index) => (
                            <div className={"carousel-item " + (index === 0 ? "active" : "")} key={index} style={{ width: "100%", height: "100%" }}>
                                <img src={process.env.REACT_APP_BASE_URL + "/attach/download/" + image} className="d-block w-100" alt="notice" />
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* 게시글 정보 */}
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

            {/* 버튼들 */}
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
        </>
    );
};

export default NoticeDetail;
