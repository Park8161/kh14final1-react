import { Routes, Route } from "react-router";
import PrivateRoute from "../router/PrivateRoute";
import AdminMemberList from "../admin/member/AdminMemberList";
import AdminMemberDetail from "../admin/member/AdminMemberDetail";
import AdminMemberEdit from "../admin/member/AdminMemberEdit";
import CategoryList from "../admin/category/CategoryList";
import CategoryRemove from "../admin/category/CategoryRemove";
import CategoryEdit from "../admin/category/CategoryEdit";
import CategoryInsert from "../admin/category/CategoryInsert";

const Admin = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/member/memberlist" element={<PrivateRoute element={<AdminMemberList/>}/>}/>
            <Route path="/member/detail/:memberId" element={<PrivateRoute element={<AdminMemberDetail/>}/>}/>
            <Route path="/member/edit/:memberId" element={<PrivateRoute element={<AdminMemberEdit/>}/>}/>
            <Route path="/category/list" element={<PrivateRoute element={<CategoryList/>}/>}/>
            <Route path="/category/insert" element={<PrivateRoute element={<CategoryInsert/>}/>}/>
            <Route path="/category/remove" element={<PrivateRoute element={<CategoryRemove/>}/>}/>
            <Route path="/category/edit/:categoryNo" element={<PrivateRoute element={<CategoryEdit/>}/>}/>
        </Routes>
        </>
    );
};
export default Admin;