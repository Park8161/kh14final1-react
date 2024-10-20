import { useCallback, useEffect, useRef, useState } from "react";
import Jumbotron from "../Jumbotron";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Collapse } from "bootstrap";

const MyPage = ()=>{
    // navigate
    const navigate = useNavigate();

    //state
    const [member, setMember] = useState({});
    const [collapse, setCollpase] = useState({
        product : false,
        sell : false,
        reserve : false,
        soldout : false,
        productButton : "btn w-100",
        sellButton : "btn w-100",
        reserveButton : "btn w-100",
        soldoutButton : "btn w-100",
    });
    const [likeList, setLikeList] = useState([]);
    
    //effect
    useEffect(()=>{
        loadMember();
        loadLikeList();
    }, []);
    
    //callback
    const loadMember = useCallback(async ()=>{
        const response = await axios.get("/member/mypage");
        setMember(response.data);
    }, [member]);

    const loadLikeList = useCallback(async()=>{
        const response = await axios.get("/member/active");
        setLikeList(response.data.likeList);
        console.log(response.data);
    },[likeList]);

    const clearCollapse = useCallback(()=>{
        setCollpase({
            product : false,
            sell : false,
            reserve : false,
            soldout : false,
            productButton : "btn w-100",
            sellButton : "btn w-100",
            reserveButton : "btn w-100",
            soldoutButton : "btn w-100",
        });
    },[collapse]);

    const changeCollapse = useCallback((e)=>{
        clearCollapse();
        setCollpase({
            ...collapse,
            [e.target.name] : true,
            [e.target.name+"Button"] : "btn w-100 border-dark"            
        });
    },[]); // 왜 연관항목이 없어야 되는거..?

    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return (<>
        <Jumbotron title={`${member.memberId} 님의 정보`}/>

        <div className="row mt-4">

            <div className="col-2 border-end">  
                <div className="row">
                    <h3>거래 정보</h3>
                    <div className="col ps-3">
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3" to="/">
                                    판매 내역
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3" to="/">
                                    구매 내역
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <button className="btn me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" onClick={loadLikeList}>
                                    찜한 상품
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row mt-4">
                    <div className="col">
                        <h3>내 정보</h3>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3" to="/member/changepw">
                                    비밀번호 변경
                                </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3" to="/member/edit">
                                개인정보 수정
                            </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn me-3" to="/member/block/list">
                                차단 목록
                            </NavLink>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <NavLink className="btn" to="/member/exit">
                                탈퇴하기
                            </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-9 offset-1">
                <button className="btn btn-outline-info" type="button" data-bs-toggle="collapse" data-bs-target="#myInfo">
                    내 정보 확인
                </button>
                <div className="collapse" id="myInfo">
                    <div className="row mt-4">
                        <div className="col-3">이름</div>
                        <div className="col-3">{member.memberName}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">이메일</div>
                        <div className="col-3">{member.memberEmail}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">회원등급</div>
                        <div className="col-3">{member.memberLevel}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">주소</div>
                        <div className="col-3">
                            [{member.memberPost}] <br/>
                            {member.memberAddress1} <br/>
                            {member.memberAddress2} <br/>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">전화번호</div>
                        <div className="col-3">{member.memberContact}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">생년월일</div>
                        <div className="col-3">{member.memberBirth}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">포인트</div>
                        <div className="col-3">{member.memberPoint}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">가입일</div>
                        <div className="col-3">{member.memberJoin}</div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-3">최근접속</div>
                        <div className="col-3">{member.memberLogin}</div>
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

                {collapse.product === true && (
                <div className="row mt-4">
                    <div className="col text-center">
                        내 상품
                    </div>
                </div>
                )}
                {collapse.sell === true && (
                <div className="row mt-4">
                    <div className="col text-center">
                        판매중
                    </div>
                </div>
                )}
                {collapse.reserve === true && (
                <div className="row mt-4">
                    <div className="col text-center">
                        예약중
                    </div>
                </div>
                )}
                {collapse.soldout === true && (
                <div className="row mt-4">
                    <div className="col text-center">
                        판매완료
                    </div>
                </div>
                )}
                
            </div>
        </div>
        
        {/* 사이드 화면에서 메뉴 튀어나오게 하기 */}
        {/* 찜한 상품 */}
        <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">내 관심</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {likeList.map((product)=>(
                <div className="row" key={product.productNo}>
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
                                {" "+product.productQty}개
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {product.productState}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-end me-3">
                                <button className="btn btn-link" onClick={e=>navigate("/product/detail/"+product.productNo)}
                                 data-bs-dismiss="offcanvas" aria-label="Close">
                                    자세히
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>

    </>);
};

export default MyPage;