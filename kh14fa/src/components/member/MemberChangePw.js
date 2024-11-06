//import
import { useCallback, useMemo, useState } from "react";
import { memberIdState } from "../../utils/recoil";
import Jumbotron from "../Jumbotron";
import { useRecoilValue } from 'recoil';
import { FaAsterisk, FaEye, FaRegEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

const MemberChangePw = ()=>{
    // navigator
    const navigate = useNavigate();

    // recoil state
    const memberId = useRecoilValue(memberIdState);

    // state
    const [memberPw, setMemberPw] = useState({
        currentPw : "",
        changePw : ""
    });
    const [changePw2, setChangePw2] = useState("");
    const [display, setDisplay] = useState(false);
    const [display2, setDisplay2] = useState(false);
    const [display3, setDisplay3] = useState(false);
    const [currentPwValid, setCurrentPwValid] = useState(false);
    const [changePwValid, setChangePwValid] = useState(false);
    const [changePw2Valid, setChangePw2Valid] = useState(false);
    const [currentPwClass, setCurrentPwClass] = useState("");
    const [changePwClass, setChangePwClass] = useState("");
    const [changePw2Class, setChangePw2Class] = useState("");

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = changePwValid && changePw2Valid;
        return passCheck;
    },[changePwValid,changePw2Valid]);
    
    // callback
    const changeMemberPw = useCallback((e)=>{
        setMemberPw({
            ...memberPw,
            [e.target.name]: e.target.value
        });
    },[memberPw]);

    // 돌아가기
    const returnBack = useCallback(()=>{
        navigate(-1);
    },[]);

    const checkChangePw = useCallback(()=>{
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{8,16}$/;
        const valid = regex.test(memberPw.changePw);
        setChangePwValid(valid);
        if(memberPw.changePw.length === 0) setChangePwClass("");
        else setChangePwClass(valid ? "is-valid" : "is-invalid");
    },[memberPw]);
    const checkChangePw2 = useCallback(()=>{
        const valid = memberPw.changePw === changePw2 && changePwValid === true;
        setChangePw2Valid(valid);
        if(changePw2.length === 0) setChangePw2Class("");
        else setChangePw2Class(valid ? "is-valid" : "is-invalid");
    },[memberPw,changePw2,changePwValid]);

    const goChangePw = useCallback(async()=>{
        try{ // 비밀번호 변경 성공 

            // 등록
            const response = await axios.post("/member/changePw", memberPw);
            
            navigate("/member/mypage");
            
            // 알림 코드
            toast.success("비밀번호 변경 완료!");
        }
        catch(e){ // 비밀번호 변경 실패 - 기존 비밀번호 불일치
            setCurrentPwValid(false);
            setCurrentPwClass("is-invalid");
        }
    },[memberPw,currentPwValid,currentPwClass]);

    // 비밀번호 표시
    const trueDisplay = useCallback(()=>{
        setDisplay(true);
    },[display]);
    const falseDisplay = useCallback(()=>{
        setDisplay(false);
    },[display]);
    const trueDisplay2 = useCallback(()=>{
        setDisplay2(true);
    },[display2]);
    const falseDisplay2 = useCallback(()=>{
        setDisplay2(false);
    },[display2]);
    const trueDisplay3 = useCallback(()=>{
        setDisplay3(true);
    },[display3]);
    const falseDisplay3 = useCallback(()=>{
        setDisplay3(false);
    },[display3]);

    // view
    return(
        <>
            {/* <Jumbotron title={`${memberId} 님의 정보`} content="비밀번호 변경 : 보안에 주의하시기 바랍니다" /> */}

            <div className="row mt-4">
                <div className="col-6 offset-3">

                    <div className=" border px-4 pb-4">
                        <div className="row mt-4">
                            <div className="col">
                                <label className="ps-2">
                                    기존 비밀번호 입력<FaAsterisk className="text-danger" />
                                </label>
                                <input type="checkbox" className="form-check-input d-none" checked={display} onChange={e=>setDisplay(e.target.checked)} />
                                {display ? 
                                    <FaRegEye className="form-check-label" onClick={falseDisplay} /> 
                                    : 
                                    <FaEye className="form-check-label" onClick={trueDisplay} />
                                }
                                <input type={display ? "text":"password"} className={"form-control "+currentPwClass} placeholder="비밀번호 입력"
                                    name="currentPw" value={memberPw.currentPw} onChange={changeMemberPw} />
                                <div className="valid-feedback">좋은 비밀번호입니다!</div>
                                <div className="invalid-feedback">영어 대문자, 영어 소문자, 특수문자(!@#$), 숫자 각 1개씩 필수 총8~16자 제한</div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="ps-2">
                                    비밀번호<FaAsterisk className="text-danger" />
                                </label>
                                <input type="checkbox" className="form-check-input d-none" checked={display2} onChange={e=>setDisplay2(e.target.checked)} />
                                {display2 ? 
                                    <FaRegEye className="form-check-label" onClick={falseDisplay2} /> 
                                    : 
                                    <FaEye className="form-check-label" onClick={trueDisplay2} />
                                }
                                <input type={display2 ? "text":"password"} className={"form-control "+changePwClass} placeholder="비밀번호 입력"
                                    name="changePw" value={memberPw.changePw} onChange={changeMemberPw} onBlur={checkChangePw} onFocus={checkChangePw} />
                                <div className="valid-feedback">좋은 비밀번호입니다!</div>
                                <div className="invalid-feedback">영어 대문자, 영어 소문자, 특수문자(!@#$), 숫자 각 1개씩 필수 총8~16자 제한</div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="ps-2">
                                    비밀번호 확인<FaAsterisk className="text-danger" />
                                </label>                    
                                <input type="checkbox" className="form-check-input d-none" checked={display3} onChange={e=>setDisplay3(e.target.checked)} />
                                {display3 ? 
                                    <FaRegEye className="form-check-label" onClick={falseDisplay3} /> 
                                    : 
                                    <FaEye className="form-check-label" onClick={trueDisplay3} />
                                }
                                <input type={display3 ? "text":"password"} className={"form-control "+changePw2Class} placeholder="비밀번호 확인"
                                    name="changePw2" value={changePw2} onChange={e=>setChangePw2(e.target.value)} onBlur={checkChangePw2} onFocus={checkChangePw2} />
                                <div className="valid-feedback">비밀번호와 일치합니다!</div>
                                <div className="invalid-feedback">비밀번호를 재확인해주세요</div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 text-end">
                        <div className="col-8 d-flex justify-content-end align-items-center">
                            <span className="text-danger">비밀번호 변경 : 보안에 주의하시기 바랍니다</span>
                        </div>
                        <div className="col-4">
                            <button className="btn btn-danger me-3" onClick={returnBack}>
                                돌아가기
                            </button>
                            <button className="btn btn-success" onClick={goChangePw} disabled={isAllValid === false} >
                                수정하기
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default MemberChangePw;