//import
import { useCallback, useEffect, useMemo, useState } from "react";
import Jumbotron from "../../Jumbotron";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FaAsterisk } from "react-icons/fa6";

const AdminMemberEdit = ()=>{
    // navigate
    const navigate = useNavigate();
    
    const {memberId} = useParams();

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
        memberPoint : 0,
        memberJoin : "",
        memberLogin : "",
    });

    // 정규표현식 검사 목적 state
    const [memberNameValid, setMemberNameValid] = useState(true);
    const [memberEmailValid, setMemberEmailValid] = useState(true);
    const [memberAddressValid, setMemberAddressValid] = useState(true);
    const [memberContactValid, setMemberContactValid] = useState(true);
    const [memberBirthValid, setMemberBirthValid] = useState(true);
    const [memberPointValid, setMemberPointValid] = useState(true);
    const [memberNameClass, setMemberNameClass] = useState("");
    const [memberEmailClass, setMemberEmailClass] = useState("");
    const [memberContactClass, setMemberContactClass] = useState("");
    const [memberBirthClass, setMemberBirthClass] = useState("");
    const [memberPointClass, setMemberPointClass] = useState("");

    //effect
    useEffect(()=>{
        loadMember();
    }, []);

    // memo
    const isAllValid = useMemo(()=>{
        const passCheck = memberNameValid && memberEmailValid && memberAddressValid 
                        && memberContactValid && memberBirthValid && memberPointValid;
        return passCheck;
    },[memberNameValid,memberEmailValid,memberAddressValid,memberContactValid,memberBirthValid, memberPointValid]);
    
    //callback
    const loadMember = useCallback(async ()=>{
        // console.log(memberId);
        const response = await axios.get("/admin/member/detail/" + memberId);
        setEdit({
            ...response.data,
            memberContact : response.data.memberContact || "",
            memberBirth: response.data.memberBirth || ""
        });
    }, [memberId]);
    const returnBack = useCallback(()=>{
        navigate(-1);
    },[]);
    const goMemberEdit = useCallback(async()=>{
        if(isAllValid === false) return;

        const { memberJoin, memberLogin, ...updateData } = edit;
        const response = await axios.put("/admin/member/edit", updateData);
        navigate(`/admin/member/detail/${memberId}`);
    
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
    const checkMemberPoint = useCallback(()=>{
        const valid = edit.memberPoint >= 0;
        setMemberPointValid(valid);
        if(edit.memberPoint === null) setMemberPointClass("");
        else setMemberPointClass(valid ? "is-valid" : "is-invalid");
    },[edit])
    // view
    return(
        <>
            {/* <Jumbotron title={member.memberId + "님의 개인정보 수정"}/> */}
            
            <div className="row mt-4">
                <div className="col-6 offset-3">

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

                    <div className="row mt-5">
                    
                    <div className="col-3 d-flex align-items-center">회원등급</div>
                        <div className="col-5 ps-1">
                        <select name="memberLevel" className="form-select"
                                    value={edit.memberLevel}
                                    onChange={changeEdit}>
                            <option value="">선택하세요</option>
                            <option>일반회원</option>
                            <option>인증회원</option>
                            <option>안전회원</option>
                            <option>관리자</option>
                        </select>
                        </div>
                </div>
                    <div className="row mt-3">
                        <div className="col-3 d-flex align-items-center">포인트</div>
                        <div className="col-5 ps-1">
                            <input type="number" className={"form-control "+memberPointClass} name="memberPoint"
                            value={edit.memberPoint} onChange={changeEdit} onBlur={checkMemberPoint} onFocus={checkMemberPoint} />
                            <div className="invalid-feedback">0 이상 숫자만 입력 가능</div>
                        </div>
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
                </div>
            </div>
            
            
           
        </>
    );

};

export default AdminMemberEdit;