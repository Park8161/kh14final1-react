import { Routes, Route } from "react-router";
import ChooseOption from "../pay/ChooseOption";

const Pay = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/chooseoption/:productNo" element={<ChooseOption/>} /> 
            <Route />
        </Routes>
        </>
    );
};
export default Pay;