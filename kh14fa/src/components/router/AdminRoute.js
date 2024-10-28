// 접근 대상이 관리자가 아니라면 홈으로 이동시키는 화면 : 주소 입력 접근 방지 목적

import { useRecoilState, useRecoilValue } from "recoil";
import { memberLevelState, memberLoadingState } from "../../utils/recoil";
import { Navigate } from "react-router";

const AdminRoute = (props)=>{
    // 회원 등급 검사
    const memberLevel = useRecoilValue(memberLevelState);
    const [memberLoading] = useRecoilState(memberLoadingState);

    if(memberLoading === false){ // 로딩 진행중 : 이거 안하면 관리자 여부 파악이 안됨
        return <h1>Loading...</h1>;
    }

    // 관리자 여부에 따라 진행 혹은 홈으로 이동
    return memberLevel === "관리자" ? props.element : <Navigate to="/" />;
};

export default AdminRoute;