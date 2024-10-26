import { Routes, Route } from "react-router";
import AdminMemberList from "../admin/member/AdminMemberList";
import AdminMemberDetail from "../admin/member/AdminMemberDetail";
import AdminMemberEdit from "../admin/member/AdminMemberEdit";
import CategoryList from "../admin/category/CategoryList";
import CategoryEdit from "../admin/category/CategoryEdit";
import CategoryInsert from "../admin/category/CategoryInsert";

const Admin = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/admin/*" */}
            <Route path="/member/list" element={<AdminMemberList/>} />
            <Route path="/member/detail/:memberId" element={<AdminMemberDetail/>} />
            <Route path="/member/edit/:memberId" element={<AdminMemberEdit/>} />
            <Route path="/category/list" element={<CategoryList/>} />
            <Route path="/category/insert" element={<CategoryInsert/>} />
            <Route path="/category/edit/:categoryNo" element={<CategoryEdit/>} />
        </Routes>
        </>
    );
};
export default Admin;