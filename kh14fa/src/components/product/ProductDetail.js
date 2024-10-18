import axios from "axios";
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router";

const ProductDetail = ()=>{
    //state
    const [product, setProduct] = useState();
    const [load, setLoad] = useState(false);
    //useParam
    const[productNo] = useParams();
    
    //useEffect
    useEffect (()=>{
        loadProduct();
    },[]);
  
    //callback
    const loadProduct = useCallback(async()=>{
        try{
            const resp = await axios.post(`/detail/${productNo}`);
            setProduct(resp.data);
        }
        catch(e) {
            setProduct(null);
        }
        setLoad(true);
    },[product, productNo]);

    const deleteProduct = useCallback(async () =>{
        await axios.post("/product/${productId}");
    },[product]);
    
    return(
        <>
            <div className="row mt-4">
                <div className="clo-sm-3">
                        {product.productName}
                </div>
            </div>

            <div className="mt-4">
                <div className="col-6">
                    {product.productName}
                    {/* <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}/> */}
                </div>
                <div className="col-6">
                {/* <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}/>  */}
                </div>
            </div>
        </>
    )
}
export default ProductDetail;