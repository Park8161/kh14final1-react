import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { loginState, memberLoadingState } from "../../utils/recoil";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaRegCheckCircle } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Paysuccess = ()=>{

    const {partnerOrderId} = useParams();

    const login = useRecoilValue(loginState);
    const memberLoading = useRecoilValue(memberLoadingState);
    const [result, setResult] = useState(null);
    const [payment, setPayment] = useState({});

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
            console.log(resp.data);
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
                    <div>
                        <FaRegCheckCircle style={{ fontSize: "4rem", color: "green" }} /> {/* Increase icon size and color */}
                    </div>
                    <p className="fs-5 mt-2">구매가 완료되었습니다!</p>
                </div>
                <div className="row mt-5">
                    <div className="col-3">
                        <div className="row">상품명</div>
                        <div className="row">구매일시</div>
                        <div className="row">총 결제금액</div>
                    </div>
                    <div className="col-9">
                        <div className="row">{payment.paymentName}</div>
                        <div className="row">{payment.paymentTime}</div>
                        <div className="row">{payment.paymentTotal}</div> {/* 총 결제금액 계산 */}
                    </div>
                </div>
            </div>
        </div>
    </>);}
    else{
        return(<>
         <div className="row d-flex align-items-middle" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div className="my-5">
                    <h1>결제 승인이 실패했거나 페이지가 만료 되었습니다.</h1>
                    <NavLink to="/Pay/list">결제내역 확인하기</NavLink>
                </div>
            </div>
        </div>
        </>);
    }
};
export default Paysuccess;