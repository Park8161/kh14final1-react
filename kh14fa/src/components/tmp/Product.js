import { Routes, Route } from "react-router";
import ProductInsert from "../product/ProductInsert";
import ProductList from "../product/ProductList";

const Product = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/tempInsert" element={<ProductInsert/>}></Route>
            <Route path="/list" element={<ProductList/>}></Route>
            <Route />
        </Routes>
        </>
    );
};
export default Product;