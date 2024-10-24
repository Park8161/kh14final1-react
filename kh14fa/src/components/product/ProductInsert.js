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
    const [message, setMessage] = useState("");

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

    //파일 데이터를 비동기로 보내기
    // const blob = new Blob([JSON.stringify(input)], {type: "application/json"});
    // formData.append("data",blob);

    ///파일 데이터를 비동기로 보내기
    const productInsert = useCallback(async() =>{
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
        if(findCat === "" && categoryName.length > 0) {
            setMessage("없는 카테고리 번호");
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
        setMessage("");
    },[input,categoryName,message]);

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
                                className="form-control" onChange={changeInput}/>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label className="form-label">파일</label>
                            {/*  multiple accept -> 어떤 형식 받을건가*/}
                            <input type="file" className="form-control" name="attachList" multiple accept="image/*" onChange={changeInput} ref={inputFileRef}/>
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px' }} />
                            ))}                             
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                카테고리
                                <span className="text-danger ms-1">{message}</span>
                            </label>
                            <div className="input-group">
                                <input type="text" className="form-control" value={categoryName} onChange={e=>setCategoryName(e.target.value)} onBlur={findCategory} />
                                <input type="number" name="productCategory" value={categoryName.length > 0 && input.productCategory} className="form-control" onChange={changeInput} />
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
                            <label>가격</label>
                            <input type="number" name="productPrice" value={input.productPrice}
                                className="form-control" onChange={changeInput}/>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>상품상세</label>
                            <textarea type="text" name="productDetail" value={input.productDetail}
                                className="form-control" onChange={changeInput}/>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>수량</label>
                            <input type="number" name="productQty" value={input.productQty}
                                className="form-control" onChange={changeInput} />
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col text-end">
                            <button type="button" className="btn btn-danger me-3" onClick={e=>(navigate)}>
                                돌아가기
                            </button>
                            <button className="btn btn-success" onClick={productInsert}>
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