import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Jumbotron from "../Jumbotron";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Collapse, Modal } from "bootstrap";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { CiShare1, CiHeart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaAsterisk } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import userImage from '../product/userImage.jpg';
import { CiEdit } from "react-icons/ci";
import { FaRegThumbsUp, FaRegThumbsDown, FaRegHandshake } from "react-icons/fa";
import { TbShoppingBagPlus, TbShoppingBagSearch, TbShoppingBagX } from "react-icons/tb";
import PacmanLoader from "react-spinners/PacmanLoader";
import moment from "moment";

const MyPage = () => {
    // navigate
    const navigate = useNavigate();

    // ref
    const modal = useRef();
    const DPmodal = useRef();
    const deleteReviewModal = useRef();
    const editReviewModal = useRef();

    //state
    const [member, setMember] = useState({});
    const [collapse, setCollpase] = useState({
        product: false,
        sell: false,
        reserve: false,
        soldout: false,
        productButton: "btn w-100 font-16px",
        sellButton: "btn w-100 font-16px",
        reserveButton: "btn w-100 font-16px",
        soldoutButton: "btn w-100 font-16px",
    });
    const [likeList, setLikeList] = useState([]);
    const [myList, setMyList] = useState([]);
    const [sellList, setSellList] = useState([]);
    const [reserveList, setReserveList] = useState([]);
    const [soldoutList, setSoldoutList] = useState([]);
    const [product, setProduct] = useState([]);
    const [images, setImages] = useState([]);
    const [reviewList, setReviewList] = useState([]); // 내가 쓴 리뷰 목록
    const [review2List, setReview2List] = useState([]); // 내가 받은 리뷰 목록
    const [review, setReview] = useState([]);
    const [reviewCount, setReviewCount] = useState();
    const [edit, setEdit] = useState({
        reviewNo: "",
        reviewContent: "",
        reviewScore: 0
    });
    const [reviewscore, setReviewscore] = useState(0);
    const [payList, setPayList] = useState([]);

    //effect
    useEffect(() => {
        loadMember();
        loadLikeList();
        loadPayList();
        setCollpase({
            ...collapse,
            product: true,
            sell: false,
            reserve: false,
            soldout: false,
            productButton: "btn w-100 font-16px border-dark",
            sellButton: "btn w-100 font-16px",
            reserveButton: "btn w-100 font-16px",
            soldoutButton: "btn w-100 font-16px",
        });
    }, []);

    //callback
    const loadMember = useCallback(async () => {
        const response = await axios.get("/member/mypage");
        setMember(response.data);
        // console.log(response.data);
        loadReview();
        countReview();
        loadReview2();
    }, [member]);

    // 내가 찜한 상품 불러오기
    const loadLikeList = useCallback(async () => {
        const response = await axios.get("/member/active");
        setLikeList(response.data.likeList);
        setMyList(response.data.myList);
        // console.log(response.data.myList);
        setSellList(
            (response.data.myList).filter(product => product.productState === '판매중')
        );
        setReserveList(
            (response.data.myList).filter(product => product.productState === '예약중')
        );
        setSoldoutList(
            (response.data.myList).filter(product => product.productState === '판매완료')
        );
    }, [likeList]);

    // 결제 내역 불러오기
    const loadPayList = useCallback(async () => {
        const response = await axios.get("/pay/listWithImage");
        setPayList(response.data);
        // console.log(response.data);
    }, [payList]);

    // 구매확정 진행
    const confirmBuy = useCallback(async (paymentNo) => {
        const resp = await axios.post("/pay/confirmBuy/" + paymentNo);
        loadPayList();
    }, [payList]);

    // 구매취소 진행
    const cancelBuy = useCallback(async (paymentNo) => {
        const resp = await axios.delete("/kakaopay/cancelAll/" + paymentNo);
        loadPayList();
    }, [payList]);

    const deleteProduct = useCallback(async (productNo) => {
        try {
            const response = await axios.delete("/product/" + productNo);
            toast.error("상품 삭제 완료");
            // window.location.reload();
            loadLikeList();
            closeDPModal();
        }
        catch (e) {
            toast.warning("상품 삭제 실패");
        }
    }, []);

    const selectProduct = useCallback(async (productNo) => {
        const response = await axios.get("/product/detail/" + productNo);
        setProduct(response.data.productDto);
        setImages(response.data.images);
    }, [product, images]);

    // 내가 쓴 리뷰 목록 불러오기
    const loadReview = useCallback(async () => {
        const response = await axios.get("/review/myList");
        // console.log(response.data);
        setReviewList(response.data);
    }, [reviewList]);

    // 내가 받은 리뷰 목록 불러오기
    const loadReview2 = useCallback(async () => {
        const response = await axios.get("/review/list/" + member.memberId);
        setReview2List(response.data);
    }, [review2List, member]);

    // 내가 받은 리뷰 개수 카운트 불러오기
    const countReview = useCallback(async () => {
        const response = await axios.get("/review/count/" + member.memberId);
        setReviewCount(response.data);
    }, [review, member]);

    // 리뷰 삭제
    const deleteReview = useCallback(async (reviewNo) => {
        const response = await axios.delete("/review/" + reviewNo);
        toast.error("거래 후기 삭제 완료");
        closeDRModal();
        loadReview();
    }, []);

    // 리뷰 수정
    const editReview = useCallback(async () => {
        const response = await axios.put("/review/update", edit);
        toast.info("거래 후기 수정 완료");
        closeERModal();
        loadReview();
    }, [edit]);

    const changeEdit = useCallback((e) => {
        setEdit({
            ...edit,
            [e.target.name]: e.target.value
        });
    }, [edit]);

    const clearCollapse = useCallback(() => {
        setCollpase({
            product: false,
            sell: false,
            reserve: false,
            soldout: false,
            productButton: "btn w-100 font-16px",
            sellButton: "btn w-100 font-16px",
            reserveButton: "btn w-100 font-16px",
            soldoutButton: "btn w-100 font-16px",
        });
    }, [collapse]);

    const changeCollapse = useCallback((e) => {
        clearCollapse();
        setCollpase({
            ...collapse,
            [e.target.name]: true,
            [e.target.name + "Button"]: "btn w-100 font-16px border-dark"
        });
    }, []); // 왜 연관항목이 없어야 되는거..?

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

    const closeDPModal = useCallback(() => {
        var tag = Modal.getInstance(DPmodal.current);
        tag.hide();
    }, [DPmodal]);

    // 리뷰 삭제 모달
    const openDRModal = useCallback((review) => {
        const tag = Modal.getOrCreateInstance(deleteReviewModal.current);
        tag.show();
        setReview(review);
    }, [deleteReviewModal]);

    const closeDRModal = useCallback(() => {
        var tag = Modal.getInstance(deleteReviewModal.current);
        tag.hide();
    }, [deleteReviewModal]);

    // 리뷰 수정 모달
    const openERModal = useCallback((review) => {
        const tag = Modal.getOrCreateInstance(editReviewModal.current);
        tag.show();
        setEdit(review);
        setReviewscore(review.reviewScore);
    }, [editReviewModal]);

    const closeERModal = useCallback(() => {
        var tag = Modal.getInstance(editReviewModal.current);
        tag.hide();
    }, [editReviewModal]);

    // 리뷰 아이콘 누르면 점수가 state로 전송되게 하기
    const changeRS = useMemo(() => {
        setEdit({
            ...edit,
            reviewScore: reviewscore
        });
    }, [reviewscore]);

    // 인증회원 이상이 이메일 인증할 경우 튕겨내기용 함수
    const alreadyCert = useCallback(() => {
        navigate("");
        toast.info("미인증회원만 이용가능");
    }, []);

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
        {/* <Jumbotron title={`${member.memberId} 님의 정보`}/> */}

        <div className="row mt-4">

            <div className="col-2 border-end">
                <div className="row mt-4">
                    <h3 className="mt-4">거래 정보</h3>
                    <div className="col ps-3">
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3 font-16px" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas1">
                                    판매 내역
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3 font-16px" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas2">
                                    결제 내역
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3 font-16px" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas3" onClick={loadLikeList}>
                                    찜한 상품
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row mt-4">
                    <div className="col">
                        <h3>내 정보</h3>
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3 font-16px" data-bs-toggle="offcanvas" data-bs-target="#offcanvas4" >
                                    거래 후기
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3 font-16px" onClick={member.memberLevel === "일반회원" ? (e => navigate("/member/cert/" + member.memberEmail + "/" + member.memberReliability)) : (alreadyCert)} >
                                    이메일 인증하기
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3 font-16px" to="/member/changepw">
                                    비밀번호 변경
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3 font-16px" to="/member/edit">
                                    개인정보 수정
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3 font-16px" to="/member/block/list">
                                    차단 목록
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn font-16px" to="/member/exit">
                                    탈퇴하기
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-9 ms-4">

                <div className="row">
                    <div className="col-6 col-sm-5">
                        <div className="row">
                            <div className="col-9">
                                <h2>{member.memberName}#{member.memberId}</h2>
                            </div>
                            <div className="col-3 text-center pe-4">
                                <h4 onClick={openModal}><CiShare1 /></h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <ul className="list-group list-group-horizontal" style={{ maxHeight: "75px" }}>
                                    <li className="list-group-item text-center">
                                        <div className="row">
                                            <div className="col">
                                                <small className="text-muted mx-2">거래횟수</small>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col mt-1">
                                                <h5>0</h5>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-group-item text-center">
                                        <div className="row">
                                            <div className="col">
                                                <small className="text-muted mx-2">거래후기</small>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <button className="btn btn-link btn-sm text-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas5">
                                                    <h5>{reviewCount}</h5>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-sm-5">
                        <p className="row">신뢰지수 {member.memberReliability}</p>
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

                <div className="row mt-4">
                    <div className="col">
                        <button className="btn btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#myInfo">
                            내 정보 확인
                        </button>
                        <div className="collapse ms-4 mt-4 p-4 border" id="myInfo">
                            <div className="row">
                                <div className="col-3">
                                    <div className="row mt-4">
                                        <div className="col-5">이름</div>
                                        <div className="col-7">{member.memberName}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-5">이메일</div>
                                        <div className="col-7">{member.memberEmail}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-5">회원등급</div>
                                        <div className="col-7">{member.memberLevel}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-5">포인트</div>
                                        <div className="col-7">{member.memberPoint}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-5">신뢰지수</div>
                                        <div className="col-7">{member.memberReliability}</div>
                                    </div>
                                </div>
                                <div className="col-8 offset-1">
                                    <div className="row mt-4">
                                        <div className="col-2">주소</div>
                                        <div className="col-10">
                                            [{member.memberPost}]
                                            {" " + member.memberAddress1}
                                            {" " + member.memberAddress2}
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-2">전화번호</div>
                                        <div className="col-10">{member.memberContact}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-2">생년월일</div>
                                        <div className="col-10">{member.memberBirth}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-2">최근접속</div>
                                        <div className="col-10">{member.memberLogin}</div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-2">가입일</div>
                                        <div className="col-10">{member.memberJoin}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 text-center">
                    <div className="col-3">
                        <button className={collapse.productButton} name="product" onClick={changeCollapse}>내 상품</button>
                    </div>
                    <div className="col-3">
                        <button className={collapse.sellButton} name="sell" onClick={changeCollapse}>판매중</button>
                    </div>
                    <div className="col-3">
                        <button className={collapse.reserveButton} name="reserve" onClick={changeCollapse}>예약중</button>
                    </div>
                    <div className="col-3">
                        <button className={collapse.soldoutButton} name="soldout" onClick={changeCollapse}>판매완료</button>
                    </div>
                </div>

                <hr className="my-0" />

                {/* 내 상품 */}
                {collapse.product === true && (
                    <div className="row mt-4 ms-4">
                        {myList.map((product) => (
                            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo}>
                                <div className="card">
                                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                        className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.productName}</h5>
                                        <div className="card-text text-start">
                                            <div className="row mt-3">
                                                <h5>
                                                    <div className="col" style={{ fontWeight: "600" }}>
                                                        {formatCurrency(product.productPrice)}원
                                                    </div>
                                                </h5>

                                                <div className="col d-flex align-items-center justify-content-between">
                                                    <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                                    <div className="d-flex align-items-center">
                                                        <FaRegHeart className="text-danger mx-1" size="20" />
                                                        {product.productLikes > 0 && (
                                                            <spna>{product.productLikes}</spna>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row mt-3">
                                                <div className="col text-end">
                                                    <button className="btn btn-light btn-sm text-success " onClick={e => navigate("/product/detail/" + product.productNo)}>
                                                        <TbShoppingBagSearch />
                                                        상세
                                                    </button>
                                                    <button className="btn btn-light btn-sm text-info ms-2" onClick={e => navigate("/product/edit/" + product.productNo)}>
                                                        <TbShoppingBagPlus />
                                                        수정
                                                    </button>
                                                    <button className="btn btn-light btn-sm text-danger ms-2" onClick={e => openDPModal(product.productNo)}>
                                                        <TbShoppingBagX />
                                                        삭제
                                                    </button>
                                                </div>
                                            </div> */}
                                            {/* 버튼 길이 늘리고 가운데로 맞춤 */}
                                            <div className="row mt-3">
                                                <div className="col d-flex justify-content-between align-items-center">
                                                    <div className="d-flex justify-content-start">
                                                        <button className="btn btn-light btn-sm text-success" style={{ width: "70px" }} onClick={e => navigate("/product/detail/" + product.productNo)}>
                                                            <TbShoppingBagSearch />
                                                            상세
                                                        </button>
                                                    </div>
                                                    <div className="d-flex justify-content-center">
                                                        <button className="btn btn-light btn-sm text-info" style={{ width: "70px" }} onClick={e => navigate("/product/edit/" + product.productNo)}>
                                                            <TbShoppingBagPlus />
                                                            수정
                                                        </button>
                                                    </div>
                                                    <div className="d-flex justify-content-end">
                                                        <button className="btn btn-light btn-sm text-danger" style={{ width: "70px" }} onClick={e => openDPModal(product.productNo)}>
                                                            <TbShoppingBagX />
                                                            삭제
                                                        </button>
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

                {/* 판매중 */}
                {collapse.sell === true && (
                    <div className="row mt-4 ms-4">
                        {sellList.map((product) => (
                            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                                <div className="card">
                                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                        className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.productName}</h5>
                                        <div className="card-text text-start">
                                            <div className="row mt-3">
                                                <h5>
                                                    <div className="col" style={{ fontWeight: "600" }}>
                                                        {formatCurrency(product.productPrice)}원
                                                    </div>
                                                </h5>

                                                <div className="col d-flex align-items-center justify-content-between">
                                                    <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                                    <div className="d-flex align-items-center">
                                                        <FaRegHeart className="text-danger mx-1" size="20" />
                                                        {product.productLikes > 0 && (
                                                            <spna>{product.productLikes}</spna>
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

                {/* 예약중 */}
                {collapse.reserve === true && (
                    <div className="row mt-4 ms-4">
                        {reserveList.map((product) => (
                            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                                <div className="card">
                                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                        className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.productName}</h5>
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
                                                        <div className="d-flex align-items-center">
                                                            <FaRegHeart className="text-danger mx-1" size="20" />
                                                            {product.productLikes > 0 && (
                                                                <spna>{product.productLikes}</spna>
                                                            )}

                                                        </div>
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
                    <div className="row mt-4 ms-4">
                        {soldoutList.map((product) => (
                            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                                <div className="card">
                                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                        className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.productName}</h5>
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
                                                    <div className="d-flex align-items-center">
                                                        <FaRegHeart className="text-danger mx-1" size="20" />
                                                        {product.productLikes > 0 && (
                                                            <spna>{product.productLikes}</spna>
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

            </div>
        </div>


        {/* 사이드 화면에서 메뉴 튀어나오게 하기 */}

        {/* 판매 내역 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas1" aria-labelledby="offcanvas1Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas1Label">판매 내역</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {soldoutList.map((product) => (
                    <div className="row" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)} data-bs-dismiss="offcanvas">
                        <div className="col-6">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                        </div>
                        <div className="col-6">
                            <div className="row mt-4">
                                <div className="col">
                                    {product.productName}
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col">
                                    {formatCurrency(product.productPrice)}원,
                                    {" " + product.productQty}개
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {product.productState}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 결제 내역 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas2" aria-labelledby="offcanvas2Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas2Label">결제 내역</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {payList.map((payment) => (
                    <div className="row mt-2" key={payment.paymentNo} onClick={e => navigate("/product/detail/" + payment.productNo)} data-bs-dismiss="offcanvas">
                        <div className="col-5">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${payment.attachment}`} className="card-img-top" />
                        </div>
                        <div className="col-7">
                            <div className="row">
                                <div className="col">
                                    {payment.paymentName}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-muted ms-1">
                                    <small className="text-muted">
                                        {"판매가 | " + formatCurrency(payment.paymentTotal) + "원"}
                                    </small>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-muted ms-1">
                                    <small className="text-muted">
                                        {"판매자 | " + payment.paymentSeller}
                                    </small>
                                </div>
                            </div>
                            {payment.paymentStatus === "승인" && (
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted ms-1">
                                                {"승인시각 | " + payment.paymentTime}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col btn-group text-end">
                                            <button className="btn btn-primary w-100 btn-sm me-1" onClick={e => confirmBuy(payment.paymentNo)}>
                                                <small>
                                                    구매확정
                                                </small>
                                            </button>
                                            <button className="btn btn-secondary w-100 btn-sm ms-1" onClick={e => cancelBuy(payment.paymentNo)}>
                                                <small>
                                                    구매취소
                                                </small>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {payment.paymentStatus === "확정" && (
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted ms-1">
                                                {"구매완료 | " + payment.paymentTime}
                                            </small>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col text-end mt-1">
                                            <NavLink to={`/Review/insert/${payment.productNo}`} className="btn btn-primary w-100 btn-sm">
                                                후기 남기기
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {payment.paymentStatus === "취소" && (
                                <div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted ms-1">
                                            </small>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col btn-group text-end">
                                            <button className="btn btn-primary w-100 btn-sm ms-1" disabled>
                                                결제 취소 완료
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 찜한 상품 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas3" aria-labelledby="offcanvas3Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas3Label">내 관심</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {likeList.map((product) => (
                    <div className="row" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)} data-bs-dismiss="offcanvas">
                        <div className="col-6">
                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                        </div>
                        <div className="col-6">
                            <div className="row mt-4">
                                <div className="col">
                                    {product.productName}
                                </div>
                            </div>
                            <div className="row mt-1">
                                <div className="col">
                                    {formatCurrency(product.productPrice)}원,
                                    {" " + product.productQty}개
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {product.productState}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


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

        {/* 상품 삭제 모달 */}
        <div className="modal fade" tabIndex="-1" ref={DPmodal} data-bs-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">상품 삭제</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={closeDPModal} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                        <div className="row">
                            <div className="col d-flex justify-content-center align-items-center">
                                <FaAsterisk className="text-danger" />
                                상품 정보가 삭제됩니다 다시 한번 확인하세요
                                <FaAsterisk className="text-danger" />
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col">
                                {images.map((no) => (
                                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${no}`} style={{ width: "100px", height: "100px" }} key={no} />
                                ))}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col">
                                <input type="text" className="form-control" value={product.productName} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mt-2 text-end">
                                <input type="text" className="form-control" value={product.productPrice} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mt-2 text-end">
                                <input type="text" className="form-control" value={product.productQty} />
                            </div>
                        </div>
                    </div>

                    {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeDPModal}>
                            닫기<IoMdClose className="ms-1 btn-lg-white" />
                        </button>
                        <button type="button" className="btn btn-danger" onClick={e => deleteProduct(product.productNo)}>
                            삭제<MdDeleteForever className="ms-1" />
                        </button>
                    </div>

                </div>
            </div>
        </div>

        {/* 내가 쓴 거래 후기 목록 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas4" aria-labelledby="offcanvas4Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas4Label">거래 후기</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <p>{member.memberId}님이 쓴 거래 후기</p>
                {reviewList.map((review) => (
                    <div className="row mt-4" key={review.reviewNo}>
                        <div className="col">
                            <div className="row">
                                <div className="col-2 mt-2">
                                    <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col-8">
                                            {review.reviewWriter}
                                        </div>
                                        <div className="col-4">
                                            <span>평가 : </span>
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
                                    <input className="form-control bg-light border-0" value={review.reviewContent} disabled />
                                    <button className="btn btn-info text-light btn-sm" onClick={e => openERModal(review)}>수정</button>
                                    <button className="btn btn-danger btn-sm" onClick={e => openDRModal(review)}>삭제</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 내가 받은 거래 후기 목록 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas5" aria-labelledby="offcanvas5Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas5Label">거래 후기</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <p>{member.memberId}님이 받은 거래 후기</p>
                {reviewList.map((review) => (
                    <div className="row mt-4" key={review.reviewNo}>
                        <div className="col">
                            <div className="row">
                                <div className="col-2 mt-2">
                                    <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col-8">
                                            {review.reviewWriter}
                                        </div>
                                        <div className="col-4">
                                            <span>평가 : </span>
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
                                    <input className="form-control bg-light border-0" value={review.reviewContent} disabled />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 리뷰 삭제 모달 */}
        <div className="modal fade" tabIndex="-1" ref={deleteReviewModal} data-bs-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">거래 후기 삭제</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={closeDRModal} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                        <div className="row mt-4">
                            <div className="col d-flex justify-content-center align-items-center">
                                <FaAsterisk className="text-danger" />
                                거래 후기가 삭제됩니다 다시 한번 확인하세요
                                <FaAsterisk className="text-danger" />
                            </div>
                        </div>
                        <div className="border m-4">
                            <div className="row">
                                <div className="col-2 mt-2">
                                    <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col">
                                            {review.reviewWriter}
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
                                <div className="row pe-0">
                                    <div className="col pe-0">
                                        <input className="form-control bg-light border-0 pe-0" value={review.reviewContent} disabled />
                                    </div>
                                </div>
                                <div className="row ms-3 text-center">
                                    <div className={"col-3 pt-3 " + (review.reviewScore === 1 && "border")}>
                                        <FaRegThumbsUp className="d-block w-100" />
                                        <p className="mt-2">최고에요!</p>
                                    </div>
                                    <div className={"col-3 pt-3 " + (review.reviewScore === 0 && "border")}>
                                        <FaRegHandshake className="d-block w-100" />
                                        <p className="mt-2">좋아요!</p>
                                    </div>
                                    <div className={"col-3 pt-3 " + (review.reviewScore === -1 && "border")}>
                                        <FaRegThumbsDown className="d-block w-100" />
                                        <p className="mt-2">별로에요</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeDRModal}>
                            닫기<IoMdClose className="ms-1 btn-lg-white" />
                        </button>
                        <button type="button" className="btn btn-danger" onClick={e => deleteReview(review.reviewNo)}>
                            삭제<MdDeleteForever className="ms-1" />
                        </button>
                    </div>

                </div>
            </div>
        </div>

        {/* 리뷰 수정 모달 */}
        <div className="modal fade" tabIndex="-1" ref={editReviewModal} data-bs-backdrop="static">
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">거래 후기 수정</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={closeERModal} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                        {/* <div className="row">
                            <div className="col d-flex justify-content-center align-items-center">
                                <FaAsterisk className="text-danger" />
                                상품 정보가 삭제됩니다 다시 한번 확인하세요
                                <FaAsterisk className="text-danger" />
                            </div>                                
                        </div> */}
                        <div className="border m-4">
                            <div className="row">
                                <div className="col-2 mt-2">
                                    <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                </div>
                                <div className="col-10">
                                    <div className="row">
                                        <div className="col">
                                            {edit.reviewWriter}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted">{"구매일시 | " + edit.reviewWtime}</small>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="text-muted">{"구매상품 | " + edit.productName}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="row pe-0">
                                    <div className="col pe-0">
                                        <input className="form-control bg-light border-0 pe-0" value={edit.reviewContent} name="reviewContent" onInput={changeEdit} />
                                    </div>
                                </div>
                                <div className="row mt-3 ms-3 text-center">
                                    <div className={"col-2 pt-3 " + (reviewscore === 1 && "border")} name="reviewScore" value={1} onClick={e => setReviewscore(1)}>
                                        <FaRegThumbsUp className="d-block w-100" />
                                        <p className="mt-2">최고에요!</p>
                                    </div>
                                    <div className={"col-2 pt-3 " + (reviewscore === 0 && "border")} name="reviewScore" value={0} onClick={e => setReviewscore(0)}>
                                        <FaRegHandshake className="d-block w-100" />
                                        <p className="mt-2">좋아요!</p>
                                    </div>
                                    <div className={"col-2 pt-3 " + (reviewscore === -1 && "border")} name="reviewScore" value={-1} onClick={e => setReviewscore(-1)}>
                                        <FaRegThumbsDown className="d-block w-100" />
                                        <p className="mt-2">별로에요</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeERModal}>
                            닫기<IoMdClose className="ms-1 btn-lg-white" />
                        </button>
                        <button type="button" className="btn btn-info text-light" onClick={e => editReview(edit.reviewNo)}>
                            수정<CiEdit className="ms-1" />
                        </button>
                    </div>

                </div>
            </div>
        </div>


    </>);
};

export default MyPage;