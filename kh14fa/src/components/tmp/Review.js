import { Route, Routes } from "react-router";
import ReviewInsert from "../review/ReviewInsert";
import PrivateRoute from "../router/PrivateRoute";

const Review = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/insert/:productNo" element={<PrivateRoute element={<ReviewInsert/>}/>}/>
            
        </Routes>
        </>
    );
};
export default Review;