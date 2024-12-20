// import
import { useCallback, useMemo, useState } from "react";
import Jumbotron from "../Jumbotron";
import { useNavigate } from "react-router";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import noPhoto from "../product/noPhoto.jpg";
import out from "../../style/out.png";

const MemberFindPw = ()=>{
    // navigate
    const navigate = useNavigate();

    // state
    const [input, setInput] = useState({
        memberId : "",
        memberEmail : ""
    });
    
    // memo
    const isEmpty = useMemo(()=>{
        const passcheck = input.memberId.length === 0 || input.memberEmail.length === 0;
        return passcheck;
    },[input]);

    // callback
    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    const returnBack = useCallback(()=>{
        navigate(-1);
    },[]);

    const sendEmail = useCallback(async()=>{
        try{
            if(isEmpty === true) return;
    
            const response = await axios.get(`/member/memberId/${input.memberId}/memberEmail/${input.memberEmail}`);
    
            toast.info("이메일 발송 완료!");
        }
        catch(e){
            toast.error("정보 불일치!");
        }
    },[input]);

    // view
    return(
        <>
            {/* <Jumbotron title="비밀번호 찾기" content="비밀번호를 찾고자 하는 아이디와 이메일을 입력해주세요" /> */}
            
            <div className="row mt-4">
                <div className="col-4 offset-4 border">
                    
                    <div className="row mt-4">
                        <div className="col mt-4 text-center">
                            <img src={out} className="rounded-circle" style={{width:"250px",height:"250px"}} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                아이디
                            </label>
                            <input type="text" className="form-control" placeholder="아이디 입력"
                                name="memberId" value={input.memberId} onChange={changeInput} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <label>
                                이메일
                            </label>
                            <input type="text" className="form-control" placeholder="이메일 입력"
                                name="memberEmail" value={input.memberEmail} onChange={changeInput} />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <Jumbotron title=" " content="이메일에 첨부된 링크로 접속 후 비밀번호 재설정 가능해요" />
                        </div>
                    </div>

                    <div className="row mt-4 mb-4 text-end">
                        <div className="col">
                            <button className="btn btn-danger me-3" onClick={returnBack}>
                                돌아가기
                            </button>
                            <button className="btn btn-success" onClick={sendEmail} disabled={isEmpty === true} >
                                이메일 전송
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default MemberFindPw;