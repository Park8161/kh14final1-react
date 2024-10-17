import { Routes, Route } from "react-router";
import ProductInsert from "../../product/ProductInsert";

// 채수진
const Chaesujin = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}

            {/* <Route path="/productAdd" element={<ProductAdd/>}></Route> */}
            <Route path="/productInsert" element={<ProductInsert/>}></Route>
        </Routes>
        </>
    );
};
export default Chaesujin;