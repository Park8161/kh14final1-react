import { Routes, Route } from "react-router";
import FaqList from "../faq/FaqList";

const Faq = ()=>{
    return (
        <>
        <Routes>
            <Route path="/list" element={<FaqList/>} />
            <Route />
        </Routes>
        </>
    );
};
export default Faq;