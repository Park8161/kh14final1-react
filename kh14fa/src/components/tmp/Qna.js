import { Routes, Route } from "react-router";
import QnaInsert from "../qna/QnaInsert";
import QnaList from "../qna/QnaList";
import QnaDetail from "../qna/QnaDetail";
import QnaEdit from "../qna/QnaEdit";
import PrivateRoute from "../router/PrivateRoute";

const Qna = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/qna/*" */}
            <Route path="/insert" element={<PrivateRoute element={<QnaInsert/>}/>} />
            <Route path="/list" element={<QnaList/>} />
            <Route path="/detail/:qnaNo" element={<QnaDetail/>} />
            <Route path="/edit/:qnaNo" element={<PrivateRoute element={<QnaEdit/>}/>} />
            <Route />
        </Routes>
        </>
    );
};
export default Qna;