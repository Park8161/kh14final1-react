import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { loginState, memberLoadingState } from "../../utils/recoil";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaRegCheckCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Paysuccess = ()=>{
    // navigate
    const navigate = useNavigate();

    const {partnerOrderId} = useParams();

    const login = useRecoilValue(loginState);
    const memberLoading = useRecoilValue(memberLoadingState);
    const [result, setResult] = useState(null);
    const [payment, setPayment] = useState({});
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);

    // const []
    useEffect(()=>{
        if(login === true && memberLoading === true){
            sendApproveRequest();
        }
    }, [login, memberLoading]);


    const sendApproveRequest = useCallback(async()=>{
        try{
            // gpt가 만들어준 url주소에서 pg_token 추출 함수
            const hash = window.location.hash;
            const queryString = hash.split('?')[1]; // Get the part after '?'
            const params = new URLSearchParams(queryString); // Parse the query string
            
            const resp = await axios.post(
                "/pay/approve",
                {
                    partnerOrderId : partnerOrderId,
                    pgToken: params.get("pg_token"),
                    tid: window.sessionStorage.getItem("tid"),
                    productNo : window.sessionStorage.getItem("productNo"),
                    totalPrice : window.sessionStorage.getItem("totalPrice")
                }   
            );

            setPayment(resp.data);
            const response = await axios.get("/product/detail/"+resp.data.productNo);
            setProduct(response.data.productDto);
            setImages(response.data.images);
            // console.log(resp.data);
            setResult(true);
        }
        catch(e){
            setResult(false);
        }
        finally{             
            window.sessionStorage.removeItem("tid");
            window.sessionStorage.removeItem("productNo");
            window.sessionStorage.removeItem("totalPrice");
        }
    },[login, memberLoading]);

    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };


    if(result === null){
        return(<>
         <div className="row d-flex align-items-middle" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div className="my-5">
                    <h5>결제 진행중</h5>
                    <PacmanLoader />
                </div>
            </div>
        </div>
        </>);
    }
    if(result=== true){
    return(<>
        <div className="row d-flex align-items-middle" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div className="my-5">
                    <FaRegCheckCircle style={{ fontSize: "4rem", color: "green" }} /> {/* Increase icon size and color */}
                    <p className="fs-5 mt-2">구매가 완료되었습니다!</p>
                </div>
                <div className="row mt-4">
                    {/* 이미지 슬라이드 */}
                    <div className="col-3 offset-3">
                        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                {images.map((image,index)=>(
                                    <button type="button" data-bs-target="#carouselExampleCaptions" key={index} data-bs-slide-to={index} className="active" aria-current="true" aria-label={"Slide "+index}></button>
                                ))}
                            </div>
                            <div className="carousel-inner">
                                {/* 
                                    active가 보여지는 이미지에만 붙어야 하는데 반복문을 사용함으로 다 붙게되어서 맨 앞 이미지만 active가 붙게끔 설정 
                                    : 이 설정이 없으면 active가 모든 이미지에 붙어서 초기 한바퀴를 수동으로 돌려주지 않으면 슬라이드가 진행이 안됨
                                */}
                                {images.map((image,index)=>(
                                <div className={"carousel-item "+(index===0 && ("active"))} key={index} style={{width:"100%", height:"100%"}}>
                                    <img src={process.env.REACT_APP_BASE_URL+"/attach/download/"+image} className="d-block w-100"/>
                                    <div className="carousel-caption d-none d-md-block">
                                        {/* 추가적인 설명 쓰는 곳 */}
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
                    <div className="col-6 text-start">
                        <div className="row mt-4">
                            <div className="col-3">
                                상품명
                            </div>
                            <div className="col-6">
                                {payment.paymentName}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-3">
                                판매자
                            </div>
                            <div className="col-6">
                                {product.productMember}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-3">
                                구매일시
                            </div>
                            <div className="col-6">
                                {payment.paymentTime}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-3">
                                총 결제금액
                            </div>
                            <div className="col-6">
                                {formatCurrency(payment.paymentTotal)}원 {/* 총 결제금액 계산 */}
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col text-muted">
                                결제 내역은 마이페이지 좌측 탭에서 확인할 수 있습니다
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-3">
                                <button className="btn btn-primary w-100 btn-sm" onClick={e=>navigate("/")}>홈으로</button>
                            </div>
                            <div className="col-3">
                                <button className="btn btn-primary w-100 btn-sm" onClick={e=>navigate("/member/mypage")}>결제내역(mypage)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
    }
    else{
        return(<>
         <div className="row d-flex align-items-middle" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div className="my-5">
                    <h1>결제 승인이 실패했거나 페이지가 만료 되었습니다.</h1>
                    {/* <NavLink to="/Pay/list">결제내역 확인하기</NavLink> */}
                </div>
                <div className="row mt-4">
                    <div className="col">
                        결제 내역은 마이페이지 좌측 탭에서 확인할 수 있습니다
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-3 offset-3">
                        <button className="btn btn-primary w-100 btn-sm" onClick={e=>navigate("/")}>홈으로</button>
                    </div>
                    <div className="col-3">
                        <button className="btn btn-primary w-100 btn-sm" onClick={e=>navigate("/member/mypage")}>결제내역(mypage)</button>
                    </div>
                </div>
            </div>
        </div>
        </>);
    }
};
export default Paysuccess;