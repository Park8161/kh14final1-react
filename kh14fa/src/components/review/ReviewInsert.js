// import
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Jumbotron from './../Jumbotron';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronRight } from "react-icons/fa";
import { useRecoilValue } from 'recoil';
import { memberIdState } from "../../utils/recoil";
import { FaRegThumbsUp,FaRegThumbsDown,FaRegHandshake } from "react-icons/fa";

const ReviewInsert = ()=>{
    // navigate
    const navigate = useNavigate();

    // recoil
    const memberId = useRecoilValue(memberIdState);
    
    // param
    const {productNo} = useParams();

    // state
    const [input, setInput] = useState({
        reviewContent : "",
        reviewScore : 0
    });
    const [reviewscore, setReviewscore] = useState(0);
    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState({});

    // effect
    useEffect(()=>{
        loadProduct();
    },[]);
    
    // callback
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input,reviewscore]);

    const loadProduct = useCallback(async()=>{
        try{
            const response = await axios.get("/product/detail/"+productNo);
                // console.log(response.data);
                setProduct(response.data.productDto);
                setImages(response.data.images);
                setCategory(response.data.categoryNameVO);
        }
        catch(e){
            navigate("/");
            toast.error("상품 번호 오류");
        }
    },[product]);

    const insertReview = useCallback(async()=>{
        if(input.reviewContent.length === 0) {
            toast.error("내용을 작성해주세요");
            return;
        }
        else if(input.reviewContent.length > 100) {
            toast.error("100자 글자 제한");
            return;
        }
        setInput({
            ...input,
            reviewScore : reviewscore
        });
        await axios.post("/review/insert/"+productNo, input);
        toast.success("작성 완료");
        navigate(); // 결제내역으로 이동 : 주소 나중에 추가
        const memberReliability = (await axios.get("/member/mypage")).data.memberReliability;
        await axios.patch("/member/patch", {memberReliability : memberReliability+reviewscore});
    },[input,reviewscore]);
    
    // 리뷰 아이콘 누르면 점수가 state로 전송되게 하기
    const changeRS = useMemo(()=>{
        setInput({
            ...input,
            reviewScore : reviewscore
        });
    },[reviewscore]);
    
    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };    

    // view
    return (
        <>
            {/* <Jumbotron title="리뷰달기" /> */}

            {/* 상품 정보 표기 */}
            <div className="row mt-4">
                <div className="col border">
                    <h5 className="mt-3">구매 완료한 상품 정보</h5>

                    <div className="row">
                        <label className="ps-4">상품 이미지</label>
                        {images.map((image,index)=>(
                        <div className="col-2" key={index}>
                            <div className="form-control">
                                <img src={process.env.REACT_APP_BASE_URL+"/attach/download/"+image} className="d-block w-100" />
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="row mt-1 mb-4 text-center">
                        <div className="col-2 w-auto">
                            <label>품명</label>
                            <div className="form-control text-truncate">{product.productName}</div>
                        </div>
                        <div className="col-1 w-auto">
                            <label>가격</label>
                            <div className="form-control text-truncate">{formatCurrency(product.productPrice)}원</div>
                        </div>
                        <div className="col-1 w-auto">
                            <label>수량</label>
                            <div className="form-control text-truncate">{formatCurrency(product.productQty)}개</div>
                        </div>
                        <div className="col-1 w-auto">
                            <label>거래상태</label>
                            <div className="form-control text-truncate">{product.productState}</div>
                        </div>
                        <div className="col-2 w-auto">
                            <label>카테고리</label>
                            <div className="form-control text-truncate d-flex justify-content-start align-items-center">
                                {category.category1st} <FaChevronRight/>
                                {category.category2nd} <FaChevronRight/>
                                {category.category3rd} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 거래 후기 작성 */}
            <div className="row mt-4">
                <div className="col border">
                    <h5 className="mt-3 mb-0">{memberId}님,</h5>
                    <h5 className="mt-0">{product.productMember}님과 거래는 어떠셨나요?</h5>
                    <small className="text-muted">거래 선호도는 나만 볼 수 있어요</small>
                    <div className="row mt-3 ms-3 text-center">
                        <div className={"col-2 pt-3 "+(reviewscore === 1 && "border")} name="reviewScore" value={1} onClick={e=>setReviewscore(1)}>
                            <FaRegThumbsUp className="d-block w-100"/>
                            <p className="mt-2">최고에요!</p>
                        </div>
                        <div className={"col-2 pt-3 "+(reviewscore === 0 && "border")} name="reviewScore" value={0} onClick={e=>setReviewscore(0)}>
                            <FaRegHandshake className="d-block w-100"/>
                            <p className="mt-2">좋아요!</p>
                        </div>
                        <div className={"col-2 pt-3 "+(reviewscore === -1 && "border")} name="reviewScore" value={-1} onClick={e=>setReviewscore(-1)}>
                            <FaRegThumbsDown className="d-block w-100"/>
                            <p className="mt-2">별로에요</p>
                        </div>
                        {/* <div>{reviewscore}</div> */}
                    </div>

                    <div className="row mt-1">
                        <div className="col">
                            <h5 className="mt-3 mb-0">따뜻한 거래 경험을 알려주세요!</h5>
                            <small className="text-muted">남겨주신 거래 후기는 상대방의 프로필에 공개돼요</small>
                            <textarea className="form-control mt-2" style={{height:"100px",resize:"none"}} placeholder="여기에 적어주세요(100자 제한)"
                                    name="reviewContent" value={input.reviewContent} onInput={changeInput}></textarea>
                        </div>
                        <span className="text-end">{input.reviewContent.length}/100</span>
                    </div>

                    <div className="row mt-4 mb-4 ">
                        <div className="col text-end">
                            <button className="btn btn-danger me-2" onClick={e=>navigate("/member/mypage")}>돌아가기</button>
                            <button className="btn btn-success me-2" onClick={insertReview}>작성하기</button>
                        </div>
                    </div>
                </div>
            </div>
            

        </>
    );
};

export default ReviewInsert;