import axios from "axios";
import Jumbotron from "../Jumbotron";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductInsert = ()=>{
    // navigate
    const navigate = useNavigate();

    ///state
    const [input, setInput] = useState({
        productName:"",
        productCategory: "",
        productPrice: 0,
        productDetail:"",
        productQty:0,
        attachList:[]
    });
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState([]);
    const [group1, setGroup1] = useState();
    const [group2, setGroup2] = useState();
    const [group3, setGroup3] = useState();
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState(true);

    //effect
    useEffect(()=>{
        loadCategory();
    },[]);

    //파일 선택 Ref
    const inputFileRef = useRef(null);

    //callback
    const changeInput = useCallback(e=>{
        if (e.target.type === "file") {
            const files = Array.from(e.target.files);
            setInput({
                ...input,
                attachList : files
            });
            // 이미지 미리보기
            const imageUrls = files.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result); // 파일 읽기가 끝난 후 URL을 불러오기
                    };
                });
            });    
            Promise.all(imageUrls).then(urls => {
                setImages(urls); // 모든 이미지 URL을 상태에 저장
            });
        }
        else{
            setInput({
                ...input,
                [e.target.name] : e.target.value
            });
        }
    },[input]);

    ///파일 데이터를 비동기로 보내기
    const productInsert = useCallback(async() =>{
        try{
            //객체 생성, multipart/form-data 형식으로 전송해줌
            const formData = new FormData();
        
            const fileList = inputFileRef.current.files;

            for(let i =0; i < fileList.length; i++) {
                formData.append("attachList", fileList[i]);
            }
            
            //formData에 추가
            formData.append("productName", input.productName);
            formData.append("productCategory", input.productCategory);
            formData.append("productPrice", input.productPrice);
            formData.append("productDetail", input.productDetail);
            formData.append("productQty", input.productQty);

            await axios.post("/product/insert", formData,{
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            inputFileRef.current.value = ""
            navigate("/product/list");
            toast.success("상품 등록 완료");
        }
        catch(e){
            toast.error("상품 등록 실패");
        }
    });  

    // 카테고리 리스트 가져오기
    const loadCategory = useCallback(async()=>{
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);
    },[category]);

    // 카테고리 경로 보여주기
    const loadRoot = useMemo(()=>{
        const name = {
            group1Name : category.filter(category => category.categoryNo === group1)[0]?.categoryName || "",
            group2Name : category.filter(category => category.categoryNo === group2)[0]?.categoryName || "",
            group3Name : category.filter(category => category.categoryNo === group3)[0]?.categoryName || ""
        }
        setCategoryName(name.group3Name);
        setInput({
            ...input,
            productCategory : group3
        });
        return name;
    },[category,group1,group2,group3]);

    // 카테고리 찾아주기
    const findCategory = useCallback(()=>{
        const findCat = category.filter(category => category.categoryName === categoryName)[0] || "";
        if(findCat === "" && categoryName.length > 0 ) {
            setInput({
                ...input,
                productCategory : ""
            });
            return;
        }
        setInput({
            ...input,
            productCategory : findCat.categoryNo
        });
        setGroup3(findCat.categoryNo);
        setGroup2(findCat.categoryUpper);
        setGroup1(findCat.categoryGroup);
    },[input,categoryName]);

////////////////////////////////////////////////////////////////////////////
    // 형식검사

    // state
    const [productNameValid, setProductNameValid] = useState(false);
    const [productFileValid, setProductFileValid] = useState(false);
    const [productCategoryValid, setProductCategoryValid] = useState(false);
    const [productPriceValid, setProductPriceValid] = useState(false);
    const [productDetailValid, setProductDetailValid] = useState(false);
    const [productQtyValid, setProductQtyValid] = useState(false);
    const [productNameClass, setProductNameClass] = useState("");
    const [productFileClass, setProductFileClass] = useState("");
    const [productCategoryClass, setProductCategoryClass] = useState("");
    const [productPriceClass, setProductPriceClass] = useState("");
    const [productDetailClass, setProductDetailClass] = useState("");
    const [productQtyClass, setProductQtyClass] = useState("");

    // callback
    const checkProductName = useCallback(()=>{
        const regex = /^.{1,30}$/;
        const valid = regex.test(input.productName);
        setProductNameValid(valid);
        if(input.productName.length === 0) setProductNameClass("");
        else setProductNameClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkProductFile = useCallback(()=>{
        const valid = input.attachList.length > 0 ;
        setProductFileValid(valid);
        if(input.attachList.length === 0) setProductFileClass("");
        else setProductFileClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkProductCategory = useMemo(()=>{
        // findCategory 참조
        const findCat = category.filter(category => category.categoryName === categoryName)[0] || "";
        const valid = findCat !== "";
        setProductCategoryValid(valid);
        if(categoryName.length === 0) setProductCategoryClass("");
        else setProductCategoryClass(valid ? "is-valid" : "is-invalid");
    },[input,categoryName]);
    const checkProductPrice = useCallback(()=>{
        const regex = /^[0-9]{0,8}$/;
        const valid = regex.test(input.productPrice) && input.productPrice > 0;
        setProductPriceValid(valid);
        if(input.productPrice === 0) setProductPriceClass("");
        else setProductPriceClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkProductDetail = useCallback(()=>{
        const regex = /^.{1,1000}$/;
        const valid = regex.test(input.productDetail);
        setProductDetailValid(valid);
        if(input.productDetail.length === 0) setProductDetailClass("");
        else setProductDetailClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkProductQty = useCallback(()=>{
        const regex = /^[0-9]{0,9}[1-5]$/;
        const valid = regex.test(input.productQty) && input.productQty > 0;
        setProductQtyValid(valid);
        if(input.productQty === 0 ) setProductQtyClass("");
        else setProductQtyClass(valid ? "is-valid" : "is-invalid");
    },[input]);

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = productNameValid && productFileValid && productCategoryValid
                        && productPriceValid && productDetailValid && productQtyValid ;
        return passCheck;
    },[productNameValid,productFileValid,productCategoryValid,productPriceValid,productDetailValid,productQtyValid]);

    // view
    return(
        <>
            {/* <Jumbotron title="상품 등록 테스트"/> */}

            <div className="row mt-4">
                <div className="col">
                    <div className="row mt-4">
                        <div className="col">
                            <label>상품명</label>
                            <input type="text" name="productName" value={input.productName} placeholder="중고나라장난감"
                                className={"form-control "+productNameClass} onChange={changeInput} onBlur={checkProductName} onFocus={checkProductName}/>
                            <div className="valid-feedback">올바른 입력입니다</div>
                            <div className="invalid-feedback">영문 대소문자, 숫자, 한글(자음 모음 불가) 100자 제한</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label className="form-label">파일</label>
                            {/*  multiple accept -> 어떤 형식 받을건가*/}
                            <input type="file" className={"form-control "+productFileClass} name="attachList" multiple accept="image/*" ref={inputFileRef} 
                                    onChange={changeInput} onBlur={checkProductFile} onFocus={checkProductFile}/>
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                            ))}
                            <div className="valid-feedback">올바른 입력입니다</div>
                            <div className="invalid-feedback">상품 이미지 업로드 필수</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                카테고리
                            </label>
                            <div className="input-group">
                                <input type="text" className={"form-control "+productCategoryClass} value={categoryName} onChange={e=>setCategoryName(e.target.value)} onBlur={findCategory} onFocus={findCategory}/>
                                <input type="hidden" name="productCategory" value={categoryName.length > 0 ? (input.productCategory):(input.productCategory === "")} className={"form-control "+productCategoryClass} onChange={changeInput} readOnly/>
                                <div className="valid-feedback">올바른 입력입니다</div>
                                <div className="invalid-feedback">카테고리 선택 필수 혹은 없는 카테고리 번호</div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col">
                            {loadRoot.group1Name} {loadRoot.group1Name.length > 0 && (<FaChevronRight/>)}
                            {loadRoot.group2Name} {loadRoot.group2Name.length > 0 && (<FaChevronRight/>)}
                            {loadRoot.group3Name}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                            {category.filter(category => category.categoryDepth === 1).map((cat)=>(
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action "+(group1 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e=>(setGroup1(parseInt(e.target.value)),setGroup2(0))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                            ))}
                        </div>
                        <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                            {category.filter(category => (category.categoryDepth === 2 && category.categoryGroup === group1)).map((cat)=>(
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action "+(group2 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e=>(setGroup2(parseInt(e.target.value)),setGroup3(0))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                            ))}
                        </div>
                        <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                            {category.filter(category => (category.categoryDepth === 3 && category.categoryGroup === group1 && category.categoryUpper === group2)).map((cat)=>(
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action "+(group3 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e=>(setGroup3(parseInt(e.target.value)))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                            ))}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>판매가(원)</label>
                            <input type="number" name="productPrice" value={input.productPrice}
                                className={"form-control "+productPriceClass} onChange={changeInput} onBlur={checkProductPrice} onFocus={checkProductPrice}/>
                            <div className="valid-feedback">올바른 입력입니다</div>
                            <div className="invalid-feedback">숫자 1~9999999999 이내 가능</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>상품설명</label>
                            <textarea type="text" name="productDetail" value={input.productDetail}
                                className={"form-control "+productDetailClass} onChange={changeInput} onBlur={checkProductDetail} onFocus={checkProductDetail}/>
                            <div className="valid-feedback">올바른 입력입니다</div>
                            <div className="invalid-feedback">글자수 1~1000자 제한</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>수량(개)</label>
                            <input type="number" name="productQty" value={input.productQty}
                                className={"form-control "+productQtyClass} onChange={changeInput} onBlur={checkProductQty} onFocus={checkProductQty}/>
                            <div className="valid-feedback">올바른 입력입니다</div>
                            <div className="invalid-feedback">숫자 1~9999999999 이내 가능</div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col text-end">
                            <button type="button" className="btn btn-danger me-3" onClick={e=>navigate(-1)}>
                                돌아가기
                            </button>
                            <button className="btn btn-success" onClick={productInsert} disabled={isAllValid === false}>
                                상품등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

};
export default ProductInsert;