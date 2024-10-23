import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { useParams } from "react-router";

const PayFail2 = ()=>{

    const [product, setProduct] = useState({});
    const productNo = 195;

    useEffect(() => {
            console.log("productNo(in useEffect) "+productNo);
            loadProduct();
    }, []);

    const loadProduct = useCallback(async ()=>{
        if(productNo !== 0){
            const resp = await axios.get("/product/detail/"+productNo);
            setProduct(resp.data.productDto);
        }
    },[]);

    return(<>
        <h1>결제 실패</h1>
        
    </>);
};
export default PayFail2;