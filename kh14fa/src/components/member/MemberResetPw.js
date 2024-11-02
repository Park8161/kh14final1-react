// import
import { useNavigate, useSearchParams } from "react-router-dom";
import Jumbotron from "../Jumbotron";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaAsterisk, FaEye, FaRegEye } from "react-icons/fa6";

const MemberResetPw = ()=>{
    // 파라미터 읽어오기
    const [searchParams] = useSearchParams();

    // navigator
    const navigate = useNavigate();

    // state
    const [input, setInput] = useState({
        certDto : {
            certEmail : searchParams.get("certEmail"),
            certNumber : searchParams.get("certNumber")
        },
        memberId : searchParams.get("memberId"),
        changePw : ""
    });
    const [changePw2, setChangePw2] = useState("");
    const [changePwValid, setChangePwValid] = useState(false);
    const [changePw2Valid, setChangePw2Valid] = useState(false);
    const [changePwClass, setChangePwClass] = useState("");
    const [changePw2Class, setChangePw2Class] = useState("");
    const [display2, setDisplay2] = useState(false);
    const [display3, setDisplay3] = useState(false);

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = changePwValid && changePw2Valid;
        return passCheck;
    },[changePwValid,changePw2Valid]);

    // callback
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input,searchParams]);

    const checkChangePw = useCallback(()=>{
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{8,16}$/;
        const valid = regex.test(input.changePw);
        setChangePwValid(valid);
        if(input.changePw.length === 0) setChangePwClass("");
        else setChangePwClass(valid ? "is-valid" : "is-invalid");
    },[input,changePwValid]);
    const checkChangePw2 = useCallback(()=>{
        const valid = input.changePw === changePw2 && changePwValid === true;
        setChangePw2Valid(valid);
        if(changePw2.length === 0) setChangePw2Class("");
        else setChangePw2Class(valid ? "is-valid" : "is-invalid");
    },[input,changePw2,changePwValid]);

    const goResetPw = useCallback(async()=>{
        try{ // 비밀번호 변경 성공 

            // 등록
            const response = await axios.post("/member/resetPw", input);
            
            navigate("/member/login");
            
            // 알림 코드
            toast.success("비밀번호 변경 완료!");
        }
        catch(e){ // 비밀번호 변경 실패 - 기존 비밀번호 불일치
            toast.error("이미 만료된 페이지입니다");
        }
    },[input]);

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
            {/* <Jumbotron title={`${input.memberId} 님의 정보`} content="비밀번호 재설정 : 보안에 주의하시기 바랍니다" /> */}

            <div className="row mt-4">
                <div className="col-6 offset-3">

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
                                name="changePw" value={input.changePw} onChange={changeInput} onBlur={checkChangePw} onFocus={checkChangePw} />
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

                    <div className="row mt-4 text-end">
                        <div className="col-8 mt-4 d-flex justify-content-end align-items-center">
                            <span className="text-danger">비밀번호 변경 : 보안에 주의하시기 바랍니다</span>
                        </div>
                        <div className="col-4 mt-4">
                            <button className="btn btn-success" onClick={goResetPw} disabled={isAllValid === false} >
                                수정하기
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default MemberResetPw;