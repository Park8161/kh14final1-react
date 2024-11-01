import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";


const Paystart = ()=>{
    
    const {productNo} = useParams();
    const [delivery, setDelivery] = useState("");
    const [total, setTotal] = useState(0);
    const [product, setProduct] = useState({});
    const [checkItem, setCheckItem] = useState({
        checkAll: false,
        checkItem1 : false,
        checkItem2 : false,
        checkItem3 : false
    });

    useEffect(() => {
        if (product.productPrice) {  // product 정보가 로드되었을 때만 실행
            setTotal(product.productPrice);
        }
    }, [product]); // product가 변경될 때 total 값 설정
    
    useEffect(() => {
        if (product.productPrice && delivery === "직거래") {
            setTotal(product.productPrice);
        }
        if (product.productPrice && delivery === "택배") {
            setTotal(product.productPrice+3000);
        }
    }, [delivery, product]);

    useEffect(()=>{
        loadProduct();
    },[]);

    // 상품정보 추출
    const loadProduct = useCallback(async()=>{
        const response = await axios.get("/product/detail/"+productNo);
        setProduct(response.data.productDto);
    },[product]);

    const changeCheckItem = (e) => {
        setCheckItem((prevCheckItem) => {
          const newCheckItem = {
            ...prevCheckItem,
            [e.target.name]: e.target.checked,
          };
          newCheckItem.checkAll =
            newCheckItem.checkItem1 &&
            newCheckItem.checkItem2 &&
            newCheckItem.checkItem3;
          return newCheckItem;
        });
      };

    const checkAll = (checked) => {
        setCheckItem({
          checkAll: checked,
          checkItem1: checked,
          checkItem2: checked,
          checkItem3: checked,
        });
      };

    const isCheckAll = useMemo(()=>{
        return checkItem.checkItem1 && checkItem.checkItem2 && checkItem.checkItem3;
    },[checkItem]);

    const getCurrentUrl = useCallback(()=>{
        return window.location.origin
                +window.location.pathname
                +(window.location.hash || '');
    },[]);

    const sendBuyRequest = useCallback(async()=>{
        if(isCheckAll !== true) return;
        try{
          const resp = await axios.post(
              "/pay/buy",
              {
                  productNo : productNo,
                  totalPrice : total,
                  approvalUrl : getCurrentUrl() + "/success",
                  cancelUrl: getCurrentUrl() + "/cancel",
                  failUrl : getCurrentUrl() + "/fail"
              }
          );

          window.sessionStorage.setItem("tid", resp.data.tid);
          window.sessionStorage.setItem("productNo", productNo);
          window.sessionStorage.setItem("totalPrice", total);

          window.location.href = resp.data.next_redirect_pc_url;
        }
        catch(e){
          toast.error("구매 진행중인 상품입니다");
        }
    },[isCheckAll, total]);

    const openModal3 = useCallback(()=>{},[]);

    return (
        <>
          <div className="container">
            <div className="row mb-3">
              <p className="fs-5">거래방법 선택하기</p>
            </div>
    
            <div className="card mb-3">
              <div className="card-body">
                <p className="fs-5">{product.productPrice}원</p>
                <p className="text-muted fs-6">{product.productName}</p>
              </div>
            </div>
    
            <div className="card mb-3">
              <div className="card-body">
                <button className="btn w-100 btn-outline-primary" onClick={() => setDelivery("택배")}>
                  <div>일반택배</div>
                  <div>원하는 주소로 받기</div>
                </button>
                <button className="btn w-100  btn-outline-primary" onClick={() => setDelivery("직거래")}>
                  <p>직거래</p>
                  <p>직접 만나서 받기</p>
                </button>
              </div>
            </div>
    
            <div className="card mb-3">
              <div className="card-body">
                <p>배송지</p>
                <div>배송지 정보</div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <div className="row">
                    <p className="col text-muted">상품금액</p>
                    <p className="col fs-5">{product.productPrice}</p>  
                </div>
                <div className="row">
                    <p className="col text-muted">배송비</p>
                    <p className="col fs-5">{total-product.productPrice}</p>  
                </div>
                <hr/>
                <div className="row">
                    <p className="col text-muted">총 결제금액</p>
                    <p className="col fs-5">{total}</p>             
                </div>
              </div>
            </div>
    
            <div className="card mb-3">
              <div className="card-body">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" checked={checkItem.checkAll}
                    onChange={e=>checkAll(e.target.checked)}/>
                  <label className="form-check-label fs-5">아래 내용에 전체 동의해요</label>
                </div>
    
                <div className="form-check">
                  <input type="checkbox" className="form-check-input"
                    checked={checkItem.checkItem1} name="checkItem1" onChange={changeCheckItem}/>
                  <label className="form-check-label">서비스 이용약관 동의 (필수)</label>
                  <NavLink className="mx-2">자세히</NavLink>
                </div>
    
                <div className="form-check">
                  <input type="checkbox" className="form-check-input"
                    checked={checkItem.checkItem2} name="checkItem2" onChange={changeCheckItem} />
                  <label className="form-check-label">개인정보 수집 및 이용동의 (필수)</label>
                  <NavLink className="mx-2">자세히</NavLink>
                </div>
    
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" 
                    checked={checkItem.checkItem3} name="checkItem3" onChange={changeCheckItem}/>
                  <label className="form-check-label">개인정보 제3자 제공 동의 (필수)</label>
                  <div className="mx-2" onClick={openModal3}>자세히</div>
                </div>
              </div>
            </div>               
    
            <div className="d-grid gap-2">
              {isCheckAll === false ? (<>
              <button className="btn btn-outline-primary" disabled={true}>
                결제 약관에 동의 바랍니다.
              </button>
              </>):(<>
              <button className="btn btn-primary" onClick={sendBuyRequest}>
                결제하기
              </button>
              </>)}
            </div>
          </div>
        </>
      );
    
};
export default Paystart;