import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { loginState, memberLoadingState } from "../../utils/recoil";
import { useRecoilValue } from "recoil";

const PayList = ()=>{

    const [payList, setPayList] = useState([]);
    const [dataLoad, setDataLoad] = useState(false);

    const login = useRecoilValue(loginState);
    const memberLoading = useRecoilValue(memberLoadingState);

    useEffect(()=>{
        if(login === true && memberLoading === true) {
            loadPayList();
        }
    },[login, memberLoading]);

    const loadPayList = useCallback(async()=>{
        const resp = await axios.get("/pay/listWithImage");
        setPayList(resp.data);
        setDataLoad(true);
    }, [payList]);

    const confirmBuy = useCallback(async(paymentNo)=>{
        const resp = await axios.post("/pay/confirmBuy/"+paymentNo);
        loadPayList();
    },[payList]);

    const cancelBuy = useCallback(async(paymentNo)=>{
        const resp = await axios.delete("/kakaopay/cancelAll/"+paymentNo);
        loadPayList();
    },[payList]);

    if(dataLoad===true && payList.length === 0){
        return(<>
            구매내역이 없습니다
        </>)    }

    if(dataLoad===false && payList.length === 0){
    return(<>
        구매내역을 불러오는 중입니다
        <PacmanLoader/>
    </>)    }

    if(dataLoad===true && payList.length !== 0){
        return (
            <>
              <div className="row">
                <div className="col">
                  <ul className="list-group">
                    {payList.map((payment) => (
                      <li key={payment.paymentNo} className="list-group-item">
                        <div className="card">
                          <div className="card-body">
                                <div>{payment.paymentTime}</div>
                                <hr/>
                                <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${payment.attachment}`} className="card-img-top" />
                                <h3 className="card-title d-flex justify-content-between">
                                {payment.paymentName}
                                </h3>
                                <p className="ms-2 text-muted fs-5">
                                    {payment.paymentTotal}원</p>
                                <p className="ms-2 text-muted fs-6">
                                {payment.paymentSeller}</p>
                                {/* Conditionally render buttons based on paymentStatus */}
                                {payment.paymentStatus === "승인" && (
                                    <div>
                                        <div className="text-end mb-2">
                                            <button className="btn btn-primary w-100"
                                                onClick={e=>confirmBuy(payment.paymentNo)}>구매확정</button>
                                        </div>
                                        <div className="text-end mb-2">
                                            <button className="btn btn-secondary w-100"
                                                onClick={e=>cancelBuy(payment.paymentNo)}>구매취소</button>
                                        </div>
                                    </div>
                                )}

                                {payment.paymentStatus === "확정" && (                               
                                    <div className="text-end">
                                        <NavLink to={`/Review/insert/${payment.productNo}`} className="btn btn-primary w-100">후기 남기기</NavLink>
                                    </div>                                    
                                )}

                                {payment.paymentStatus === "취소" && (                               
                                    <div className="text-end">
                                        취소된 구매 항목입니다.
                                    </div>                                    
                                )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          );
          
}
};
export default PayList;
