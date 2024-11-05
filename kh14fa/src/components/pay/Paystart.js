import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";
import { useRecoilValue } from "recoil";
import { memberIdState } from "../../utils/recoil";

const Paystart = ()=>{
    
  // state
    const memberId = useRecoilValue(memberIdState);
    const {productNo} = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState("");
    const [total, setTotal] = useState(0);
    const [product, setProduct] = useState({});
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [member, setMember] = useState({});

    const [checkItem, setCheckItem] = useState({
        checkAll: false,
        checkItem1 : false,
        checkItem2 : false,
        checkItem3 : false
    });

    // ref
    const modal1 = useRef();
    const modal2 = useRef();
    const modal3 = useRef();
    
    // useEffect
    useEffect(()=>{
      checkState();
      loadProduct();
      loadMember();
    },[]);

    // useCallback
    // **구매완료면 진입 불가로 만드는 함수 추가
    const checkState = useCallback(async()=>{
        const resp = await axios.get("/product/checkState/"+productNo);
        if(resp.data !== "판매중") navigate("/product/detail/"+productNo);
    },[productNo]);

    //거래방법(택배,직거래) 선택시마다 전체 결제금액, 배송비 정보 업데이트
    const updatePayInfo = useCallback((fee)=>{
      setDeliveryFee(fee);
      setTotal(product.productPrice + fee);
    },[product.productPrice]);

    // 상품정보 추출
    const loadProduct = useCallback(async()=>{
        const response = await axios.get("/product/detail/"+productNo);
        setProduct(response.data.productDto);
        // product.price 로 하면  새로고침시 undefined
        setTotal(response.data.productDto.productPrice);
    },[]);

    // 주소지 추출
    const loadMember = useCallback(async()=>{
        const resp = await axios.get("/member/detail/"+memberId);
        const data = resp.data;
        setMember(data);
    },[]);

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

    // 동의 약관 모달 
    const openModal1 = useCallback(()=>{
      const tag = Modal.getOrCreateInstance(modal1.current);
      tag.show();
    },[modal1]);

    const openModal2 = useCallback(()=>{
      const tag = Modal.getOrCreateInstance(modal2.current);
      tag.show();
    },[modal2]);

    const openModal3 = useCallback(()=>{
      const tag = Modal.getOrCreateInstance(modal3.current);
      tag.show();
    },[modal3]);
    
    const closeModal = useCallback((eachModal)=>{
      var tag = Modal.getInstance(eachModal.current);
      tag.hide();
     },[]);

    return (
        <>

          {/* 결제 약관 모달 1*/}
        <div className="modal fade" tabIndex="-1" ref={modal1} /*data-bs-backdrop="static"*/>
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">서비스 이용약관</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={() => closeModal(modal1)} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        <div className="row">
                                <p>

제1장 총칙

제1조 (목적)

본 약관은 Once Upon A Time 주식회사(이하 “회사”)가 웹사이트 및 애플리케이션을 통하여 제공하는 온라인 개인 간 거래 중개 및 기타 서비스(이하 “서비스”)의 이용과 관련하여 회사와 회원의 권리 및 의무, 기타 제반사항을 규정함을 목적으로 합니다.

제2조 (정의)

본 약관에서 사용하는 용어의 정의는 다음 각 호와 같습니다.

회원: 본 약관에 동의하고 회사와 서비스 이용계약을 체결하여 서비스를 이용하는 자를 말합니다.

판매자: 서비스에 판매할 물품을 등록하여 판매하거나 판매할 의사로 서비스를 이용하는 자를 말합니다.

구매자: 판매자가 판매하는 물품을 구매하거나 구매할 의사로 서비스를 이용하는 자를 말합니다.

일반상점: 서비스 가입 시 기본적으로 운영할 수 있는 상점 형태를 말합니다.

프로상점: 프로상점서비스 가입 시에만 운영할 수 있는 상점 형태를 말합니다.

안전결제 기능: 회사가 제휴한 전자결제대행업체 등 전자금융업자를 통하여 이루어지는 서비스 내 결제 및 정산 기능을 말합니다. 

제3조 (약관 등의 게시 및 효력 등)

회사는 본 약관의 내용을 회원이 쉽게 확인할 수 있도록 웹사이트 및 애플리케이션 화면에 게시합니다.

회사는 전자상거래 등에서의 소비자보호에 관한 법률(이하 “전자상거래법”), 약관의 규제에 관한 법률(이하 “약관법”), 전자문서 및 전자거래기본법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 “정보통신망법”), 소비자기본법 등 관련 법령을 위반하지 않는 범위 내에서 본 약관을 개정할 수 있습니다.

회사는 약관을 개정할 경우에 적용 일자, 개정 내용 및 개정 사유를 명시하여 그 적용일자로부터 최소한 7일 이전부터 서비스 내 전자게시판에 공지합니다. 다만, 개정 약관의 내용이 회원에게 불리한 경우에는 개정 약관 적용 일자 30일 전부터 공지합니다.

회사가 전항에 따라 개정 약관을 공지하면서 ‘회원에게 개정 약관 시행일전까지 회원이 거부 의사를 표시하지 아니할 경우 회원이 개정 약관에 동의한 것으로 본다는 뜻’을 고지하였음에도 회원이 명시적으로 거부 의사표시를 하지 아니한 경우 회원이 개정 약관에 동의한 것으로 봅니다.

회사는 제6조 제1항의 개별 서비스에 대해서 별도의 이용약관 및 관련 정책 등(이하 "개별 약관 등")을 수립할 수 있으며, 개별 서비스에 대한 내용이 본 약관과 상충할 경우에는 개별 약관 등이 우선하여 적용됩니다.

회사는 본 약관에 위배되지 않는 범위 내에서 서비스 운영을 위하여 필요한 세부 사항을 규정하는 서비스 운영정책을 수립하여 시행할 수 있습니다.

본 약관에 명시되지 않은 사항은 전자상거래법, 약관법, 전자상거래 등에서의 소비자보호지침 등 관련 법령 또는 상관례에 따릅니다. 

본 약관은 2024년 8월 1일부터 시행됩니다.

이전의 Once Upon A Time 서비스 이용약관은 아래에서 확인하실 수 있습니다.

                                </p>                 
                        </div>    
                    </div>

                </div>
            </div>
        </div>

        {/* 결제 약관 모달 2*/}
        <div className="modal fade" tabIndex="-1" ref={modal2} /*data-bs-backdrop="static"*/>
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">개인정보 수집 및 이용동의</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={() => closeModal(modal2)} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        <div className="row">
                        원활한 서비스 제공을 위해 이용자로부터 아래와 같이 회원의 개인정보를 수집, 이용합니다. 회원은 아래 내용에 대해 동의를 해야 구매를 진행할 수 있습니다.
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <td>목적</td>
                                      <td>항목</td>
                                      <td>보유기간</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                      주문, 결제 및 배송서비스, 해외직배송 상품 수입 신고 최초입력 후 불러오기 기능 제공
                                      </td>
                                      <td>
                                      이름, ID(이메일 등), 연락처(휴대폰번호), 배송지주소, 계좌정보(예금주, 은행명, 계좌번호) 현금영수증 신청 시 현금영수증 정보 (해당되는 경우), 개인통관고유부호(해당되는 경우)	
                                      </td>
                                      <td>
                                      업무 목적 달성 후 파기
                                      (관계법령의 규정에 따라 보존할 의무가 있으면 해당기간 동안 보존)
                                      </td>
                                    </tr>
                                  </tbody>                                
                                </table>      
                                - 입력하신 개인통관고유부호를 이용하여 관세청에서 수입신고, 목록신고 내용을 확인할 수 있습니다.
                                - 위 개인정보 동의를 거부할 권리가 있으나 동의하지 않을 경우 상품 및 서비스(배송 등)이용이 제한됩니다.
                        </div>    
                    </div>
                    
                </div>
            </div>
        </div>

        {/* 결제 약관 모달 3*/}
        <div className="modal fade" tabIndex="-1" ref={modal3} /*data-bs-backdrop="static"*/>
            <div className="modal-dialog">
                <div className="modal-content">

                    {/* 모달 헤더 - 제목, x버튼 */}
                    <div className="modal-header">
                        <p className="modal-title">개인정보 제3자 제공동의</p>
                        <button type="button" className="btn-close btn-manual-close" onClick={() => closeModal(modal3)} />
                    </div>

                    {/* 모달 본문 */}
                    <div className="modal-body">
                        <div className="row table-responsive">
                          <table className="table table-borderd">
                            <thead>
                              <tr>
                                <td className="col-2">제공받는 자</td>
                                <td>목적</td>
                                <td>항목</td>
                                <td>보유 및 이용기간</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>민아ㅋㅋ</td>
                                <td>판매자와 구매자의 거래의 원활한 진행, 본인 의사의 확인, 고객 상담 및 불만 처리, 상품과 경품 배송을 위한 배송지 확인</td>
                                <td>구매자 이름, 휴대폰번호, 상품 구매정보, 상품 수취인정보(이름, 주소, 전화번호)</td>
                                <td>동의철회 또는 회원탈퇴시</td>
                              </tr>
                            </tbody>
                          </table>              
                          본 동의는 Once Upon A Time 안전결제 서비스 이용을 위한 개인정보 제3자 제공 동의로서, 개인정보의 제3자 제공 동의를 거부할 수 있으나 동의를 거부하는 경우 안전결제 서비스 이용이 어려울 수 있습니다.
                        </div>    
                    </div>

                </div>
            </div>
        </div>

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

            
            {member.memberPost ? (<>
              <div className="card mb-3">
                  <button
                  className={`btn w-100 ${deliveryFee === 3000? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => updatePayInfo(3000)}>
                  <p className="mt-3 fs-6 fw-bold">일반택배</p>
                  <p>원하는 주소로 받기 (+3,000)</p>
                </button></div>
            </>):(<>
              <div className="card mb-3">
                  <button
                  className={"btn w-100 btn-outline-primary"} disabled={true}>
                  <p className="mt-3 fs-6 fw-bold">일반택배</p>
                  <p>주소를 먼저 등록해 주세요.</p>
                </button></div>
            </>)}

                <div className="card mb-3">
                <button
                className={`btn w-100 ${deliveryFee === 0 ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => updatePayInfo(0)}>
                  <p className="mt-3 fs-6 fw-bold">직거래</p>
                  <p>직접 만나서 받기</p>
                </button></div>
    
            <div className="card mb-3">
              <div className="card-body row">
                <div className="col text-muted mb-2">
                  배송지
                </div>
                <div className="col link-info 
                  text-decoration-underline text-end">
                  주소수정(구현예정)
                </div>
                {member.memberPost ?(<>
                  <p className="fs-5 mb-2">{member.memberName}</p>
                  <p className="fs-5">[{member.memberPost}] {member.memberAddress1} {member.memberAddress2}</p>
                </>):(<>
                  <p className="fs-5 my-2">
                    등록된 주소가 없습니다.
                  </p>
                </>)}
                  
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
                    <p className="col fs-5">{deliveryFee}</p>  
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
                <div className="form-check mb-4">
                  <input type="checkbox" className="form-check-input" checked={checkItem.checkAll}
                    onChange={e=>checkAll(e.target.checked)}/>
                  <label className="form-check-label fs-5">아래 내용에 전체 동의해요</label>
                </div>
    
                <div className="form-check d-flex">
                  <input type="checkbox" className="form-check-input"
                    checked={checkItem.checkItem1} name="checkItem1" onChange={changeCheckItem}/>
                  <label className="form-check-label ms-2">서비스 이용약관 동의 (필수)</label>
                  <p className="mx-2 link-info text-decoration-underline" onClick={openModal1}>자세히</p>
                </div>
    
                <div className="form-check d-flex">
                  <input type="checkbox" className="form-check-input"
                    checked={checkItem.checkItem2} name="checkItem2" onChange={changeCheckItem} />
                  <label className="form-check-label ms-2">개인정보 수집 및 이용동의 (필수)</label>
                  <p className="mx-2 link-info text-decoration-underline" onClick={openModal2}>자세히</p>
                </div>
    
                <div className="form-check d-flex">
                  <input type="checkbox" className="form-check-input" 
                    checked={checkItem.checkItem3} name="checkItem3" onChange={changeCheckItem}/>
                  <label className="form-check-label ms-2">개인정보 제3자 제공 동의 (필수)</label>
                  <p className="mx-2 link-info text-decoration-underline" onClick={openModal3}>자세히</p>
                </div>
              </div>
            </div>               
    
            <div className="card">
              {isCheckAll === false ? (<>
              <button className="btn btn-outline-primary fs-6 p-2" disabled={true}>
                결제 약관에 동의 바랍니다.
              </button>
              </>):(<>
              <button className="btn btn-primary fs-6 p-2" onClick={sendBuyRequest}>
                결제하기
              </button>
              </>)}
            </div>
          </div>
        </>
      );
    
};
export default Paystart;