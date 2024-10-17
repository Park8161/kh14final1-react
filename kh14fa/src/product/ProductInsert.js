import axios from "axios";
import Jumbotron from "../components/Jumbotron";
import { useCallback, useState, useRef } from "react";

const ProductInsert = ()=>{
        <Jumbotron title="파일 업로드 테스트"/>

    //state
    const [input, setInput] = useState({
        productName:"",
        productCategory:"",
        productPrice:"",
        productDetail:"",
        productQty:"",
        attachList:[]
    });

    //파일 선택 Ref
    const inputFileRef = useRef(null);

    //callback
    const changeInput = useCallback(e=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    //파일 데이터를 비동기로 보내기
    // const blob = new Blob([JSON.stringify(input)], {type: "application/json"});
    // formData.append("data",blob);

    //파일 데이터를 비동기로 보내기
    const productInsert = useCallback(async() =>{
        //객체 생성, multipart/form-data 형식으로 전송해줌
        const formData = new FormData();
    
        const fileData = inputFileRef.current.files;

        for(let i =0; i < fileData.length; i++) {
            formData.append("file", fileData[i]);
        }
        
        // JSON 형식으로 데이터를 전달하기 위해서 type을 appllication으로
        const blob = new Blob([JSON.stringify(input)], {type: "application/json"});
        
        formData.append("data", blob);
        console.log("FormData 내용:", [...formData]);
        // await axios.post("/product/insert",
        //                     formData,input, {
        //                         headers: {'Content-Type': 'multipart/form-data'},                                     
        //                  });
        await axios.post("/product/insert", formData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    });  
          
           
    // },[input]);

    return(<>
        <Jumbotron title="상품 등록 테스트"/>
        <div className="row mt-4">
            <div className="col">
                <table className="table">
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
                        <tr>
                            <td>
                                <input type="text" className="form-control"
                                    name="productName" value={input.productName}
                                        onChange={changeInput}/>
                            </td>
                            <td>
                                <input type="file" name="attachList" 
                                        ref={inputFileRef}/>
                            </td>
                            <td>
                                <input type="text" className="form-control"
                                    name="productCategory" value={input.productCategory}
                                                            onChange={changeInput}/>
                            </td>
                            <td>
                                <input type="number" className="form-control"
                                    name="productPrice" value={input.productPrice}
                                                            onChange={changeInput}/>
                            </td>
                            <td>
                                <input type="text" className="form-control"
                                    name="productDetail" value={input.productDetail}
                                                            onChange={changeInput}/>
                            </td>
                            <td>
                                <input type="number" className="form-contorl"
                                    name="productQty" value={input.productQty}
                                                            onChange={changeInput}/>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <button className="btn btn-success "
                                        onClick={productInsert}>등록하기</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

    </>)
        
   

}
export default ProductInsert;