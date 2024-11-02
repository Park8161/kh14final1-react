// import
import { useCallback, useMemo, useState } from "react";
import Jumbotron from "../Jumbotron";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { memberIdState, memberLevelState } from "../../utils/recoil";
import { toast } from 'react-toastify';
import { useRecoilState } from "recoil";

const MemberExit = ()=>{
    // navigate
    const navigate = useNavigate();

    // state
    const [password, setPassword] = useState("");
    const [exitword, setExitword] = useState("");
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);

    // callback
    const goMemberExit = useCallback(async()=>{
        try{
            const response = await axios.post("/member/exit", password);
            toast.success("안녕히 가세요!");
            logout();
            navigate("/");
        }
        catch(e){
            // console.log("비밀번호 불일치");
            toast.error("비밀번호 불일치");
        }
    },[password]);
    const logout = useCallback(()=>{
        // recoil에 저장된 memberId와 memberLevel을 제거 >> 초기값으로 변환
        setMemberId("");
        setMemberLevel("");
        
        // axios에 설정된 Authorization 헤더도 제거
        delete axios.defaults.headers.common["Authorization"];

        // localStorage, sessionStorage의 refreshToken을 제거
        window.localStorage.removeItem("refreshToken");
        window.sessionStorage.removeItem("refreshToken");

        navigate("/");
    },[memberId, memberLevel]);
    const goBack = useCallback(()=>{
        navigate(-1);
    },[]);

    // memo
    const checkAll = useMemo(()=>{
        const check = exitword === "회원탈퇴" && password.length > 0;
        return check;
    },[exitword,password]);

    return (
        <>
            {/* <Jumbotron title="회원 탈퇴 페이지" content="비밀번호와 '회원탈퇴'를 입력해주세요"/> */}

            <div className="row mt-4">
                <div className="col-6 mt-4 offset-3 border">

                    <div className="row mt-4">
                        <div className="col">
                            <label>비밀번호 입력</label>
                            <input type="password" className="form-control" 
                                value={password} onChange={e=>setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <label>'회원탈퇴'를 입력해주세요</label>
                            <input type="text" className="form-control" 
                                value={exitword} onChange={e=>setExitword(e.target.value)} />
                        </div>
                    </div>

                    <div className="row mt-4 mb-3">
                        <div className="col mt-4 text-end">
                            <button className="btn btn-info me-3" onClick={goBack}>
                                돌아가기
                            </button>
                            <button className="btn btn-danger" onClick={goMemberExit} disabled={checkAll === false}>
                                회원탈퇴
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-6 offset-3 mt-4 text-center">
                    <Jumbotron title="안녕히 가세요!" content="다음에 또 만나요!"/>
                </div>
            </div>

        </>
    );
};

export default MemberExit;