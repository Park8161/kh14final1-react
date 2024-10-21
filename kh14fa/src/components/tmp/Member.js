import { Routes, Route } from "react-router";
import BanPage from "../member/BanPage";
import MemberDetail from "../member/MemberDetail";
import MemberLogin from "../member/MemberLogin";
import MemberFindPw from "../member/MemberFindPw";
import MemberResetPw from "../member/MemberResetPw";
import MemberCheck from "../member/MemberCheck";
import MemberJoin from "../member/MemberJoin";
import MyPage from "../member/Mypage";
import MemberEdit from "../member/MemberEdit";
import MemberChangePw from "../member/MemberChangePw";
import MemberExit from "../member/MemberExit";
import BlockList from "../member/BlockList";
import PrivateRoute from "../router/PrivateRoute";

const Member = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/ban" element={<BanPage/>} /> 
            <Route path="/detail/:memberId" element={<MemberDetail/>}></Route>
            <Route path="/login" element={<MemberLogin/>} />
            <Route path="/findpw" element={<MemberFindPw/>}/>
            <Route path="/resetpw" element={<MemberResetPw/>}/>
            <Route path="/check" element={<MemberCheck/>} />
            <Route path="/join" element={<MemberJoin/>} />
            <Route path="/mypage" element={<PrivateRoute element={<MyPage/>}/>}/>
            <Route path="/edit" element={<PrivateRoute element={<MemberEdit/>}/>}/>
            <Route path="/changepw" element={<PrivateRoute element={<MemberChangePw/>}/>}/>
            <Route path="/exit" element={<PrivateRoute element={<MemberExit/>}/>}/>
            <Route path="/block/list" element={<PrivateRoute element={<BlockList/>}/>}/>
            <Route />
        </Routes>
        </>
    );
};
export default Member;