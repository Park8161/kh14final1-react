import { Routes, Route } from "react-router";
import PrivateRoute from "../router/PrivateRoute";
import AdminMemberList from "../admin/member/AdminMemberList";
import AdminMemberDetail from "../admin/member/AdminMemberDetail";
import AdminMemberEdit from "../admin/member/AdminMemberEdit";

const Admin = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/member/memberlist" element={<PrivateRoute element={<AdminMemberList/>}/>}/>
            <Route path="/member/detail/:memberId" element={<PrivateRoute element={<AdminMemberDetail/>}/>}/>
            <Route path="/member/edit/:memberId" element={<PrivateRoute element={<AdminMemberEdit/>}/>}/>
            <Route />
        </Routes>
        </>
    );
};
export default Admin;