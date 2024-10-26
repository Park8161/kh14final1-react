import { Routes, Route } from "react-router";
import ProductInsert from "../product/ProductInsert";
import ProductList from "../product/ProductList";
import ProductDetail from "../product/ProductDetail";
import ProductEdit from "../product/ProductEdit";
import PrivateRoute from "../router/PrivateRoute";

const Product = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/product/*" */}
            <Route path="/insert" element={<PrivateRoute element={<ProductInsert/>}/>} />
            <Route path="/list" element={<ProductList/>} />
            <Route path="/detail/:productNo" element={<ProductDetail/>} />
            <Route path="/edit/:productNo" element={<PrivateRoute element={<ProductEdit/>}/>} />
        </Routes>
        </>
    );
};
export default Product;