// import
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';

const Product = ()=>{
    // navigate
    const navigate = useNavigate();

    // state
    const [productList, setProductList] = useState([]);
    const [input, setInput] = useState({
        column : "",
        keyword : ""
    });
    const [page, setPage] = useState(1); 
    const [pageSize, setPageSize] = useState(10); 

    // effect
    useEffect(() => {
        loadProductList();
    }, []);

    // callback
    // 기본적인 리스트 (검색X)
    const loadProductList = useCallback(async()=>{
        const response = await axios.get("/product/list");
        setProductList(response.data);
    },[productList]);

    // 검색기능 있는 리스트
    const loadSearchList = useCallback(async()=>{
        // column, keyword가 없다면 차단
        if(input.column.trim().length === 0) return loadProductList();
        if(input.keyword.trim().length === 0) return loadProductList();

        const response = await axios.get(`/product/list/${encodeURIComponent(input.column)}/${encodeURIComponent(input.keyword)}`);
        setProductList(response.data);
    },[input]);

    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    const sortedFilteredNotice = [...productList].sort();

    // 페이지 
    const getPagedNotice = useCallback(()=>{
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        return sortedFilteredNotice.slice(startIndex, endIndex);
    },[sortedFilteredNotice]);

    // 판매상태 변경 함수
    const changeHoldOff = useCallback(async(product,data)=>{
        let productState = "";
        try{
            if(data === "판매보류") productState = data;
            else if(data === "판매중") productState = data;
            else if(data === "판매완료") productState = data;
            await axios.patch("/product/patch", {productNo:product.productNo, productState:productState});
            loadProductList();
            toast.info("판매상태 변경 완료");
        }
        catch(e){
            toast.error("판매상태 변경 불가");
        }
    },[]);

    // view
    return (
        <>

            {/* 검색창 */}
            <div className="row mt-4">
                <div className="col-6 offset-3">
                    <div className="input-group w-auto">
                        <select type="search" className="form-select bg-white" 
                                name="column" value={input.column} onChange={changeInput}>
                            <option value="">선택</option>
                            <option value="product_name">상품명</option>
                            <option value="product_member">판매자</option>
                        </select>
                        <input type="search" className="form-control w-auto bg-white" 
                                name="keyword" value={input.keyword} onChange={changeInput}/>
                        <button type="button" className="btn btn-dark d-flex justify-content-center align-items-center" onClick={loadSearchList}>
                            <FaMagnifyingGlass />
                            검색
                        </button>
                    </div>
                </div>
            </div>

            {/* 목록 */}
            <div className="row mt-4">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table text-nowrap text-center">
                            <thead>
                                <tr>
                                    <th>상품번호</th>
                                    <th>상품명</th>
                                    <th>판매자</th>
                                    <th>판매가</th>
                                    <th>수량</th>
                                    <th>등록일</th>
                                    <th>판매상태</th>
                                    <th>상태관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getPagedNotice().map((product)=>(
                                <tr key={product.productNo}>
                                    <td>{product.productNo}</td>
                                    <td onClick={e=>navigate("/product/detail/"+product.productNo)} style={{cursor:"pointer"}}>
                                        {product.productName}
                                    </td>
                                    <td>{product.productMember}</td>
                                    <td>{product.productPrice}</td>
                                    <td>{product.productQty}</td>
                                    <td>-{/* {product.productDate} */}</td>
                                    <td>{product.productState}</td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={e=>changeHoldOff(product,"판매중")} disabled={product.productState === "판매중"}>
                                            판매중
                                        </button>
                                        <button className="btn btn-secondary btn-sm ms-2" onClick={e=>changeHoldOff(product,"판매완료")} disabled={product.productState === "판매완료"}>
                                            판매완료
                                        </button>
                                        <button className="btn btn-secondary btn-sm ms-2" onClick={e=>changeHoldOff(product,"판매보류")} disabled={product.productState === "판매보류"}>
                                            판매보류
                                        </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* 페이징 */}
            <div className="row mt-4">
                <div className="col text-center">
                    <button className="btn btn-outline-primary" disabled={page===1} onClick={e=>setPage(page-1)}>
                        이전
                    </button>
                    <span className="mx-3">Page {page} of {Math.ceil(sortedFilteredNotice.length/pageSize)}</span>
                    <button className="btn btn-outline-primary" disabled={page===Math.ceil(sortedFilteredNotice.length/pageSize)} onClick={e=>setPage(page+1)}>
                        다음
                    </button>
                </div>
            </div>

        </>
    );
};

export default Product;