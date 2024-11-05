import { Routes, Route } from "react-router";
import Paystart from "../pay/Paystart";
import Paysuccess from "../pay/Paysuccess";
import PayFail2 from "../pay/PayFail2";
import PayList from "../pay/PayList";
import PrivateRoute from "../router/PrivateRoute";
// import PayListImage from "../pay/PayListImage";
// import Payfail from "../pay/Payfail";


const Pay = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/pay/*" */}
            <Route path="/paystart/:productNo" element={<PrivateRoute element={<Paystart/>}/>} /> 
            <Route path="/paystart/:productNo/success/:partnerOrderId" element={<PrivateRoute element={<Paysuccess/>}/>} /> 
            <Route path="/paystart/:productNo/fail" element={<PayFail2/>} /> 
            <Route path="/list" element={<PrivateRoute element={<PayList/>}/>} /> 
        </Routes>
        </>
    );
};
export default Pay;