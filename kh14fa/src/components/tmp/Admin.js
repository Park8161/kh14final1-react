import { Routes, Route } from "react-router";
import PrivateRoute from "../router/PrivateRoute";
import AdminMemberList from "../admin/member/AdminMemberList";
import AdminMemberDetail from "../admin/member/AdminMemberDetail";
import AdminMemberEdit from "../admin/member/AdminMemberEdit";
import CategoryList from "../admin/category/CategoryList";
import CategoryAdd from "../admin/category/CategoryAdd";
import CategoryRemove from "../admin/category/CategoryRemove";
import CategoryEdit from "../admin/category/CategoryEdit";

const Admin = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/member/memberlist" element={<PrivateRoute element={<AdminMemberList/>}/>}/>
            <Route path="/member/detail/:memberId" element={<PrivateRoute element={<AdminMemberDetail/>}/>}/>
            <Route path="/member/edit/:memberId" element={<PrivateRoute element={<AdminMemberEdit/>}/>}/>
            <Route path="/category/list" element={<PrivateRoute element={<CategoryList/>}/>}/>
            <Route path="/category/add" element={<PrivateRoute element={<CategoryAdd/>}/>}/>
            <Route path="/category/remove" element={<PrivateRoute element={<CategoryRemove/>}/>}/>
            <Route path="/category/edit" element={<PrivateRoute element={<CategoryEdit/>}/>}/>
        </Routes>
        </>
    );
};
export default Admin;