//import
import { useCallback, useEffect, useMemo, useState } from "react";
import Jumbotron from "../Jumbotron";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaAsterisk } from "react-icons/fa6";


const MemberEdit = ()=>{
    // navigate
    const navigate = useNavigate();

    // state
    const [member, setMember] = useState({});
    const [edit, setEdit] = useState({
        memberId : "",
        memberPw : "",
        memberName : "",
        memberEmail : "",
        memberPost : "",
        memberAddress1 : "",
        memberAddress2 : "",
        memberContact : "",
        memberBirth : "",
        memberPoint : "",
        memberJoin : "",
        memberLogin : "",
    });

    // 정규표현식 검사 목적 state
    const [memberNameValid, setMemberNameValid] = useState(true);
    const [memberEmailValid, setMemberEmailValid] = useState(true);
    const [memberAddressValid, setMemberAddressValid] = useState(true);
    const [memberContactValid, setMemberContactValid] = useState(true);
    const [memberBirthValid, setMemberBirthValid] = useState(true);
    const [memberNameClass, setMemberNameClass] = useState("");
    const [memberEmailClass, setMemberEmailClass] = useState("");
    const [memberAddressClass, setMemberAddressClass] = useState("");
    const [memberContactClass, setMemberContactClass] = useState("");
    const [memberBirthClass, setMemberBirthClass] = useState("");

    //effect
    useEffect(()=>{
        loadMember();
    }, []);

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = memberNameValid && memberEmailValid && memberAddressValid 
                        && memberContactValid && memberBirthValid;
        return passCheck;
    },[memberNameValid,memberEmailValid,memberAddressValid,memberContactValid,memberBirthValid]);
    
    //callback
    const loadMember = useCallback(async ()=>{
        const response = await axios.get("/member/mypage");
        setEdit(response.data.memberDto);
    }, [member,edit]);
    const returnBack = useCallback(()=>{
        navigate(-1);
    },[]);
    const goMemberEdit = useCallback(async()=>{
        if(isAllValid === false) return;

        const response = await axios.put("/member/edit", edit);
        navigate("/member/mypage");
    
        // 알림 코드
        toast.success("개인 정보 수정 완료!");
    },[edit]);
    const changeEdit = useCallback((e)=>{
        setEdit({
            ...edit,
            [e.target.name]: e.target.value
        });
    },[edit]);

    // 형식검사
    const checkMemberName = useCallback(()=>{
        const regex = /^[가-힣]{2,7}$/;
        const valid = regex.test(edit.memberName);
        setMemberNameValid(valid);
        setMemberNameClass(valid ? "is-valid" : "is-invalid");
    },[edit]);
    const checkMemberEmail = useCallback(()=>{
        const regex = /^.+/;
        const valid = regex.test(edit.memberEmail);
        setMemberEmailValid(valid);
        setMemberEmailClass(valid ? "is-valid" : "is-invalid");
    },[edit]);
    const checkMemberAddress = useCallback(()=>{
        const check1 = (!edit.memberPost || edit.memberPost.length === 0) && 
                       (!edit.memberAddress1 || edit.memberAddress1.length === 0) && 
                       (!edit.memberAddress2 || edit.memberAddress2.length === 0);
    
        const check2 = (edit.memberPost && edit.memberPost.length > 0) && 
                       (edit.memberAddress1 && edit.memberAddress1.length > 0) && 
                       (edit.memberAddress2 && edit.memberAddress2.length > 0);
    
        const valid = check1 || check2;
        setMemberAddressValid(valid);
        if(check1) setMemberAddressClass("");
        else setMemberAddressClass(valid ? "is-valid" : "is-invalid");
    }, [edit]);
    const checkMemberContact = useCallback(()=>{
        const regex = /^010[1-9][0-9]{6,7}$/;
        const valid = regex.test(edit.memberContact) || edit.memberContact === null;
        setMemberContactValid(valid);
        if(edit.memberContact === null) setMemberContactClass("");
        else setMemberContactClass(valid ? "is-valid" : "is-invalid");
    },[edit]);
    const checkMemberBirth = useCallback(()=>{
        const regex = /^(1[0-9]{3}|20([01][0-9]|2[0-9]))-(02-(0[1-9]|1[0-9]|2[0-8])|(0[469]|11)-(0[1-9]|1[0-9]|2[0-9]|30)|(0[13578]|1[02])-(0[1-9]|1[0-9]|2[0-9]|3[01]))$/;
        const valid = regex.test(edit.memberBirth) || edit.memberBirth === null;
        setMemberBirthValid(valid);
        if(edit.memberBirth === null) setMemberBirthClass("");
        else setMemberBirthClass(valid ? "is-valid" : "is-invalid");
    },[edit]);

    // view
    return(
        <>
            <Jumbotron title={`${member.memberId} 님의 정보`} content="개인 정보 수정" />
            
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">이름<FaAsterisk className="text-danger" /></div>
                <div className="col-5 ps-1">
                    <input type="text" className={"form-control "+memberNameClass} placeholder="이름"
                        name="memberName" value={edit.memberName} onChange={changeEdit} onBlur={checkMemberName} onFocus={checkMemberName} />
                    <div className="valid-feedback">좋은 이름이네요!</div>
                    <div className="invalid-feedback">한글 2~7자 제한(모음,자음 불가)</div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">이메일<FaAsterisk className="text-danger" /></div>
                <div className="col-5 ps-1">
                    <input type="email" className={"form-control "+memberEmailClass} placeholder="이메일"
                        name="memberEmail" value={edit.memberEmail} onChange={changeEdit} onBlur={checkMemberEmail} onFocus={checkMemberEmail} />
                    <div className="valid-feedback">좋은 이메일이에요!</div>
                    <div className="invalid-feedback">이메일 형식을 지켜주세요(미입력 불가)</div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3">주소</div>
                <div className="col-5 ps-1">
                        <input type="text" className={"form-control w-auto "+memberAddressClass} placeholder="우편번호"
                            name="memberPost" value={edit.memberPost} onChange={changeEdit} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                        <input type="text" className={"form-control "+memberAddressClass} placeholder="기본주소"
                            name="memberAddress1" value={edit.memberAddress1} onChange={changeEdit} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                        <input type="text" className={"form-control "+memberAddressClass} placeholder="상세주소"
                            name="memberAddress2" value={edit.memberAddress2} onChange={changeEdit} onBlur={checkMemberAddress} onFocus={checkMemberAddress} />
                        <div className="valid-feedback">좋은 곳에 사시는군요!</div>
                        <div className="invalid-feedback">모두 입력하거나 모두 비워주세요</div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">전화번호</div>
                <div className="col-5 ps-1">
                    <input type="tel" className={"form-control "+memberContactClass} placeholder="전화번호"
                        name="memberContact" value={edit.memberContact} onChange={changeEdit} onBlur={checkMemberContact} onFocus={checkMemberContact} />
                    <div className="valid-feedback">좋은 전화번호에요!</div>
                    <div className="invalid-feedback">전화번호 형식에 맞지 않네요(ex:01012345678)</div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">생년월일</div>
                <div className="col-5 ps-1">
                    <input type="date" className={"form-control "+memberBirthClass} placeholder="생년월일"
                        name="memberBirth" value={edit.memberBirth} onChange={changeEdit} onBlur={checkMemberBirth} onFocus={checkMemberBirth} />
                    <div className="valid-feedback">좋은 날에 태어나셨네요!</div>
                    <div className="invalid-feedback">날짜를 선택 및 입력해주세요</div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">포인트</div>
                <div className="col-5">{edit.memberPoint} (수정불가)</div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">가입일</div>
                <div className="col-5">{edit.memberJoin} (수정불가)</div>
            </div>
            <div className="row mt-3">
                <div className="col-3 d-flex align-items-center">최근접속</div>
                <div className="col-5">{edit.memberLogin} (수정불가)</div>
            </div>

            <div className="row mt-4 text-end">
                <div className="col mt-4">
                    <button className="btn btn-danger me-3" onClick={returnBack}>
                        돌아가기
                    </button>
                    <button className="btn btn-success" onClick={goMemberEdit} disabled={isAllValid === false} >
                        수정하기
                    </button>
                </div>
            </div>
            
        </>
    );

};

export default MemberEdit;