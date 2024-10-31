// import
import { useCallback, useState } from "react";
import Jumbotron from "../Jumbotron";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from "axios";
import { Navigate } from "react-router";
import { useNavigate } from 'react-router';
import { useRecoilState } from "recoil";
import { memberIdState, memberLevelState } from "../../utils/recoil";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const MemberLogin = () => {
    // navigate
    const navigate = useNavigate();

    // state
    const [input, setInput] = useState({
        memberId : "",
        memberPw : ""
    });
    const [display, setDisplay] = useState(false);
    const [stay, setStay] = useState(false);
    const [error, setError] = useState(false);
    
    // recoil state
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);

    // callback
    const changeInput = useCallback(e=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    const sendLoginRequest = useCallback(async()=>{
        try { // 로그인 성공
            const response = await axios.post("/member/login", input);
            // console.log(response.data);

            // 로그인 성공 후 차단 상태 확인
            const banCheckResponse = await axios.get(`/member/banCheck/${input.memberId}`);

            if(banCheckResponse.data){
                //차단된 계정이면 차단 페이지로 리다이렉트
                // console.log("차단된 계정");
                navigate("/member/ban");
                return;
            }

            // 이동하기 전에 로그인 상태(아이디, 등급)를 recoil 저장소에 저장
            setMemberId(response.data.memberId);
            setMemberLevel(response.data.memberLevel);

            // accessToken은 앞으로 서버로 요청을 보낼 때 같이 보낼 데이터
            // 이 토큰을 이용해서 서버가 나의 존재를 구분할 수 있다
            // 매번 첨부하기 귀찮으니 axios 설정을 통해 Http Header에 첨부
            // 헤더 이름은 Authorization 으로 하자(대부분의 사이트에서 이렇게 사용함)
            // 토큰 앞에 "Bearer"라는 접두사를 붙여 인증용 토큰임을 명시하자! + 뒤에 띄어쓰기 반드시 써야함
            // (Bearer는 공식 단어 중 하나임(Basic,Digest,Apikey,...), 접두사 사용시 서드파티 이용 가능)
            axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.accessToken;

            // refreshToken은 로그인이 풀렸을 때 상황에 따라 로그인을 갱신하기 위한 데이터
            // - 로그인 유지를 체크했느냐에 따라 다른 위치에 저장
            // - 로그인 유지 체크 시 - localStorage에 저장
            // - 로그인 유지 미 체크 시 - sessionStorage에 저장
            if(stay === true){ // 로그인 유지 체크 시
                window.localStorage.setItem("refreshToken", response.data.refreshToken);
            }
            else { // 로그인 유지 미 체크 시
                window.sessionStorage.setItem("refreshToken", response.data.refreshToken);
            }

            // - 로그인에 성공하면? 메인페이지로 이동
            // return <Navigate to="/" /> // 컴포넌트(view)에서 사용해야할 경우
            // useNavigate를 쓰면 무조건 뒤에 화면(return(<></>);)이 나와야 함 >> 함수 내부라서 화면 안해도 된다?
            toast("환영해요 "+input.memberId+"님!");
            navigate("/"); // 함수에서 사용해야할 경우
        }
        catch(e){
            // 에러 처리 + 차단된 계정 403 처리 추가
            if(e.response && e.response.status === 403){
                // console.log("차단된 계정");
                navigate("/member/ban");
            }
            else{
                setError(true);
                setTimeout(()=>{
                    setError(false);
                },5000);
                // console.log("아이디가 없거나 비밀번호 불일치");
            }
        }
    },[input, stay]);
    

    // view
    return (
        <>
            <div className="row mt-4">
                <div className="col-md-6 offset-md-3 mt-4">

                    <Jumbotron title="회원 로그인" content="로고 이미지 넣을자리" />

                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                아이디
                            </label>
                            <input type="text" className="form-control" placeholder="아이디 입력"
                                name="memberId" value={input.memberId} onChange={changeInput} 
                                onKeyUp={e=>e.key === 'Enter' && sendLoginRequest()}/>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                비밀번호
                            </label>
                            <input type={display ? "text" : "password"} className="form-control" placeholder="비밀번호 입력"
                                name="memberPw" value={input.memberPw} onChange={changeInput} 
                                onKeyUp={e=>e.key === 'Enter' && sendLoginRequest()}/>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-6">
                            <label>
                                <input type="checkbox" className="form-check-input" 
                                    checked={display} onChange={e=>setDisplay(e.target.checked)}/>
                                <span className="form-check-label ms-1 me-3">비밀번호 표시</span>
                            </label>
                            <label>
                                <input type="checkbox" className="form-check-input"  
                                    checked={stay} onChange={e=>setStay(e.target.checked)}/>
                                <span className="form-check-label ms-1 me-3">로그인 유지</span>
                            </label>
                        </div>
                        {error === true ? (
                            <div className="col-3 text-danger mt-0 justify-content-center align-items-center">회원 정보 불일치</div>
                        ) : (
                            <div className="col-3"></div>
                        )}
                        <div className="col-3 text-end">
                            <label>
                                <NavLink className="text-decoration-none" to="/member/findpw">
                                    비밀번호 찾기
                                </NavLink>
                            </label>                            
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <button className="btn btn-success w-100" onClick={sendLoginRequest}>
                                <RiLoginBoxLine />
                                <span>로그인</span>
                            </button>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <button className="btn btn-secondary w-100" onClick={e=>navigate("/member/join")}>
                                <RiLoginBoxLine />
                                <span>회원가입</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}

export default MemberLogin;