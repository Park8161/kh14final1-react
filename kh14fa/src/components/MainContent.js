// import
import {useState, useMemo} from "react";
import {Routes, Route} from "react-router";
import Home from './Home';
// import MemberComplexSearch from "./search/MemberComplexSearch";
// import Search from "./search/Search";
// import MemberLogin from "./member/MemberLogin";
import { useRecoilValue } from 'recoil';
import { loginState } from "../utils/recoil";

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
                            {/* exact path : 정확하게 일치할때만 나오게 할 수 있다 */}
                            {/* 경로변수를 사용할 경우 콜론과 이름을 합쳐 변수명으로 지정 ("/book/detail/{bookID}") */}
                            
                            {/* 변경 : 중첩 라우팅 */}
                            <Route path="/search/*" element={<Search/>} />

                            {/* 접속 제한 하기 */}
                            {/* <PrivateRoute>children</PrivateRoute> */}
                            <Route path="/emp" element={<PrivateRoute><Emp/></PrivateRoute>} /> 
                            {/* <PrivateRoute target={property} /> */}
                            <Route path="/emp" element={<PrivateRoute target={<Emp/>} />} /> 

                            {/* 회원 로그인 */}
                            <Route path="/member/login" element={<MemberLogin/>} />

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