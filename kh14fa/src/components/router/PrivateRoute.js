// 인증이 되어 있지 않으면 로그인 화면으로 이동시키는 화면

import { useRecoilState, useRecoilValue } from "recoil";
import { loginState, memberLoadingState } from "../../utils/recoil";
import { Navigate } from "react-router";

const PrivateRoute = (props)=>{
    // 로그인 검사 결과를 불러온다
    const login = useRecoilValue(loginState);
    const [memberLoading] = useRecoilState(memberLoadingState);
    // const [memberLoading] = useRecoilValue(memberLoadingState); // 같음

    if(memberLoading === false){ // 로딩 진행중
        return <h1>Loading...</h1>;
    }

    // return login === true ? props.children : <Navigate to="/member/login" />;
    return login === true ? props.element : <Navigate to="/member/login" />;
};

export default PrivateRoute;