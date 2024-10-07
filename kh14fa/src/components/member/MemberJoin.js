// import
import {useState, useMemo, useCallback} from "react";
import Jumbotron from "../Jumbotron";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import { FaAsterisk } from "react-icons/fa6";

// component
const MemberJoin = ()=>{
    // navigator
    const navigate = useNavigate();
    const [memberPwCheck, setMemberPwCheck] = useState();

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

    // callback
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    },[input]);

    const Return = useCallback(()=>{
        navigate("/");
    },[]);

    const MemberJoin = useCallback(async()=>{

        // 등록
        const response = await axios.post("http://localhost:8080/member/join",input);
        navigate("/");
    
        // 알림 코드
        toast.success("회원 가입 완료!");
    },[input]);

    // view
    return(
        <>
            <Jumbotron title="신규 회원 가입" />

            <div className="row mt-4">
                <div className="col">
                    <label>
                        아이디<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberId} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        비밀번호<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberPw} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        비밀번호 확인<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={memberPwCheck} onChange={e=>setMemberPwCheck(e.target.value)} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        이름<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberName} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        이메일<FaAsterisk className="text-danger" />
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberEmail} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        우편번호
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberPost} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        기본주소
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberAddress1} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        상세주소
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberAddress2} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        전화번호
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberContact} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <label>
                        생년월일
                    </label>
                    <input type="text" className="form-control" placeholder="아이디"
                        name="memberId" value={input.memberBirth} onChange={changeInput} />
                </div>
            </div>

            <div className="row mt-4 text-end">
                <div className="col mt-4">
                    <button className="btn btn-danger me-3" onClick={Return}>
                        돌아가기
                    </button>
                    <button className="btn btn-success" onClick={MemberJoin}>
                        가입하기
                    </button>
                </div>
            </div>

        </>
    );
};

export default MemberJoin;