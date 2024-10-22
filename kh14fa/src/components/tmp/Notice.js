import { Routes, Route } from "react-router";
import NoticeEdit from "../notice/NoticeEdit";
import NoticeInsert from "../notice/NoticeInsert";
import NoticeList from "../notice/NoticeList";
import NoticeDetail from "../notice/NoticeDetail";

const Notice = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/insert" element={<NoticeInsert/>}></Route>
            <Route path="/list" element={<NoticeList/>}></Route>
            <Route path="/detail/:noticeNo" element={<NoticeDetail/>}></Route>
            <Route path="/edit/:noticeNo" element={<NoticeEdit/>}></Route>
        </Routes>
        </>
    );
};
export default Notice;