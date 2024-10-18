import { Routes, Route } from "react-router";
import BanPage from "../member/BanPage";

const Member = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/ban" element={<BanPage/>} /> 
            <Route />
        </Routes>
        </>
    );
};
export default Member;