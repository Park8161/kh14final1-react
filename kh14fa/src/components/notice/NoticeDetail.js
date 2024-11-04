import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "react-bootstrap/Modal";
import { useRecoilValue } from "recoil";
import { memberIdState } from "../../utils/recoil";
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기

const NoticeDetail = () => {
    const { noticeNo } = useParams();
    const navigate = useNavigate();

    // 리코일 state
    const memberId = useRecoilValue(memberIdState);

    const [notice, setNotice] = useState(null);
    const [load, setLoad] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [images, setImages] = useState([]);

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
            await axios.delete("/notice/delete/" + notice.noticeNo);
            setShowDeleteModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            // 에러 처리
        }
    }, [notice]);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/notice/list");
    };

    if (load === false) {
        return <></>;
    }
    if (notice == null) {
        return <Navigate to="/notFound" />;
    }

    return (
        <>
            <div className="row mt-4">
                <div className="col-8 offset-2 border">

                    {/* 게시글 정보 */}
                    <div className="row mt-4">
                        <div className="col text-center" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                            {notice.noticeTitle}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col" style={{ opacity: 0.6 }}>
                            분류 : {notice.noticeType}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col" style={{ opacity: 0.6 }}>
                            작성시각 : {moment(notice.noticeWtime).format("YYYY-MM-DD")}
                            {notice.edited && <span> (수정됨)</span>}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col mb-4">
                            <div className="notice-content" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '100%' }}>
                                {notice.noticeContent} {notice.edited && <span>(수정됨)</span>}
                            </div>
                        </div>
                    </div>

                    {/* 이미지 슬라이드 */}
                    {images && images.length > 0 && (
                        <div className="row">
                            <div className="col-12">
                                <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-indicators">
                                        {images.map((image, index) => (
                                            <button
                                                type="button"
                                                data-bs-target="#carouselExampleCaptions"
                                                key={index}
                                                data-bs-slide-to={index}
                                                className={index === 0 ? "active" : ""}
                                                aria-current="true"
                                                aria-label={"Slide " + index}
                                            ></button>
                                        ))}
                                    </div>
                                    <div className="carousel-inner">
                                        {images.map((image, index) => (
                                            <div className={"carousel-item " + (index === 0 ? "active" : "")} key={index}>
                                                <img 
                                                    src={process.env.REACT_APP_BASE_URL + "/attach/download/" + image} 
                                                    className="d-block w-100" 
                                                    alt="notice" 
                                                    style={{ maxHeight: '400px', objectFit: 'contain' }} // 이미지 크기 조정
                                                />
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
                        </div>
                    )}

                </div>
            </div>

            {/* 버튼들 */}
            <div className="row mt-4">
                <div className="col-8 offset-2 text-end pe-0">
                    <button className="btn btn-secondary" onClick={e => navigate("/notice/list")}>
                        목록으로
                    </button>
                    {notice.noticeWriter === memberId && (
                        <>
                            <button className="btn btn-info ms-2" onClick={e => { navigate("/notice/edit/" + noticeNo) }}>
                                수정하기
                            </button>
                            <button className="btn btn-danger ms-2" onClick={handleDeleteClick}>
                                삭제하기
                            </button>
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
