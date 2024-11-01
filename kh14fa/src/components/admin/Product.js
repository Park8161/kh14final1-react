// import
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import moment from 'moment';
import "moment/locale/ko"; // moment에 한국어 정보 불러오기

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
    const [category, setCategory] = useState([]);

    // effect
    useEffect(() => {
        loadProductList();
        loadCategory();
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

    // 카테고리 리스트
    const loadCategory = useCallback(async()=>{
        const response = await axios.get("/admin/category/listP");
        setCategory(response.data);
    },[category]);

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

    //시간 계산 함수 (매개변수)
	const timeCalculate = useCallback((productTime)=>{
		const date = moment.utc(productTime).tz('Asia/Seoul'); // 한국 시간으로 변환

		const nowDate = moment().tz('Asia/Seoul'); // 현재 시간을 한국 시간으로 설정

        return date;
    },[]);

    // view
    return (
        <>
            <div className="row">
                <div className="col">
                    {/* 검색창 */}
                    <div className="row mt-4">
                        <div className="col-6 offset-3">
                            <div className="input-group">
                                <select name="column" className="form-select w-auto" 
                                        value={input.column} onChange={changeInput}>
                                    <option value="">선택</option>
                                    <option value="product_name">상품명</option>
                                    <option value="product_member">판매자</option>
                                    <option value="category_name">카테고리</option>
                                </select>
                                <input type="search" className="form-control w-auto" placeholder="검색어 입력"
                                        name="keyword" value={input.keyword} onChange={changeInput}/>
                                <button type="button" className="btn btn-secondary" onClick={loadSearchList}>
                                    <FaMagnifyingGlass /> 검색
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 목록 */}
                    <div className="row mt-4">
                        <div className="col-8 offset-2">
                            {/* <div className="table-responsive"> */}
                                <table className="table border table-hover table-no-borders text-center">
                                    <thead>
                                        <tr>
                                            <th>상품번호</th>
                                            <th>상품명</th>
                                            <th>카테고리</th>
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
                                            <td className="table-truncate" onClick={e=>navigate("/product/detail/"+product.productNo)} style={{cursor:"pointer"}}>
                                                {product.productName}
                                            </td>
                                            <td>{category.filter(cat => cat.categoryNo === product.productCategory)[0]?.categoryName}</td>
                                            <td>{product.productMember}</td>
                                            <td>{product.productPrice}</td>
                                            <td>{product.productQty}</td>
                                            <td>{moment(product.productDate).format("YYYY-MM-DD")}</td>
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
                            {/* </div> */}
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
                </div>
            </div>

        </>
    );
};

export default Product;