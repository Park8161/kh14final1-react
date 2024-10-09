// import
import {useState, useMemo, useCallback} from "react";
import Jumbotron from "../Jumbotron";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import { FaAsterisk, FaEye, FaRegEye } from "react-icons/fa6";


// component
const MemberJoin = ()=>{
    // navigator
    const navigate = useNavigate();
    
    // state
    const [input, setInput] = useState({
        memberId : "",
        memberPw : "",
        memberName : "",
        memberEmail : "",
        memberPost : "",
        memberAddress1 : "",
        memberAddress2 : "",
        memberContact : "",
        memberBirth : "",
    });
    const [memberPw2, setMemberPw2] = useState("");
    const [message, setMessage] = useState("");
    const [display, setDisplay] = useState(false);
    const [display2, setDisplay2] = useState(false);

    // 정규표현식 검사 목적 state
    const [memberIdValid, setMemberIdValid] = useState(false);
    const [memberPwValid, setMemberPwValid] = useState(false);
    const [memberPw2Valid, setMemberPw2Valid] = useState(false);
    const [memberNameValid, setMemberNameValid] = useState(false);
    const [memberEmailValid, setMemberEmailValid] = useState(false);
    const [memberAddressValid, setMemberAddressValid] = useState(true);
    const [memberContactValid, setMemberContactValid] = useState(true);
    const [memberBirthValid, setMemberBirthValid] = useState(true);
    const [memberIdClass, setMemberIdClass] = useState("");
    const [memberPwClass, setMemberPwClass] = useState("");
    const [memberPw2Class, setMemberPw2Class] = useState("");
    const [memberNameClass, setMemberNameClass] = useState("");
    const [memberEmailClass, setMemberEmailClass] = useState("");
    const [memberAddressClass, setMemberAddressClass] = useState("");
    const [memberContactClass, setMemberContactClass] = useState("");
    const [memberBirthClass, setMemberBirthClass] = useState("");

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = memberIdValid && memberPwValid && memberPw2Valid 
                            && memberNameValid && memberEmailValid && memberAddressValid 
                            && memberContactValid && memberBirthValid;
        return passCheck;
    },[memberIdValid,memberPwValid,memberPw2Valid,memberNameValid,memberEmailValid,memberAddressValid,memberContactValid,memberBirthValid]);
    
    // callback
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    },[input]);

    // 돌아가기
    const returnHome = useCallback(()=>{
        navigate("/");
    },[]);

    // 형식검사
    const checkMemberId = useCallback(async()=>{
        if(input.memberId.length > 0){
            // 아이디 중복 검사
            const response = await axios.get("http://localhost:8080/member/checkId/"+input.memberId);
            if(response.data === false) {
                setMessage("중복된 아이디입니다!");
                setMemberIdClass("");
                return;
            }
            else setMessage("");
        }
        const regex = /^[a-z][a-z0-9]{7,19}$/;
        const valid = regex.test(input.memberId);
        setMemberIdValid(valid);
        if(input.memberId.length === 0) setMemberIdClass("");
        else setMemberIdClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberPw = useCallback(()=>{
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{8,16}$/;
        const valid = regex.test(input.memberPw);
        setMemberPwValid(valid);
        if(input.memberPw.length === 0) setMemberPwClass("");
        else setMemberPwClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberPw2 = useCallback(()=>{
        const valid = input.memberPw === memberPw2 && memberPwValid === true;
        setMemberPw2Valid(valid);
        if(memberPw2.length === 0) setMemberPw2Class("");
        else setMemberPw2Class(valid ? "is-valid" : "is-invalid");
    },[input,memberPw2, memberPwValid]);
    const checkMemberName = useCallback(()=>{
        const regex = /^[가-힣]{2,7}$/;
        const valid = regex.test(input.memberName);
        setMemberNameValid(valid);
        if(input.memberName.length === 0) setMemberNameClass("");
        else setMemberNameClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberEmail = useCallback(()=>{
        const regex = /^.+/;
        const valid = regex.test(input.memberEmail);
        setMemberEmailValid(valid);
        if(input.memberEmail.length === 0) setMemberEmailClass("");
        else setMemberEmailClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberAddress = useCallback(()=>{
        const check1 = input.memberPost.length === 0 && input.memberAddress1.length === 0 && input.memberAddress2.length === 0;
        const check2 = input.memberPost.length > 0 && input.memberAddress1.length > 0 && input.memberAddress2.length > 0;
        const valid = check1 || check2;
        setMemberAddressValid(valid);
        if(check1) setMemberAddressClass("");
        else setMemberAddressClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberContact = useCallback(()=>{
        const regex = /^010[1-9][0-9]{6,7}$/;
        const valid = regex.test(input.memberContact);
        setMemberContactValid(valid);
        if(input.memberContact.length === 0) setMemberContactClass("");
        else setMemberContactClass(valid ? "is-valid" : "is-invalid");
    },[input]);
    const checkMemberBirth = useCallback(()=>{
        const regex = /^(1[0-9]{3}|20([01][0-9]|2[0-9]))-(02-(0[1-9]|1[0-9]|2[0-8])|(0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30)|(0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01]))$/;
        const valid = regex.test(input.memberBirth);
        setMemberBirthValid(valid);
        if(input.memberBirth.length === 0) setMemberBirthClass("");
        else setMemberBirthClass(valid ? "is-valid" : "is-invalid");
    },[input]);

    // 비밀번호 표시
    const trueDisplay = useCallback(()=>{
        setDisplay(true);
    },[display]);
    const falseDisplay = useCallback(()=>{
        setDisplay(false);
    },[display]);
    const trueDisplay2 = useCallback(()=>{
        setDisplay2(true);
    },[display]);
    const falseDisplay2 = useCallback(()=>{
        setDisplay2(false);
    },[display]);
    
    // 신규 회원 등록
    const goMemberJoin = useCallback(async()=>{
        if(isAllValid === false) return;

        // 등록
        const response = await axios.post("http://localhost:8080/member/join",input);
        navigate("/");
    
        // 알림 코드
        toast.success("회원 가입 완료!");
    },[input, isAllValid]);

    // view
    return(
        <>
            <Jumbotron title="신규 회원 가입" />

            <div className="row mt-4">
                <div className="col">
                    <label>
                        아이디<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className={"form-control "+memberIdClass} placeholder="아이디"
                        name="memberId" value={input.memberId} onChange={changeInput} onBlur={checkMemberId} onFocus={checkMemberId} />
                    <div className="valid-feedback">좋은 아이디입니다!</div>
                    <div className="invalid-feedback">영어 소문자와 숫자 구성 7~19자 제한</div>
                    <div className="text-danger">{message}</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        비밀번호<FaAsterisk className="text-danger" />
                    </label>
                    <input type="checkbox" className="form-check-input d-none" checked={display} onChange={e=>setDisplay(e.target.checked)} />
                    {display ? 
                        <FaRegEye className="form-check-label" onClick={falseDisplay} /> 
                        : 
                        <FaEye className="form-check-label" onClick={trueDisplay} />
                    }
                    <input type={display ? "text":"password"} className={"form-control "+memberPwClass} placeholder="비밀번호"
                        name="memberPw" value={input.memberPw} onChange={changeInput} onBlur={checkMemberPw} onFocus={checkMemberPw} />
                    <div className="valid-feedback">좋은 비밀번호입니다!</div>
                    <div className="invalid-feedback">영어 대문자, 영어 소문자, 특수문자(!@#$), 숫자 각 1개씩 필수 총8~16자 제한</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        비밀번호 확인<FaAsterisk className="text-danger" />
                    </label>
                        <input type="checkbox" className="form-check-input d-none" checked={display2} onChange={e=>setDisplay2(e.target.checked)} />
                        {display2 ? 
                            <FaRegEye className="form-check-label" onClick={falseDisplay2} /> 
                            : 
                            <FaEye className="form-check-label" onClick={trueDisplay2} />
                        }
                    <input type={display2 ? "text":"password"} className={"form-control "+memberPw2Class} placeholder="비밀번호 확인"
                        name="memberPw2" value={memberPw2} onChange={e=>setMemberPw2(e.target.value)} onBlur={checkMemberPw2} onFocus={checkMemberPw2} />
                    <div className="valid-feedback">비밀번호와 일치합니다!</div>
                    <div className="invalid-feedback">비밀번호를 재확인해주세요</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        이름<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className={"form-control "+memberNameClass} placeholder="이름"
                        name="memberName" value={input.memberName} onChange={changeInput} onBlur={checkMemberName} onFocus={checkMemberName} />
                    <div className="valid-feedback">좋은 이름이네요!</div>
                    <div className="invalid-feedback">한글 2~7자 제한(모음,자음 불가)</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        이메일<FaAsterisk className="text-danger" />
                    </label>
                    <input type="email" className={"form-control "+memberEmailClass} placeholder="이메일"
                        name="memberEmail" value={input.memberEmail} onChange={changeInput} onBlur={checkMemberEmail} onFocus={checkMemberEmail} />
                    <div className="valid-feedback">좋은 이메일이에요!</div>
                    <div className="invalid-feedback">이메일 형식을 지켜주세요</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        우편번호
                    </label>
                    <input type="text" className={"form-control "+memberAddressClass} placeholder="우편번호"
                        name="memberPost" value={input.memberPost} onChange={changeInput} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        기본주소
                    </label>
                    <input type="text" className={"form-control "+memberAddressClass} placeholder="기본주소"
                        name="memberAddress1" value={input.memberAddress1} onChange={changeInput} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        상세주소
                    </label>
                    <input type="text" className={"form-control "+memberAddressClass} placeholder="상세주소"
                        name="memberAddress2" value={input.memberAddress2} onChange={changeInput} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                    <div className="valid-feedback">좋은 곳에 사시는군요!</div>
                    <div className="invalid-feedback">우편번호,기본주소,상세주소를 모두 입력하거나 모두 비워주세요</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        전화번호
                    </label>
                    <input type="tel" className={"form-control "+memberContactClass} placeholder="전화번호"
                        name="memberContact" value={input.memberContact} onChange={changeInput} onBlur={checkMemberContact} onFocus={checkMemberContact} />
                    <div className="valid-feedback">좋은 전화번호에요!</div>
                    <div className="invalid-feedback">전화번호 형식에 맞지 않네요(ex:01012345678)</div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        생년월일
                    </label>
                    <input type="date" className={"form-control "+memberBirthClass} placeholder="생년월일"
                        name="memberBirth" value={input.memberBirth} onChange={changeInput} onBlur={checkMemberBirth} onFocus={checkMemberBirth} />
                    <div className="valid-feedback">좋은 날에 태어나셨네요!</div>
                    <div className="invalid-feedback">날짜를 선택 및 입력해주세요</div>
                </div>
            </div>

            <div className="row mt-4 text-end">
                <div className="col mt-4">
                    <button className="btn btn-danger me-3" onClick={returnHome}>
                        돌아가기
                    </button>
                    <button className="btn btn-success" onClick={goMemberJoin} disabled={isAllValid === false} >
                        가입하기
                    </button>
                </div>
            </div>

        </>
    );
};

export default MemberJoin;