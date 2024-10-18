import { Route, Routes } from "react-router";
import PrivateRoute from "../router/PrivateRoute";
import AdminMemberList from "../admin/member/AdminMemberList";
import AdminMemberDetail from "../admin/member/AdminMemberDetail";
import AdminMemberEdit from "../admin/member/AdminMemberEdit";

// 김기영
const Gykim94 = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            {/* 관리자 전용 페이지 */}
            <Route path="/admin/member/memberlist" element={<PrivateRoute element={<AdminMemberList/>}/>}/>
            <Route path="/admin/member/detail/:memberId" element={<PrivateRoute element={<AdminMemberDetail/>}/>}/>
            <Route path="/admin/member/edit/:memberId" element={<PrivateRoute element={<AdminMemberEdit/>}/>}/>

        </Routes>
        </>
    );
};
export default Gykim94;