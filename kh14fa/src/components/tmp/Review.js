import { Route, Routes } from "react-router";
import ReviewInsert from "../review/ReviewInsert";
import PrivateRoute from "../router/PrivateRoute";

const Review = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/review/*" */}
            <Route path="/insert/:productNo" element={<PrivateRoute element={<ReviewInsert/>}/>}/>
            
        </Routes>
        </>
    );
};
export default Review;