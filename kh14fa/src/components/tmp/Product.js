import { Routes, Route } from "react-router";
import ProductInsert from "../product/ProductInsert";
import ProductList from "../product/ProductList";
import ProductDetail from "../product/ProductDetail";

const Product = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/tempInsert" element={<ProductInsert/>}></Route>
            <Route path="/list" element={<ProductList/>}></Route>
            <Route path="/detail/:productNo" element={<ProductDetail/>}> </Route>
        </Routes>
        </>
    );
};
export default Product;