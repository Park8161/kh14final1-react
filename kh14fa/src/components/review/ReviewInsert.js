// import
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Jumbotron from './../Jumbotron';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChevronRight } from "react-icons/fa";

const ReviewInsert = ()=>{
    // navigate
    const navigate = useNavigate();
    
    // param
    const {productNo} = useParams();

    // state
    const [input, setInput] = useState({
        reviewTarget : "",
        reviewProduct : "",
        reviewContent : "",
        reviewScore : ""
    });
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
    },[input]);

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
    

    // GPT 이용해서 만든 숫자에 콤마 찍기 함수
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };    

    // view
    return (
        <>
            <Jumbotron title="리뷰달기" />

            <div className="row mt-4">
                <div className="col border">
                    <h2 className="mt-3">구매 상품 정보</h2>

                    <div className="row">
                        <label className="ps-4">상품 이미지</label>
                        {images.map((image,index)=>(
                        <div className="col-2" key={index}>
                            <div className="form-control" name="review">
                                <img src={process.env.REACT_APP_BASE_URL+"/attach/download/"+image} className="d-block w-100" />
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="row mt-1 mb-4 text-center">
                        <div className="col-2">
                            <label>품명</label>
                            <div className="form-control text-truncate" name="review">{product.productName}</div>
                        </div>
                        <div className="col-1">
                            <label>가격</label>
                            <div className="form-control text-truncate" name="review">{formatCurrency(product.productPrice)}원</div>
                        </div>
                        <div className="col-1">
                            <label>수량</label>
                            <div className="form-control text-truncate" name="review">{formatCurrency(product.productQty)}개</div>
                        </div>
                        <div className="col-1">
                            <label>거래상태</label>
                            <div className="form-control text-truncate" name="review">{product.productState}</div>
                        </div>
                        <div className="col-3">
                            <label>카테고리</label>
                            <div className="form-control text-truncate d-flex justify-content-start align-items-center" name="review">
                                {category.category1st} <FaChevronRight/>
                                {category.category2nd} <FaChevronRight/>
                                {category.category3rd} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <h2>거래 후기</h2> 
                    <textarea></textarea>
                </div>
            </div>
            

        </>
    );
};

export default ReviewInsert;