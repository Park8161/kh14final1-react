// import
import {useState, useMemo} from "react";
import {Routes, Route} from "react-router";
import Home from './Home';
// import MemberComplexSearch from "./search/MemberComplexSearch";
// import Search from "./search/Search";
// import MemberLogin from "./member/MemberLogin";
import { useRecoilValue } from 'recoil';
import { loginState } from "../utils/recoil";
import MemberLogin from "./member/MemberLogin";
import PageNotFound from "./error/PageNotFound";
import MyPage from "./member/Mypage";
import PrivateRoute from "./router/PrivateRoute";
import MemberCheck from "./member/MemberCheck";
import MemberJoin from "./member/MemberJoin";
import MemberEdit from "./member/MemberEdit";
import MemberChangePw from "./member/MemberChangePw";
import MemberFindPw from "./member/MemberFindPw";
import MemberResetPw from "./member/MemberResetPw";
import MemberExit from "./member/MemberExit";
import BlockList from './member/BlockList';
import Admin from "./tmp/Admin";
import Member from "./tmp/Member";
import Product from "./tmp/Product";
import Chat from "./tmp/Chat";
import Notice from "./tmp/Notice";
import Qna from "./tmp/Qna";
import Pay from "./tmp/Pay";
import Review from "./tmp/Review";
import AdminRoute from "./router/AdminRoute";

// component
const MainContent = ()=>{
    // recoil에서 login 상태를 불러온다
    const login = useRecoilValue(loginState);

    // state

    // effect

    // memo

    // view
    return (
        <>
            {/* 컨테이너 */}
            <div className="container-fluid">

                {/* 메인 폭 조절 영역 */}
                <div className="row my-5 pt-5">
                    <div className="col-sm-10 offset-sm-1">
                        
                        {/* 
                            주소에 따라 배치될 화면에 대한 설정(라우터 설정) 
                            위에서 아래로 검색한다 : 사용빈도가 높을수록 위쪽에 두는 것이 좋다
                        */}
                        <Routes>
                            <Route exact path="/" element={<Home/>} /> 
                            {/* 중첩 라우팅 */}
                            <Route path="/member/*" element={<Member/>} />
                            <Route path="/product/*" element={<Product/>} />
                            <Route path="/chat/*" element={<PrivateRoute element={<Chat/>}/>} /> {/* 회원만 접근 가능 */}
                            <Route path="/pay/*" element={<PrivateRoute element={<Pay/>}/>} />
                            <Route path="/review/*" element={<Review/>} />
                            <Route path="/qna/*" element={<Qna/>} />
                            <Route path="/notice/*" element={<Notice/>} />
                            <Route path="/admin/*" element={<AdminRoute element={<Admin/>}/>}/> {/* 관리자만 접근 가능 */}

                            {/* exact path : 정확하게 일치할때만 나오게 할 수 있다 */}
                            {/* 경로변수를 사용할 경우 콜론과 이름을 합쳐 변수명으로 지정 ("/book/detail/{bookID}") */}
                            
                            {/* 변경 : 중첩 라우팅 */}
                            {/* <Route path="/search/*" element={<Search/>} /> */}

                            {/* <Route path="/member/login" element={<MemberLogin/>} />
                            <Route path="/member/findpw" element={<MemberFindPw/>}/>
                            <Route path="/member/resetpw" element={<MemberResetPw/>}/>
                            <Route path="/member/check" element={<MemberCheck/>} />
                            <Route path="/member/join" element={<MemberJoin/>} />
                            <Route path="/member/mypage" element={<PrivateRoute element={<MyPage/>}/>}/>
                            <Route path="/member/edit" element={<PrivateRoute element={<MemberEdit/>}/>}/>
                            <Route path="/member/changepw" element={<PrivateRoute element={<MemberChangePw/>}/>}/>
                            <Route path="/member/exit" element={<PrivateRoute element={<MemberExit/>}/>}/>
                            <Route path="/member/block/list" element={<PrivateRoute element={<BlockList/>}/>}/> */}
                            
                            {/* 나머지 경로(*) 패턴을 지정해서 미 지정된 페이지를 모두 연결 할 수 있다 */}
                            <Route path="*" element={<PageNotFound/>} />
                        </Routes>

                    </div>
                </div>

            </div>
        </>
    );
}

// export
export default MainContent;