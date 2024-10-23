import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { loginState, memberLoadingState } from "../../utils/recoil";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PacmanLoader from "react-spinners/PacmanLoader";
import { FaRegCheckCircle } from "react-icons/fa";

const Paysuccess = ()=>{

    const {partnerOrderId} = useParams();

    const login = useRecoilValue(loginState);
    const memberLoading = useRecoilValue(memberLoadingState);
    const [product, setProduct] = useState({});
    const [productNo, setProductNo] = useState(0);
    const [result, setResult] = useState(null);

    useEffect(()=>{
        if(login === true && memberLoading === true){
            sendApproveRequest();
        }
    }, [login, memberLoading]);

    useEffect(() => {
           const no = window.sessionStorage.getItem("productNo");
           setProductNo(no);
           if(productNo !== 0){
               loadProduct();
           }
    }, []);

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

    const loadProduct = useCallback(async ()=>{
        if(productNo !== 0){
            const resp = await axios.get("/product/detail/"+productNo);
            setProduct(resp.data.productDto);
        }
    },[]);

    if(result === null && product === null){
        return(<>
        <div className="row">
            <h5>결제 진행중</h5>
            <PacmanLoader />
        </div>
        </>);
    }

    else if(result=== true && product){
    return(<>
        <div className="row mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div>
                    <div>
                        <FaRegCheckCircle style={{ fontSize: "4rem", color: "green" }} /> {/* Increase icon size and color */}
                    </div>
                    <p className="fs-5 mt-2">구매가 완료되었습니다!</p>
                </div>
                <div className="row mt-4">
                    <div className="col-3">
                        <div className="row">상품명</div>
                        <div className="row">상품가격</div>
                        <div className="row">배송비</div>
                        <div className="row">총 결제금액</div>
                    </div>
                    <div className="col-9">
                        <div className="row">{product.productName}</div>
                        <div className="row">{product.productPrice}</div>
                        <div className="row">3000</div> {/* 배송비 부분은 수정하셔야 합니다 */}
                        <div className="row">{product.productPrice + 3000}</div> {/* 총 결제금액 계산 */}
                    </div>
                </div>
            </div>
</div>
    </>);

    }
    else{
        return(<>
            <h1>결제 승인 실패</h1>
        </>);
    }
};
export default Paysuccess;