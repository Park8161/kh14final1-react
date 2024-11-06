import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Modal } from "bootstrap";
import { CiShare1, CiHeart } from "react-icons/ci";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegHandshake } from "react-icons/fa";
import userImage from '../product/userImage.jpg';
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기
import { toast } from "react-toastify";
import { AiFillHome } from "react-icons/ai";

const MemberDetail = () => {
    // navigate
    const navigate = useNavigate();

    // state
    const { memberId } = useParams();
    const [member, setMember] = useState();
    const [collapse, setCollpase] = useState({
        product: false,
        sell: false,
        reserve: false,
        soldout: false,
        productButton: "btn w-100 font-16px btn-outline-primary",
        sellButton: "btn w-100 font-16px btn-outline-primary",
        reserveButton: "btn w-100 font-16px btn-outline-primary",
        soldoutButton: "btn w-100 font-16px btn-outline-primary",
    });
    const [myList, setMyList] = useState([]);
    const [sellList, setSellList] = useState([]);
    const [reserveList, setReserveList] = useState([]);
    const [soldoutList, setSoldoutList] = useState([]);
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState([]);
    const [reviewList, setReviewList] = useState([]);
    const [review, setReview] = useState([]);
    const [reviewCount, setReviewCount] = useState();
    const [paymentCount, setPaymentCount] = useState();
    const [edit, setEdit] = useState({
        reviewNo: "",
        reviewContent: "",
        reviewScore: 0
    });
    const [load, setLoad] = useState(false);

    // effect
    useEffect(() => {
        loadMember();
        loadProductList();
        setCollpase({
            ...collapse,
            product: true,
            sell: false,
            reserve: false,
            soldout: false,
            productButton: "btn w-100 font-16px btn-outline-primary active",
            sellButton: "btn w-100 font-16px btn-outline-primary",
            reserveButton: "btn w-100 font-16px btn-outline-primary",
            soldoutButton: "btn w-100 font-16px btn-outline-primary",
        });
    }, []);

    // callback
    // 판매자 정보 불러오기
    const loadMember = useCallback(async () => {
        try {
            const response = await axios.get("/member/detail/" + memberId);
            setMember(response.data);
            // console.log("resp.data", resp.data);
        }
        catch (e) {
            setMember(null);
        }
        countReview();
        loadReview();
        countPayment();
        setLoad(true); //로딩 진행상황 마킹
    }, [memberId]);

    // 판매자가 파는 상품 목록 불러오기
    const loadProductList = useCallback(async () => {
        const response = await axios.get("/product/myList/" + memberId);
        setMyList(response.data);
        setSellList(
            (response.data).filter(product => product.productState === '판매중')
        );
        setReserveList(
            (response.data).filter(product => product.productState === '예약중')
        );
        setSoldoutList(
            (response.data).filter(product => product.productState === '판매완료')
        );
    }, [myList])

    // 판매자 거래 후기 목록 불러오기
    const loadReview = useCallback(async () => {
        const response = await axios.get("/review/list/" + memberId);
        setReviewList(response.data);
    }, [reviewList]);

    // 판매자에 대한 리뷰 개수 카운트 불러오기
    const countReview = useCallback(async () => {
        const response = await axios.get("/review/count/" + memberId);
        setReviewCount(response.data);
    }, [review]);

    // 마이페이지에서 갖고옴
    const selectProduct = useCallback(async (productNo) => {
        const response = await axios.get("/product/detail/" + productNo);
        setProduct(response.data.productDto);
        setImages(response.data.images);
    }, [product, images]);

    // 거래횟수 조회
    const countPayment = useCallback(async () => {
        const response = await axios.get("/pay/count/" + memberId);
        setPaymentCount(response.data);
    }, []);

    // 내 상품, 판매중, 예약중, 판매완료 탭 만드는 함수
    const clearCollapse = useCallback(() => {
        setCollpase({
            product: false,
            sell: false,
            reserve: false,
            soldout: false,
            productButton: "btn w-100 font-16px btn-outline-primary",
            sellButton: "btn w-100 font-16px btn-outline-primary",
            reserveButton: "btn w-100 font-16px btn-outline-primary",
            soldoutButton: "btn w-100 font-16px btn-outline-primary",
        });
    }, [collapse]);

    const changeCollapse = useCallback((e) => {
        clearCollapse();
        setCollpase({
            ...collapse,
            [e.target.name]: true,
            [e.target.name + "Button"]: "btn w-100 font-16px btn-outline-primary active"
        });
    }, []);

    // ref
    const modal = useRef();
    const DPmodal = useRef();
    const deleteReviewModal = useRef();
    const editReviewModal = useRef();

    // 링크 공유 모달
    const openModal = useCallback(() => {
        const tag = Modal.getOrCreateInstance(modal.current);
        tag.show();
    }, [modal]);

    const closeModal = useCallback(() => {
        var tag = Modal.getInstance(modal.current);
        tag.hide();
    }, [modal]);

    // 상품 삭제 모달
    const openDPModal = useCallback(async (productNo) => {
        const tag = Modal.getOrCreateInstance(DPmodal.current);
        tag.show();
        selectProduct(productNo);
    }, [DPmodal]);

    // 마이 페이지에서 갖고옴
    const closeDPModal = useCallback(() => {
        var tag = Modal.getInstance(DPmodal.current);
        tag.hide();
    }, [DPmodal]);

    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    // url 공유하기 함수
    const copyToClipboard = useCallback(() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.info("주소 복사 완료\n" + url);
    }, []);

    if (load === false) {
        return (<>
        </>);
    }
    if (member === null) {
        return (<>no data</>);
    }

    //시간 계산 함수
    const timeCalculate = (productTime) => {
        const nowDate = moment(); //현재 시간
        const date = new Date(productTime); //상품 등록 시간
        const milliSeconds = nowDate - date; //상품 등록 시간을 밀리초로 변경

        const seconds = milliSeconds / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const months = days / 30;
        const years = months / 12;

        if (seconds < 60) {
            return "방금 전";
        } else if (minutes < 60) {
            return `${Math.floor(minutes)}분 전`;
        } else if (hours < 24) {
            return `${Math.floor(hours)}시간 전`;
        } else if (days < 30) {
            return `${Math.floor(days)}일 전`;
        } else if (months < 12) {
            return `${Math.floor(months)}달 전`;
        } else {
            return `${Math.floor(years)}년 전`;
        }
    };


    return (<>

        {/* 링크 공유하기 모달 */}
        <div className="modal fade" tabIndex="-1" ref={modal} /*data-bs-backdrop="static"*/>
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">공유하기</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={closeModal} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                        <div className="row">
                            <div className="col">
                                <input type="text" className="form-control" value={window.location.href} readOnly />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mt-2 text-end">
                                <button className="btn btn-info" onClick={copyToClipboard}>복사</button>
                            </div>
                        </div>

                    </div>

                    {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                    {/* <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                            닫기<IoMdClose className="ms-1 btn-lg-white" />
                        </button>
                    </div> */}

                </div>
            </div>
        </div>


        <div className="row mt-4">
            <div className="col-7 col-sm-5">
                <div className="row">
                    <div className="col-9">
                        <h2 className="d-flex justify-content-start align-items-center"
                            style={{ fontWeight: "600" }}>
                            <AiFillHome className="me-2" size="40" />
                            {member.memberName}#{member.memberId}
                            {/* h2 내부에 CiShare1 아이콘 추가 */}
                            <CiShare1
                                className="ms-3" // 아이콘과 이름 사이 간격을 조절
                                style={{ cursor: 'pointer' }}
                                size="30"
                                onClick={openModal}
                                color="gray"
                            />
                        </h2>
                    </div>

                </div>
                <div className="row mt-3">
                    <div className="col">
                        <ul className="list-group list-group-horizontal" style={{ maxHeight: "75px" }}>
                            <li className="list-group-item text-center" style={{ width: "25.5%" }}>
                                <div className="row">
                                    <div className="col">
                                        <small className="text-muted mx-2">거래횟수</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col mt-1">
                                        <h5>{paymentCount}</h5>
                                    </div>
                                </div>
                            </li>
                            <li className="list-group-item text-center" style={{ width: "25.5%" }}>
                                <div className="row">
                                    <div className="col">
                                        <small className="text-muted mx-2">거래후기</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <button className="btn btn-link btn-sm text-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas1">
                                            <h5>{reviewCount}</h5>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-9 col-sm-5" style={{ marginLeft: "-20px" }}>
                <p className="mt-5" style={{
                    fontWeight: "600", color: "#265073",
                    fontSize: "18px", marginBottom: "6px"
                }}>
                    신뢰지수 <span style={{ fontSize: "25px" }}>{member.memberReliability}</span>
                </p>
                <div className="progress" style={{ height: "20px" }}>
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${member.memberReliability}%` }}
                        aria-valuenow={member.memberReliability}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
            </div>
        </div>

        <div className="row text-center" style={{marginTop:"60px"}}>
            <div className="col-3">
                <button className={collapse.productButton} name="product" onClick={changeCollapse} style={{ border: "none", fontWeight: "600" }}>내 상품</button>
            </div>
            <div className="col-3">
                <button className={collapse.sellButton} name="sell" onClick={changeCollapse} style={{ border: "none", fontWeight: "600" }}>판매중</button>
            </div>
            <div className="col-3">
                <button className={collapse.reserveButton} name="reserve" onClick={changeCollapse} style={{ border: "none", fontWeight: "600" }}>예약중</button>
            </div>
            <div className="col-3">
                <button className={collapse.soldoutButton} name="soldout" onClick={changeCollapse} style={{ border: "none", fontWeight: "600" }}>판매완료</button>
            </div>
        </div>

        <hr className="my-0" />

        {/* 내 상품 */}
        {collapse.product === true && (
            <div className="row mt-4">
                {myList.map((product) => (
                    <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo}>
                        <div className="card">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title justify-content-start align-items-center"
                                    style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block" }}>
                                    {product.productName}</h5>
                                <div className="card-text text-start">
                                    <div className="row mt-3">
                                        <h5>
                                            <div className="col" style={{ fontWeight: "600" }}>
                                                {formatCurrency(product.productPrice)}원
                                            </div>
                                        </h5>

                                        <div className="col d-flex align-items-center justify-content-between">
                                            <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                        </div>
                                        <div className="text-start mt-2"
                                            style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* 상품 상태 */}
                                            {product.productState === "판매중" && (
                                                <span className='badge bg-primary me-2' >
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매보류" && (
                                                <span className='badge bg-danger me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매완료" && (
                                                <span className='badge bg-success me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productLikes > 0 ? (
                                                <div className="d-flex align-items-center mx-1">
                                                    <FaHeart className="text-danger me-1" size="20" />
                                                    <span style={{ fontWeight: "600" }}>{product.productLikes}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaRegHeart className="text-danger mx-1" size="20" />

                                                </>
                                            )}

                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}


        {/* 판매중 */}
        {collapse.sell === true && (
            <div className="row mt-4">
                {sellList.map((product) => (
                    <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                        <div className="card">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title justify-content-start align-items-center"
                                    style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block" }}>
                                    {product.productName}
                                </h5>
                                <div className="card-text text-start">
                                    <div className="row mt-3">
                                        <h5>
                                            <div className="col" style={{ fontWeight: "600" }}>
                                                {formatCurrency(product.productPrice)}원
                                            </div>
                                        </h5>

                                        <div className="col d-flex align-items-center justify-content-between">
                                            <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                        </div>
                                        <div className="text-start mt-2"
                                            style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* 상품 상태 */}
                                            {product.productState === "판매중" && (
                                                <span className='badge bg-primary me-2' >
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매보류" && (
                                                <span className='badge bg-danger me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매완료" && (
                                                <span className='badge bg-success me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productLikes > 0 ? (
                                                <div className="d-flex align-items-center mx-1">
                                                    <FaHeart className="text-danger me-1" size="20" />
                                                    <span style={{ fontWeight: "600" }}>{product.productLikes}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaRegHeart className="text-danger mx-1" size="20" />

                                                </>
                                            )}

                                        </div>


                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 예약중 */}
        {collapse.reserve === true && (
            <div className="row mt-4">
                {reserveList.map((product) => (
                    <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                        <div className="card">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title justify-content-start align-items-center"
                                    style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block" }}>
                                    {product.productName}
                                </h5>
                                <div className="card-text">
                                    {/* {product.productDetail} */}
                                    <div className="text-start">
                                        <div className="row mt-3">
                                            <h5>
                                                <div className="col" style={{ fontWeight: "600" }}>
                                                    {formatCurrency(product.productPrice)}원
                                                </div>
                                            </h5>

                                            <div className="col d-flex align-items-center justify-content-between">
                                                <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                            </div>
                                            <div className="text-start mt-2"
                                                style={{ display: 'flex', alignItems: 'center' }}>
                                                {/* 상품 상태 */}
                                                {product.productState === "판매중" && (
                                                    <span className='badge bg-primary me-2' >
                                                        {product.productState}
                                                    </span>
                                                )}
                                                {product.productState === "판매보류" && (
                                                    <span className='badge bg-danger me-2'>
                                                        {product.productState}
                                                    </span>
                                                )}
                                                {product.productState === "판매완료" && (
                                                    <span className='badge bg-success me-2'>
                                                        {product.productState}
                                                    </span>
                                                )}
                                                {product.productLikes > 0 ? (
                                                    <div className="d-flex align-items-center mx-1">
                                                        <FaHeart className="text-danger me-1" size="20" />
                                                        <span style={{ fontWeight: "600" }}>{product.productLikes}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <FaRegHeart className="text-danger mx-1" size="20" />

                                                    </>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 판매완료 */}
        {collapse.soldout === true && (
            <div className="row mt-4">
                {soldoutList.map((product) => (
                    <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                        <div className="card">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                            <div className="card-body">
                                <h5 className="card-title justify-content-start align-items-center"
                                    style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", display: "block" }}>
                                    {product.productName}
                                </h5>
                                <div className="card-text">
                                    {/* {product.productDetail} */}
                                    <div className="row mt-3">
                                        <h5>
                                            <div className="col" style={{ fontWeight: "600" }}>
                                                {formatCurrency(product.productPrice)}원
                                            </div>
                                        </h5>

                                        <div className="col d-flex align-items-center justify-content-between">
                                            <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                        </div>
                                        <div className="text-start mt-2"
                                            style={{ display: 'flex', alignItems: 'center' }}>
                                            {/* 상품 상태 */}
                                            {product.productState === "판매중" && (
                                                <span className='badge bg-primary me-2' >
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매보류" && (
                                                <span className='badge bg-danger me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productState === "판매완료" && (
                                                <span className='badge bg-success me-2'>
                                                    {product.productState}
                                                </span>
                                            )}
                                            {product.productLikes > 0 ? (
                                                <div className="d-flex align-items-center mx-1">
                                                    <FaHeart className="text-danger me-1" size="20" />
                                                    <span style={{ fontWeight: "600" }}>{product.productLikes}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaRegHeart className="text-danger mx-1" size="20" />

                                                </>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* 내가 받은 거래 후기 목록 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas1" aria-labelledby="offcanvas1Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas1Label" style={{ fontWeight: "600" }}>거래 후기</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <span style={{ fontWeight: "600", fontSize: "20px" }}>{member.memberId}</span>
                <span>님이 받은 거래 후기</span>
                {reviewList.map((review) => (
                    <div className="row mt-4" key={review.reviewNo} style={{ background: "#F1F6F9", padding: "12px" }}>
                        <div className="col">
                            <div className="row">
                                <div className="col-2 mt-2">
                                    <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col-7 ms-2" style={{ fontWeight: "600" }}>
                                            {review.reviewWriter}
                                        </div>
                                        <div className="col-4 d-flex justify-content-end align-items-center" style={{ padding: "0" }}>
                                            <span className="me-1" style={{ fontWeight: "600" }}>평가 : </span>
                                            {review.reviewScore === 1 && (<FaRegThumbsUp className=" w-auto" />)}
                                            {review.reviewScore === 0 && (<FaRegHandshake className=" w-auto" />)}
                                            {review.reviewScore === -1 && (<FaRegThumbsDown className=" w-auto" />)}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted">{"구매일시 | " + review.reviewWtime}</small>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted">{"구매상품 | " + review.productName}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col input-group">
                                    <input className="form-control border-0" style={{ background: "#FFFFFF", height: "38px" }} value={review.reviewContent} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


        {/* <div className="row mt-4 list-group">
                <h2>판매상품</h2>
                <div className="list-group-item">
                    {productList.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>가격</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((product) => (
                                    <tr key={product.productId}>
                                        <td>
                                        <NavLink to={"/product/detail/"+product.productId}>
                                            {product.productName}
                                        </NavLink>
                                        </td>
                                        <td>{product.productPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="list-group-item">상품 목록이 존재하지 않습니다</div>
                    )}
                </div>
            </div> */}

    </>
    );
};

export default MemberDetail;