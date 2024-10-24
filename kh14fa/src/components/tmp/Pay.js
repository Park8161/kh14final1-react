import { Routes, Route } from "react-router";
import Paystart from "../pay/Paystart";
import Paysuccess from "../pay/Paysuccess";
import PayFail2 from "../pay/PayFail2";
import PayList from "../pay/PayList";
// import PayListImage from "../pay/PayListImage";
// import Payfail from "../pay/Payfail";


const Pay = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/paystart/:productNo" element={<Paystart/>} /> 
            <Route path="/paystart/:productNo/success/:partnerOrderId" element={<Paysuccess/>} /> 
            <Route path="/paystart/:productNo/fail" element={<PayFail2/>} /> 
            <Route path="/list" element={<PayList/>} /> 
            
        </Routes>
        </>
    );
};
export default Pay;