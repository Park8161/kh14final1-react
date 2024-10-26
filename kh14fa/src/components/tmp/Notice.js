import { Routes, Route } from "react-router";
import NoticeEdit from "../notice/NoticeEdit";
import NoticeInsert from "../notice/NoticeInsert";
import NoticeList from "../notice/NoticeList";
import NoticeDetail from "../notice/NoticeDetail";
import AdminRoute from "../router/AdminRoute";

const Notice = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/notice/*" */}
            <Route path="/insert" element={<AdminRoute element={<NoticeInsert/>}/>}/> {/* 작성은 관리자만 가능 */}
            <Route path="/list" element={<NoticeList/>}/>
            <Route path="/detail/:noticeNo" element={<NoticeDetail/>}/>
            <Route path="/edit/:noticeNo" element={<AdminRoute element={<NoticeEdit/>}/>}/> {/* 수정은 관리자만 가능 */}
        </Routes>
        </>
    );
};
export default Notice;