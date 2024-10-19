import axios from "axios";
import Jumbotron from "../Jumbotron";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { Modal } from "bootstrap";

const ProductInsert = ()=>{
        <Jumbotron title="파일 업로드 테스트"/>

    ///state
    const [input, setInput] = useState({
        productName:"",
        productCategory: 0,
        productPrice: 0,
        productDetail:"",
        productQty:0,
        attachList:[]
    });
    const [productList, setProductList] = useState([]);
    ///임시 state 
    const [temp, setTemp] = useState({});

    ///수정
    
    
    //effect
    useEffect(()=>{
        loadListProduct();
    },[]);

    ///목록
    const loadListProduct = useCallback(async()=>{
        const resp = await axios.post("/product/list", temp)
        setProductList(resp.data.productList);
        console.log(resp.data.productList);
    },[temp]);

    //파일 선택 Ref
    const inputFileRef = useRef(null);

    //callback
    const changeInput = useCallback(e=>{
        if (e.target.type === "file") {
            const fileArray = Array.from(e.target.files);
            setInput({
                ...input,
                attachList : fileArray
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
        console.log("FormData 내용:", [...formData]);

        await axios.post("/product/insert", formData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          inputFileRef.current.value = ""
          closeModal();
          loadListProduct();
    });  
  
    ///모달처리
    const modal = useRef();
    
    //모달-memo
    const createMode = useMemo(()=>{
        return input?.bookId === "";
    }, [input]);

    const openModal = useCallback(()=>{
        const tag = Modal.getOrCreateInstance(modal.current)
        tag.show();
    },[modal]);

    const closeModal = useCallback (()=>{
        const tag = Modal.getInstance(modal.current)
        tag.hide();
        clearInput();
    },[modal]);

    const clearInput = useCallback(()=>{
        setInput({
            ...input,
            productName: "",
            productPrice: 0,
            productDetail: "",
            productCategory: 0,
            attachList: []
        })
    },[input]);
    //수정-저장
    const saveProduct = useCallback(async()=>{
        const copy = {...input}; //input을 복사
        delete copy.bookId;
        await axios.post("/product/insert", input);
        loadListProduct();
        closeModal();
    },[input])

    return(<>
        <Jumbotron title="상품 등록 테스트"/>

        <button type="button" className="btn btn-success"
                onClick={openModal}>
                    상품등록
                </button>

        <div className="row mt-4">
            <div className="col table-responsive">
                <table className="table text-nowrap">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>이미지</th>
                            <th>카테고리</th>
                            <th>가격</th>
                            <th>상품상세</th>
                            <th>수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productList.map((product)=>(
                            <tr key={product.productNo}>
                                <td>{product.productName}</td>  
                                <td>
                                        <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}/>
                                </td>
                                <td>{product.productCategory}</td>    
                                <td>{product.productPrice}</td>    
                                <td>{product.productDetail}</td>    
                                <td>{product.productQty}</td>    
                                {/* <td>
                                    <button className="btn btn-success">
                                        수정하기
                                    </button>
                                    <button className="btn btn-danger">
                                        삭제하기
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>

        {/* 모달 */}
        <div className="modal fade" tabIndex="-1" id="modal02"
                        ref={modal}   data-bs-backdrop="static">
        <div className="modal-dialog">
            <div className="modal-content">
                {/* <!-- 모달 헤더 - 제목, x버튼 --> */}
                <div className="modal-header">
                    <h5 className="modal-title">
                        {/* {createMode ? "상품 등록" : "상품 수정"} */}
                        상품등록
                    </h5>
                    <button type="button" className="btn-close btn-manual-close"
                        onClick={closeModal}></button>
                </div>
                {/* <!-- 모달 본문 --> */}
                <div className="modal-body">
                        {/* 모달 */}
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
                                    <label>파일</label>
                                    {/*  multiple accept -> 어떤 형식 받을건가*/}
                                    <input type="file" name="attachList" multiple accept="image/*" ref={inputFileRef}/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>카테고리</label>
                                    <input type="number" name="productCategory" value={input.productCategory}
                                        className="form-control" onChange={changeInput}/>
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
                                    <input type="text" name="productDetail" value={input.productDetail}
                                        className="form-control" onChange={changeInput}/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>수량</label>
                                    <input type="number" name="productQty" value={input.productQty}
                                        className="form-control" onChange={changeInput}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 {/* <!-- 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 --> */}
                 <div className="modal-footer">
                    <button type="button" className="btn btn-secondary btn-manual-close"
                            onClick={closeModal}>닫기</button>
                    {/* {createMode ? (
                        <button className="btn btn-success"
                            onClick={saveProduct}>저장</button>
                    ) : (
                        <button className="btn btn-success"
                                >수정</button>
                    )}      */}
                    <button className="btn btn-success"
                            onClick={productInsert}>상품등록</button>
                </div>
            </div>
        </div>
    </div>

    </>)

}
export default ProductInsert;