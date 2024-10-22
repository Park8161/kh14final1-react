import { Routes, Route } from "react-router";
import QnaInsert from "../qna/QnaInsert";
import QnaList from "../qna/QnaList";
import QnaDetail from "../qna/QnaDetail";
import QnaEdit from "../qna/QnaEdit";

const Qna = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/insert" element={<QnaInsert/>}></Route>
            <Route path="/list" element={<QnaList/>}></Route>
            <Route path="/detail/:qnaNo" element={<QnaDetail/>}></Route>
            <Route path="/edit/:qnaNo" element={<QnaEdit/>}></Route>
            <Route />
        </Routes>
        </>
    );
};
export default Qna;