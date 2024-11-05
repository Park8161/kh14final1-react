import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { Modal } from "bootstrap";
import { CiShare1,CiHeart } from "react-icons/ci";
import { FaRegThumbsUp,FaRegThumbsDown,FaRegHandshake } from "react-icons/fa";
import userImage from '../product/userImage.jpg';
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기
import { toast } from "react-toastify";

const MemberDetail = ()=>{
    // navigate
    const navigate = useNavigate();
     
    // state
    const {memberId} = useParams();
    const [member, setMember] = useState();
    const [collapse, setCollpase] = useState({
        product : false,
        sell : false,
        reserve : false,
        soldout : false,
        productButton : "btn w-100 font-16px",
        sellButton : "btn w-100 font-16px",
        reserveButton : "btn w-100 font-16px",
        soldoutButton : "btn w-100 font-16px",
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
        reviewNo : "",
        reviewContent : "",
        reviewScore : 0
    });
    const [load, setLoad] = useState(false);

    // effect
    useEffect(()=>{
        loadMember();
        loadProductList();
        setCollpase({
            ...collapse,
            product : true,
            sell : false,
            reserve : false,
            soldout : false,
            productButton : "btn w-100 font-16px border-dark",
            sellButton : "btn w-100 font-16px",
            reserveButton : "btn w-100 font-16px",
            soldoutButton : "btn w-100 font-16px",
        });
    },[]);

    // callback
    // 판매자 정보 불러오기
    const loadMember = useCallback(async ()=>{
        try{
            const response = await axios.get("/member/detail/"+memberId);
            setMember(response.data);
            // console.log("resp.data", resp.data);
        }
        catch(e){
            setMember(null);
        }
        countReview();
        loadReview();
        countPayment();
        setLoad(true); //로딩 진행상황 마킹
    }, [memberId]);

    // 판매자가 파는 상품 목록 불러오기
    const loadProductList = useCallback(async ()=>{
        const response = await axios.get("/product/myList/"+memberId);
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
    },[myList])

    // 판매자 거래 후기 목록 불러오기
    const loadReview = useCallback(async()=>{
        const response = await axios.get("/review/list/"+memberId);
        setReviewList(response.data);
    },[reviewList]);

    // 판매자에 대한 리뷰 개수 카운트 불러오기
    const countReview = useCallback(async()=>{
        const response = await axios.get("/review/count/"+memberId);
        setReviewCount(response.data);
    },[review]);

    // 거래횟수 조회
    const countPayment = useCallback(async()=>{
        const response = await axios.get("/pay/count/"+memberId);
        setPaymentCount(response.data);
    },[]);

    // 내 상품, 판매중, 예약중, 판매완료 탭 만드는 함수
    const clearCollapse = useCallback(()=>{
        setCollpase({
            product : false,
            sell : false,
            reserve : false,
            soldout : false,
            productButton : "btn w-100 font-16px",
            sellButton : "btn w-100 font-16px",
            reserveButton : "btn w-100 font-16px",
            soldoutButton : "btn w-100 font-16px",
        });
    },[collapse]);

    const changeCollapse = useCallback((e)=>{
        clearCollapse();
        setCollpase({
            ...collapse,
            [e.target.name] : true,
            [e.target.name+"Button"] : "btn w-100 font-16px border-dark"            
        });
    },[]);

    // ref
    const modal = useRef();
    
    // 링크 공유 모달
    const openModal = useCallback(()=>{
        const tag = Modal.getOrCreateInstance(modal.current);
        tag.show();
    },[modal]);

    const closeModal = useCallback(()=>{
        var tag = Modal.getInstance(modal.current);
        tag.hide();
    },[modal]);
    
    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    // url 공유하기 함수
    const copyToClipboard = useCallback(()=>{
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.info("주소 복사 완료\n"+url);
    },[]);

    if(load===false){
        return(<>
        </>);
            }
    if(member===null){
        return(<>no data</>);
    }

    

    return(<>
        
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
                                <input type="text" className="form-control" value={window.location.href} readOnly/>
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
                        <ul className="list-group list-group-horizontal" style={{maxHeight:"75px"}}>
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

        <hr className="my-0"/>

        {/* 내 상품 */}
        {collapse.product === true && (
        <div className="row mt-4 ms-4">
            {myList.map((product)=>(
            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo}>
                <div className="card">
                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <div className="card-text text-start">
                            <div className="row">
                                <div className="col">
                                    {formatCurrency(product.productPrice)}원
                                </div>
                            </div>
                            <div className="row">
                                <div className="co d-flex align-items-center">
                                    {moment(product.productDate).fromNow()}
                                    <FaRegHeart className="text-danger mx-1"/>
                                    {product.productLikes}
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
            {sellList.map((product)=>(
            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e=>navigate("/product/detail/"+product.productNo)}>
                <div className="card">
                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <div className="card-text text-start">
                            <div className="row">
                                <div className="col">
                                    {formatCurrency(product.productPrice)}원
                                </div>
                            </div>
                            <div className="row">
                                <div className="co d-flex align-items-center">
                                    {moment(product.productDate).fromNow()}
                                    <FaRegHeart className="text-danger mx-1"/>
                                    {product.productLikes}
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
            {reserveList.map((product)=>(
            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e=>navigate("/product/detail/"+product.productNo)}>
                <div className="card">
                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <div className="card-text">
                            {/* {product.productDetail} */}
                            <div className="text-start">
                                {formatCurrency(product.productPrice)}원
                                <div className="row">
                                    <div className="d-flex align-items-center col-3">
                                        {moment(product.productDate).fromNow()}
                                        <FaRegHeart className="text-danger mx-1"/>
                                        {product.productLikes}
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
            {soldoutList.map((product)=>(
            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e=>navigate("/product/detail/"+product.productNo)}>
                <div className="card">
                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <div className="card-text">
                            {/* {product.productDetail} */}
                            <div className="text-start">
                                {formatCurrency(product.productPrice)}원
                                <div className="row">
                                    <div className="d-flex align-items-center col-3">
                                        {moment(product.productDate).fromNow()}
                                        <FaRegHeart className="text-danger mx-1"/>
                                        {product.productLikes}
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

        {/* 내가 받은 거래 후기 목록 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvas1" aria-labelledby="offcanvas1Label">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvas1Label">거래 후기</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <p>{member.memberId}님이 받은 거래 후기</p>
                {reviewList.map((review)=>(
                <div className="row mt-4" key={review.reviewNo}>
                    <div className="col">
                        <div className="row">
                            <div className="col-2 mt-2">
                                <img src={userImage} className="rounded-circle" style={{width:"60px",height:"60px"}}/>
                            </div>
                            <div className="col-10">
                                <div className="row">
                                    <div className="col-8">
                                        {review.reviewWriter}
                                    </div>
                                    <div className="col-4">
                                        <span>평가 : </span>
                                        {review.reviewScore === 1 && (<FaRegThumbsUp className=" w-auto"/>)}
                                        {review.reviewScore === 0 && (<FaRegHandshake className=" w-auto"/>)}
                                        {review.reviewScore === -1 && (<FaRegThumbsDown className=" w-auto"/>)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <small className="text-muted">{"구매일시 | "+review.reviewWtime}</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <small className="text-muted">{"구매상품 | "+review.productName}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col input-group">
                                <input className="form-control bg-light border-0" value={review.reviewContent} disabled/>
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