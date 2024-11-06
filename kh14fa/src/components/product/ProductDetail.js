import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { LuDot } from "react-icons/lu";
import { CiShare1, CiHeart } from "react-icons/ci";
import { FaRegCommentDots, FaRegHeart, FaHeart } from "react-icons/fa";
import { AiOutlineSafety } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { Modal } from "bootstrap";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useRecoilValue } from 'recoil';
import { memberIdState, memberLoadingState } from "../../utils/recoil";
import userImage from './userImage.jpg';
import moment from "moment";

const ProductDetail = () => {
    // navigate
    const navigate = useNavigate();

    // state
    const memberId = useRecoilValue(memberIdState);
    const { productNo } = useParams();
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState({});
    const [relationList, setRelationList] = useState([]);
    const [like, setLike] = useState(false); // 좋아요 여부
    const [likes, setLikes] = useState(""); // 좋아요 개수
    const [productMember, setProductMember] = useState("");
    const [review, setReview] = useState(); // 판매자 리뷰 개수
    const [reviewList, setReviewList] = useState([]); // 판매자 리뷰 목록
    const [reviewProduct, setReviewProduct] = useState("");
    const [paymentCount, setPaymentCount] = useState(); //거래횟수
    
    // ref
    const modal = useRef();

    // effect
    useEffect(() => {
        loadProduct();
        if(memberId.length > 0) {
            checkLikes();
        }
    }, [memberId]);

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지가 로드되면 스크롤을 맨 위로 이동
    }, []);

    useEffect(()=>{
        countPayment(product.productMember);
    },[product]);

    // callback
    const loadProduct = useCallback(async () => {
        try {
            const response = await axios.get("/product/detail/" + productNo);
            setProduct(response.data.productDto);
            setImages(response.data.images);
            setCategory(response.data.categoryNameVO);
            loadRelation();
            countReview(response.data.productDto.productMember);
            loadReview(response.data.productDto.productMember);
        }
        catch (e) {
            navigate("/notPound");
            return (<></>);
        }
    }, [product]);

    // 연관 상품 목록 불러오기
    const loadRelation = useCallback(async () => {
        const response = await axios.get("/product/relation/" + productNo);
        // console.log(response.data.productList);
        setRelationList(response.data.productList);
    }, [product]);

    // 연관 상품 페이지 이동
    const goRelation = useCallback((product) => {
        navigate("/product/detail/" + product.productNo);
        window.location.reload(); // 화면 새로고침 : 데이터 갱신 목적
    }, []);

    // url 공유하기 함수
    const copyToClipboard = useCallback(() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.info("주소 복사 완료\n" + url);
    }, []);

    const openModal = useCallback(() => {
        const tag = Modal.getOrCreateInstance(modal.current);
        tag.show();
    }, [modal]);

    const closeModal = useCallback(() => {
        var tag = Modal.getInstance(modal.current);
        tag.hide();
    }, [modal]);

    // 좋아요 기능
    const pushLike = useCallback(async () => {
        const response = await axios.get("/product/like/" + productNo);
        if (response.data.checked) {
            setLike(true);
        }
        else {
            setLike(false);
        }
        setLikes(response.data.count);
        checkLikes();
    }, [like, likes]);

    // 좋아요 했는지 확인
    const checkLikes = useCallback(async () => {
        const response = await axios.get("/product/check/" + productNo);
        if (response.data.checked) {
            setLike(true);
        }
        else {
            setLike(false);
        }
        setLikes(response.data.count);
    }, [like, likes]);

    // 판매자에 대한 리뷰 개수 카운트 불러오기
    const countReview = useCallback(async (productMember) => {
        const response = await axios.get("/review/count/" + productMember);
        setReview(response.data);
    }, [review]);

    // 거래횟수 조회
    const countPayment = useCallback(async(productMember)=>{
        const response = await axios.get("/pay/count/"+productMember);
        setPaymentCount(response.data);
    },[]);

    // 판매자 거래 후기 목록 불러오기
    const loadReview = useCallback(async (productMember) => {
        const response = await axios.get("/review/list/" + productMember);
        // console.log(response.data);
        setReviewList(response.data);
    }, [reviewList]);

    // 채팅방 이동하기
    const goChat = useCallback(async () => {
        try {
            // 구매자와 판매자가 같으면 채팅 및 거래 불가능
            if (memberId === product.productMember) {
                toast.warning("본인 상품 구매 불가능");
                return;
            }
            else if (product.productState === "판매보류") {
                toast.warning("보류 중 상품 구매 불가능");
                return;
            }
            else if (product.productState === "판매완료") {
                toast.warning("판매완료 상품 구매 불가능");
                return;
            }
            const resp = await axios.post("/room/" + productNo);
            const roomId = resp.data;
            // chatroom의 경로변수가 될 숫자를 반환함 
            navigate("/Chat/chatroom/" + roomId);
        }
        catch (e) {
            console.log("오류발생");
        }
    }, [productNo, product]);

    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

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

    // view
    return (
        <>
            {/* <Jumbotron title="상품 상세 정보" /> */}

            <div className="row mt-4">
                {/* 이미지 슬라이드 */}
                <div className="col-md-5 col-sm-7 ">
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {images.map((image, index) => (
                                <button type="button" data-bs-target="#carouselExampleCaptions" key={index} data-bs-slide-to={index} className="active" aria-current="true" aria-label={"Slide " + index}></button>
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {/* 
                                active가 보여지는 이미지에만 붙어야 하는데 반복문을 사용함으로 다 붙게되어서 맨 앞 이미지만 active가 붙게끔 설정 
                                : 이 설정이 없으면 active가 모든 이미지에 붙어서 초기 한바퀴를 수동으로 돌려주지 않으면 슬라이드가 진행이 안됨
                            */}
                            {images.map((image, index) => (

                                <div className={"carousel-item " + (index === 0 && ("active"))} key={index}>
                                    <div className="card d-flex justify-content-center align-items-center" style={{ height: "400px", borderRadius: "0" }}>
                                        <img src={process.env.REACT_APP_BASE_URL + "/attach/download/" + image}
                                            className="card-img-top" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div className="carousel-caption d-none d-md-block">
                                            {/* 추가적인 설명 쓰는 곳 */}
                                        </div>
                                    </div>
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

                {/* 이미지 오른쪽에 상품 정보 및 기능 */}
                <div className="col-7 align-items-center">
                    <div className="row mt-2 ps-1">
                        <div className="d-flex justify-content-start align-items-center" style={{ padding: "9" }}>
                            <span className="text-muted">{category.category1st} <FaChevronRight /></span>
                            <span className="text-muted">{category.category2nd} <FaChevronRight /></span>
                            <span style={{ fontWeight: "500" }}>{category.category3rd}</span>
                        </div>
                    </div>
                    <div className="row mt-3 ">
                        <div className="col-6">
                            <h4 style={{ fontWeight: "500" }}>{product.productName}</h4>
                        </div>
                        <div className="col-6 text-end">
                            <h4 onClick={openModal}><CiShare1 /></h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col d-flex align-items-center">
                            <h1 style={{ fontWeight: "800", marginTop: "-6px" }}>{formatCurrency(product.productPrice)}원</h1>
                            {product.productState === "판매중" && (
                                <span className='badge bg-primary ms-2'>
                                    {product.productState}
                                </span>
                            )}
                            {product.productState === "판매보류" && (
                                <span className='badge bg-danger ms-2'>
                                    {product.productState}
                                </span>
                            )}
                            {product.productState === "판매완료" && (
                                <span className='badge bg-success ms-2'>
                                    {product.productState}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col text-muted">
                            <small>{timeCalculate(product.productDate)}<LuDot /></small>
                            <small>조회수 0 {/*{(product.productLikes)}*/}<LuDot /></small>
                            <small>찜 {(product.productLikes)} </small>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col mt-1">
                            <ul className="list-group list-group-horizontal justify-content-center align-items-center">
                                <li className="list-group-item text-center" style={{ width: "25%", padding: '10px 0' }}>
                                    <small className="text-muted mx-2">제품상태</small>
                                    <h6 style={{ fontWeight: "600" }}>중고</h6>
                                </li>
                                <li className="list-group-item text-center" style={{ width: "25%", padding: '10px 0' }}>
                                    <small className="text-muted mx-2">거래방식</small>
                                    <h6 style={{ fontWeight: "600" }}>택배</h6>
                                </li>
                                <li className="list-group-item text-center" style={{ width: "25%", padding: '10px 0' }}>
                                    <small className="text-muted mx-3">배송비</small>
                                    <h6 style={{ fontWeight: "600" }}>별도</h6>
                                </li>
                                <li className="list-group-item text-center" style={{ width: "25%", padding: '10px 0' }}>
                                    <small className="text-muted mx-2">안전거래</small>
                                    <h6 style={{ fontWeight: "600" }}>사용</h6>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mt-4 justify-content-center align-items-center">
                        <div className="col-3 text-muted">
                            <small>
                                <LuDot />
                                결제혜택
                            </small>
                        </div>
                        <div className="col-9">
                            <small>
                                카카오페이 결제 5% 적립 혜택
                            </small>
                        </div>
                    </div>
                    <div className="row mt-4 d-flex justify-content-center align-items-center">
                        <div className="col-2 d-flex align-items-center" >
                            <div className="text-center" onClick={pushLike} >
                                {like ? (
                                    <FaHeart className="text-danger" style={{ cursor: "pointer", width: "30px", height: "30px" }} />
                                ) : (
                                    <FaRegHeart className="text-danger" style={{ cursor: "pointer", width: "30px", height: "30px" }} />
                                )}
                                {/* <span className="text-danger text-center">{likes}</span> */}
                            </div>
                        </div>
                        {product.productMember === memberId ? (<>
                            <div className="col-5" style={{height:"50px"}}></div>
                            <div className="col-5" style={{height:"50px"}}></div>
                        </>):(<>
                        <div className="col-5 d-flex align-items-center">
                            <button className="btn btn-outline-dark btn-lg text-nowrap" style={{ height: "50px", width: "100%" }}
                                onClick={goChat}>
                                <FaRegCommentDots />
                                채팅하기
                            </button>
                        </div>
                         {/* 판매중일때만 구매버튼 활성화 */}
                         {product.productState === "판매중" ?(<>
                        <div className="col-5 d-flex align-items-center">
                            <button className="btn btn-outline-success btn-lg text-nowrap " style={{ height: "50px", width: "100%" }}
                                onClick={e=>navigate("/Pay/paystart/" + product.productNo)}>
                                <AiOutlineSafety />
                                안전거래
                            </button>
                        </div>
                         </>):(<>
                            <div className="col-5">
                                    <button className="btn btn-outline-success btn-lg w-100 text-nowrap" 
                                    style={{height:"50px"}} disabled={true}>거래불가상태
                                    </button>
                                </div>
                         </>)}
                        </>)}
                    </div>
                </div>
            </div>

            {/* 하단의 상품 상세 정보 및 판매자 정보*/}
            <div className="row mt-5">
                <div className="col-7">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item" style={{paddingLeft:"0" }}>
                            <h4 style={{ fontWeight: "600"}}>상품 정보</h4>
                        </li>
                        <li className="list-group-item mt-2" style={{ minHeight: "250px", paddingLeft:"0" }}>
                            <span style={{fontSize:"17px"}}>{product.productDetail}</span>
                        </li>
                    </ul>
                </div>
                <div className="col-4 offset-1">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"  style={{paddingLeft:"0" }}>
                            <h4 style={{ fontWeight: "600" }}>판매자 정보</h4>
                        </li>
                        <li className="list-group-item mt-2"  style={{paddingLeft:"0" }}>
                            <h4 className="align-items-center" style={{ fontWeight: "600" }}>{product.productMember}
                                <FaChevronRight className="ms-4 icon-link" style={{ cursor: "pointer" }}
                                    onClick={e => navigate("/member/detail/" + product.productMember)} />
                            </h4>
                            <div className="row mt-5">
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
                                                    <h5>{paymentCount}</h5>
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
                                                    <button className="btn btn-link btn-sm text-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas1">
                                                        <h5>{review}</h5>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* <hr/> */}

            {/* 연관/추천 상품, 이런 상품은 어때요? */}
            {relationList.length !== 0 && (
                <div className="row mt-1">
                    <div className="col">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item" style={{ border: "none" }}>
                                <h4 style={{ fontWeight: "600" }}>이런 상품은 어때요?</h4>
                            </li>
                            <li className="list-group-item">
                                <div className="row">
                                    {relationList.map((product) => (
                                        <div className="col-2 mt-1" key={product.productNo} onClick={() => (goRelation(product))}>
                                            <div className="card">
                                                <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
                                                    className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                                <div className="card-body">
                                                    <h5 className="card-title text-truncate">{product.productName}</h5>
                                                    {/* <div className="card-text text-truncate"> */}
                                                    {/* <span>{product.productDetail}</span> */}
                                                    <div className="row mt-3">
                                                        <h5>
                                                            <div className="col" style={{ fontWeight: "600" }}>
                                                                {formatCurrency(product.productPrice)}원
                                                            </div>
                                                        </h5>

                                                        <div className="col d-flex align-items-center justify-content-between">
                                                            <span className="text-muted">{timeCalculate(product.productDate)}</span>
                                                            <div className="d-flex align-items-center">
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

                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* 링크 공유하기 모달 */}
            <div className="modal fade" tabIndex="-1" ref={modal} /*data-bs-backdrop="static"*/>
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* 모달 헤더 - 제목, x버튼 */}
                        <div className="modal-header">
                            <p className="modal-title">상품 공유하기</p>
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

            {/* 거래 후기 목록 */}
            <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="offcanvas1" aria-labelledby="offcanvas1Label">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvas1Label">거래 후기</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p>{product.productMember}님에 대한 거래 후기</p>
                    {reviewList.map((review) => (
                        <div className="row mt-4" key={review.reviewNo}>
                            <div className="col">
                                <div className="row">
                                    <div className="col-2 mt-2">
                                        <img src={userImage} className="rounded-circle" style={{ width: "60px", height: "60px" }} />
                                    </div>
                                    <div className="col-10">
                                        <div className="row" onClick={e => navigate("/member/detail/" + review.reviewWriter)} data-bs-dismiss="offcanvas" aria-label="Close">
                                            <div className="col">
                                                {review.reviewWriter}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <small className="text-muted">{"구매자 | " + review.reviewWtime}</small>
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
                                    <div className="col">
                                        <input className="form-control bg-light border-0" value={review.reviewContent} disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};
export default ProductDetail;