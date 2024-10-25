import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const MemberDetail = ()=>{

    const {memberId} = useParams();
    const navigate = useNavigate();

    // state
    const [memberDetail, setMemberDetail] = useState();
    const [load, setLoad] = useState(false);
    const [productList, setProductList] = useState([]);

    // effect
    useEffect(()=>{
        loadMember();
        loadProductList();
    },[]);

    // callback
    const loadMember = useCallback(async ()=>{
        try{
            const resp = await axios.get("/member/"+memberId);
            setMemberDetail(resp.data);
            console.log("resp.data", resp.data);
        }
        catch(e){
            setMemberDetail(null);
        }
        setLoad(true); //로딩 진행상황 마킹
    }, [memberId]);

    const loadProductList = useCallback(async ()=>{
        const resp = await axios.get("/member/product/"+memberId);
        setProductList(resp.data);
        console.log("resp.data", resp.data);
    },[productList])

    if(load===false){
        return(<>
        </>);
            }
    if(memberDetail===null){
        return(<>no data</>);
    }

    return(<>
        <div className="row mt-4">
            <div className="col-sm-5">
                    <div className="row">
                        <h2>{memberId}</h2>
                    </div>
                    <div>
                        <small className="text-muted">거래후기</small>
                        <h2>{memberDetail.reviewCnt}</h2>
                    </div>
            </div>
             <div className="col-sm-5">
                <p className="row">신뢰지수 {memberDetail.reliability}</p>
                <div className="progress" style={{ height: "20px" }}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${memberDetail.reliability}%` }}
                    aria-valuenow={memberDetail.reliability}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                </div>
            </div>
                </div>
        </div>
        <div className="row mt-4 list-group">
                <h2>판매상품</h2>
                <div className="list-group-item">
                    {productList.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>상품명</th>
                                    <th>가격</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.map((product) => (
                                    <tr key={product.productId}>
                                        <td>
                                        <NavLink to={"/product/detail/"+product.productId}>
                                            {product.productName}
                                        </NavLink>
                                        </td>
                                        <td>{product.productPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="list-group-item">상품 목록이 존재하지 않습니다</div>
                    )}
                </div>
            </div>

    </>);
    
};

export default MemberDetail;