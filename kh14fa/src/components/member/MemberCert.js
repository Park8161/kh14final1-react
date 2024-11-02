// import
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Jumbotron from "../Jumbotron";
import { useRecoilState, useRecoilValue } from 'recoil';
import { memberLevelState } from "../../utils/recoil";
import { toast } from "react-toastify";

const MemberCert = ()=>{
    // navigate
    const navigate = useNavigate();

    // state
    const {memberEmail} = useParams(); // 인증번호 발송 메일
    const {memberReliability} = useParams(); // 신뢰지수
    const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
    const [certNumber, setCertNumber] = useState(null); // 인증번호

    // callback
    const sendCertNumber = useCallback(async()=>{
        const response = await axios.post("/cert/send/"+memberEmail);
        toast.success("인증번호 발송 완료");
    },[]);

    const checkCertNumber = useCallback(async()=>{
        const resp = await axios.post("/cert/check", {certEmail : memberEmail, certNumber : certNumber});
        // console.log(resp.data);
        if(resp.data === true){
            toast.success("인증번호 일치");
            if(memberReliability >= 75) setMemberLevel("안전회원");
            else setMemberLevel("인증회원");
            const response = await axios.patch("/member/patch", {memberLevel : memberLevel});
            navigate("/member/mypage");
        }
        else{
            toast.error("인증번호 일치");
        }
    },[certNumber,memberLevel]);

    const changeCertNumber = useCallback((e)=>{
        setCertNumber(
            [e.target.name] = e.target.value
        );
    },[certNumber]);


    return (
        <>
            {/* <Jumbotron title="이메일 인증 후 일반회원 -> 인증회원 등급 변환" /> */}
            
            <div className="row mt-4">
                <div className="col-4 mt-4 offset-4 border">

                {/* {memberLevel === '일반회원' ? (<> */}

                    <div className="row mt-4">
                        <div className="col">
                            <Jumbotron title=" " content=" " />
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <label>이메일 정보</label>
                            <input type="text" className="form-control" value={memberEmail} readOnly/>
                            <small className="text-muted ms-1">(이메일이 정확하지 않을 경우 개인 정보 수정을 통해 변경바랍니다)</small>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col">
                            <label>인증번호 입력</label>
                            <input type="text" className="form-control" name="certNumber" value={certNumber} onChange={changeCertNumber}/>
                        </div>
                    </div>
                    <div className="row mt-4 mb-3">
                        <div className="col">
                            <div className="row">
                                <div className="col-6 text-start">
                                    <button className="btn btn-primary" onClick={sendCertNumber}>인증번호 발송</button>
                                </div>
                                <div className="col-6 text-end">
                                    <button className="btn btn-secondary me-3" onClick={e=>navigate("/member/mypage")}>돌아가기</button>
                                    <button className="btn btn-info text-white" onClick={checkCertNumber}>인증하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </>) : (
                    <div className="row mt-4">
                        <div className="col text-center">
                            <h2>회원 등급이 일반회원인 회원만 이용 가능한 기능입니다</h2>
                            <h3>현재 회원의 등급 : <span className="text-danger">{memberLevel}</span></h3>
                            <button className="btn btn-secondary" onClick={e=>navigate("/member/mypage")}>돌아가기</button>
                        </div>
                    </div>
                )} */}

                </div>
            </div>

        </>
    );
};

export default MemberCert;