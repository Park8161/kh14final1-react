import { useCallback, useEffect, useRef, useState } from "react";
import Jumbotron from "../Jumbotron";
import axios from "axios";
import { NavLink } from "react-router-dom";

const MyPage = ()=>{
    //state
    const [member, setMember] = useState({});
    const [block, setBlock] = useState({});
    const [product, setProduct] = useState({});
    
    //effect
    useEffect(()=>{
        loadMember();
    }, []);

    //callback
    const loadMember = useCallback(async ()=>{
        const response = await axios.get("/member/mypage");
        setMember(response.data.memberDto);
        setBlock(response.data.blockDto);
        setProduct(response.data.productDto);
    }, [member, block, product]);

    return (<>
        <Jumbotron title={`${member.memberId} 님의 정보`}/>

        <div className="row mt-4">
            <div className="col-3">이름</div>
            <div className="col-3">{member.memberName}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">이메일</div>
            <div className="col-3">{member.memberEmail}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">주소</div>
            <div className="col-3">
                [{member.memberPost}] <br/>
                {member.memberAddress1} <br/>
                {member.memberAddress2} <br/>
            </div>
        </div>
        <div className="row mt-4">
            <div className="col-3">전화번호</div>
            <div className="col-3">{member.memberContact}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">생년월일</div>
            <div className="col-3">{member.memberBirth}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">포인트</div>
            <div className="col-3">{member.memberPoint}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">가입일</div>
            <div className="col-3">{member.memberJoin}</div>
        </div>
        <div className="row mt-4">
            <div className="col-3">최근접속</div>
            <div className="col-3">{member.memberLogin}</div>
        </div>

        <div className="row mt-4">
            <div className="col text-end">
                <NavLink className="btn btn-info me-3" to="/member/changepw">
                    비밀번호 변경
                </NavLink>
                <NavLink className="btn btn-info" to="/member/edit">
                    개인정보 수정
                </NavLink>
            </div>
        </div>
    </>);
};

export default MyPage;