import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";
import { Carousel } from "bootstrap";
import { FaArrowRotateLeft } from "react-icons/fa6";

const ProductEdit = () => {
    // navigate
    const navigate = useNavigate();

    const { productNo } = useParams();

    //detail에서 불러온 값을 담을 state
    const [input, setInput] = useState({
        product: {
            productNo: "",
            productName: "",
            productCategory: "",
            productPrice: 0,
            productDetail: "",
            productQty: 0,
            productState: "",
            attachList: [],
        },
        images: [],
    });


    //파일 선택 Ref
    const inputFileRef = useRef(null);


    //const [attachDeleteList, setAttachDeleteList] = useState([]);//구현 안된기능 state 삭제된 추가첨부사진이미지
    //const [attachImageValue, setAttachImageValue] = useState([]);//구현 안된기능 state  선택된파일에 담겨있는 값
    
    const [attachImages, setAttachImages] = useState([]);//보낼 추가첨부사진이미지
    const [updateFileList, setUpdateFileList] = useState([]);

    const [loadImages, setLoadImages] = useState([]);
    //카테고리
    const [category, setCategory] = useState([]);
    const [group1, setGroup1] = useState();
    const [group2, setGroup2] = useState();
    const [group3, setGroup3] = useState();
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [deleteList, setDeleteList] = useState([]);

    //effect
    useEffect(() => {
        loadGetProduct();
        loadCategory(); //카테고리 선택창 갖고옴
    }, []);

    //callback
    const targetChange = useCallback(e => {
        if (e.target.type === "file") {
            const files = Array.from(e.target.files);
            setInput(prevInput => ({
                ...prevInput,
                attachList: files
            }));
            //setAttachImageValue(files);
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
                console.log("Image URLs:", urls);
                setAttachImages(urls); // 모든 이미지 URL을 상태에 저장
            });
        }
        else {
            setInput(prevInput => ({
                ...prevInput,
                product: {
                    ...prevInput.product,
                    [e.target.name]: e.target.value
                }
            }));
        }
    }, []);

    //특정 상품 정보 가져오기-prev 안쓰면 파일 선택시 값들 초괴화됨
    const loadGetProduct = useCallback(async () => {
        const resp = await axios.get(`/product/detail/${productNo}`);
        console.log("API 응답:", resp.data);

        setInput(prevInput => ({
            ...prevInput,
            product: {
                ...prevInput.product,
                ...resp.data.productDto, // 상품 정보를 가져와서 병합
            },
            // setLoadImages(resp.data.images);
            images: resp.data.images,
            // images: resp.data.images.map(image => `${process.env.REACT_APP_BASE_URL}/attach/download/${image}`),
            categoryName: resp.data.categoryNameVO.category3rd

        }));

        setLoadImages(resp.data.images);

        //카테고리 정보저장
        // 이전 카테고리 상태 업데이트
        setCategoryName(categoryName);
        setCategory([resp.data.categoryNameVO]); // 객체를 설정
        setGroup3(resp.data.productDto.productCategory);
    }, [input]);

    //수정 axios -> 선택된 파일이 가짐
    const saveProduct = useCallback(async () => {
        const formData = new FormData();
        console.log("전송할 파일 목록:", updateFileList); // 상태 확인
        const fileList = inputFileRef.current.files;
        
        for (let i = 0; i < fileList.length; i++) {
            formData.append("attachList", fileList[i]);
        }

        //구현 안된기능
        // const fileList = attachImageValue;
        // updateFileList.forEach(file => {
        //     formData.append("attachList", file); // FormData에 추가
        // });
        // input에서 직접 값 가져오기

        formData.append("productName", input.product.productName);
        formData.append("productCategory", input.product.productCategory);
        formData.append("productPrice", input.product.productPrice);
        formData.append("productDetail", input.product.productDetail);
        formData.append("productQty", input.product.productQty);
        formData.append("productState", input.product.productState);
        formData.append("productNo", productNo);
        formData.append("originList", loadImages);

        console.log(input, loadImages);

        await axios.post("/product/edit", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        navigate("/product/list");
        toast.success("상품 수정완료");
    }, [input, loadImages, updateFileList]);


    //카테고리 리스트 가져오기
    const loadCategory = useCallback(async () => {
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);
    }, []);

    // 카테고리 경로 보여주기
    const loadRoot = useMemo(() => {
        const name = {
            group1Name: category.filter(category => category.categoryNo === group1)[0]?.categoryName || "",
            group2Name: category.filter(category => category.categoryNo === group2)[0]?.categoryName || "",
            group3Name: category.filter(category => category.categoryNo === group3)[0]?.categoryName || ""
        }
        setCategoryName(name.group3Name);
        setInput(prevInput => ({
            ...prevInput,
            product: {
                ...prevInput.product,
                productCategory: group3
            }
        }));
        return name;
    }, [category, group1, group2, group3]);

    // 카테고리 찾아주기
    const findCategory = useCallback(() => {
        const findCat = category.filter(category => category.categoryName === categoryName)[0] || "";
        if (findCat === "" && categoryName.length > 0) {
            setMessage("없는 카테고리 번호");
            setInput(prevInput => ({
                ...prevInput,
                product: {
                    ...prevInput.product,
                    productCategory: ""

                }
            }));
            return;
        }
        setInput(prevInput => ({
            ...prevInput,
            product: {
                ...prevInput.product,
                productCategory: findCat.categoryNo
            }
        }));
        setGroup3(findCat.categoryNo);
        setGroup2(findCat.categoryUpper);
        setGroup1(findCat.categoryGroup);
        setMessage("");
    }, [input, categoryName, message, category]);

    const deleteImage = useCallback((target) => {
        setDeleteList(target);
        setLoadImages(image => image.filter(image => image !== target));
    }, [deleteList, loadImages]);

    // //attachList이미지 삭제
     const deleteAttachImage = useCallback((target)=>{
        // 이미지 미리보기에서 삭제
        setAttachImages(prevImages => prevImages.filter(image => image !== target));
    
    //     // 선택된 파일에서 삭제
    //     setAttachImageValue(prevFiles => {
    //         const updatedFiles = prevFiles.filter(file => file.name !== target.name);
    //         console.log("업데이트된 파일:", updatedFiles); // 상태 확인
    //         setUpdateFileList(updatedFiles); // 선택된 파일 목록 업데이트
        
    //     // input 파일 값 초기화
    //     inputFileRef.current.value = ""; // 선택된 파일을 해제   
    //     return updatedFiles;
    //     });
    }, []);


    return (<>
        {/* <Jumbotron title="상품 등록 테스트"/> */}

        <div className="row mt-4">
            <div className="col">
                <div className="row mt-4">
                    <div className="col">
                        <label>상품명</label>
                        <input type="text" name="productName" value={input.product.productName}
                            className="form-control" onChange={targetChange} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>기존 이미지 파일     
                            <button  className="btn btn-secondary ms-2"onClick={e => setLoadImages(input.images)}>되돌리기</button> 
                        </label> 
                    </div>
                </div>
                {/*
                <div className="row mt-4">
                    <div className="col"> */}
                        {/*  multiple accept -> 어떤 형식 받을건가*/}
                        {/* {loadImages.map((image, index) => (
                            <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${image}`}
                                    alt={`미리보기 ${index + 1}`}
                                    style={{ maxWidth: '100px', margin: '5px', display: "block" }} />
                                <MdCancel style={{ position: "absolute", top: "10px", right: "10px", color:"red"}}
                                                size={20} onClick={e => deleteImage(image)}/>
                            </div>
                        ))}
                    </div>
                </div> */}
                <div className="row mt-4">
                    <div className="col">
                        <label className="form-label">파일</label>

                        <input type="file" className="form-control" name="attachList" multiple accept="image/*"
                            onChange={targetChange} ref={inputFileRef} />

                        {attachImages.map((image, index) => (
                             <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                <img src={image} alt={`미리보기 ${index + 1}`} style={{ maxWidth: '100px', margin: '5px', display: "block"  }} />
                                <MdCancel style={{ position: "absolute", top: "10px", right: "10px", color:"red"}}
                                                size={20} onClick={() => deleteAttachImage(image)}/>
                            </div>
                        ))}
                          {/*  multiple accept -> 어떤 형식 받을건가*/}
                          {loadImages.map((image, index) => (
                            <div key={index} style={{ position: "relative", display: "inline-block" }}>
                                <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${image}`}
                                    alt={`미리보기 ${index + 1}`}
                                    style={{ maxWidth: '100px', margin: '5px', display: "block" }} />
                                <MdCancel style={{ position: "absolute", top: "10px", right: "10px", color:"red"}}
                                                size={20} onClick={() => deleteImage(image)}/>
                            </div>
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
                            <input type="text" className="form-control" value={categoryName} onChange={e => setCategoryName(e.target.value)} onBlur={findCategory} />
                            {/* 원래 0으로 계산인데 값이 문자라 문자열 계산으로 바꿈 */}
                            <input type="number" name="productCategory" value={input.product.productCategory || ""} className="form-control" onChange={targetChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col">
                        {loadRoot.group1Name} {loadRoot.group1Name.length > 0 && (<FaChevronRight />)}
                        {loadRoot.group2Name} {loadRoot.group2Name.length > 0 && (<FaChevronRight />)}
                        {loadRoot.group3Name}
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {category.filter(category => category.categoryDepth === 1).map((cat) => (
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action " + (group1 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e => (setGroup1(parseInt(e.target.value)), setGroup2(0))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                        ))}
                    </div>
                    <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {category.filter(category => (category.categoryDepth === 2 && category.categoryGroup === group1)).map((cat) => (
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action " + (group2 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e => (setGroup2(parseInt(e.target.value)), setGroup3(0))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                        ))}
                    </div>
                    <div className="col-3" style={{ overflowY: "auto", maxHeight: "300px" }}>
                        {category.filter(category => (category.categoryDepth === 3 && category.categoryGroup === group1 && category.categoryUpper === group2)).map((cat) => (
                            <ul className="list-group" key={cat.categoryNo}>
                                <li className={"list-group-item list-group-item-action " + (group3 === cat.categoryNo && "bg-secondary text-light")}
                                    onClick={e => (setGroup3(parseInt(e.target.value)))} value={cat.categoryNo}>
                                    {cat.categoryName}
                                </li>
                            </ul>
                        ))}
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>가격</label>
                        <input type="number" name="productPrice" value={input.product.productPrice}
                            className="form-control" onChange={targetChange} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>상품상세</label>
                        <textarea type="text" name="productDetail" value={input.product.productDetail}
                            className="form-control" onChange={targetChange} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col">
                        <label>수량</label>
                        <input type="number" name="productQty" value={input.product.productQty}
                            className="form-control" onChange={targetChange} />
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col text-end">
                        <button type="button" className="btn btn-danger me-3" onClick={e => (navigate)}>
                            돌아가기
                        </button>
                        <button className="btn btn-success" onClick={saveProduct}>
                            상품수정
                        </button>
                    </div>
                </div>
            </div>
        </div>


    </>)
}
export default ProductEdit;