import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../Jumbotron";
import { useNavigate, useParams } from "react-router-dom";  // useNavigate 추가

const AdminMemberDetail = () => {
    //parameter
    const { memberId } = useParams();

    //state
    const [member, setMember] = useState(null);
    const [load, setLoad] = useState(false);

    const navigate = useNavigate(); 

    //effect
    useEffect(() => {
        loadMember();
    }, [memberId]); // memberId가 변경될 때마다 데이터를 다시 로드하도록 설정

    //callback
    const loadMember = useCallback(async () => {
        try {
            const resp = await axios.get(`/admin/member/detail/${memberId}`);
            setMember(resp.data);
        } catch (e) {
            setMember(null);
        }
        setLoad(true);
    }, [memberId]);  // memberId를 의존성 배열에 추가하여 변경 시 호출되도록 설정

    //삭제 callback
    const deleteMember = useCallback(async () => {
        const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
        if(isConfirmed){
        try {
            await axios.delete(`/admin/member/${memberId}`);
            navigate("/Gykim94/admin/member/memberlist");
        } 
        catch (error) {
            console.error("삭제 실패", error);
        }
        } 
        else{
            console.log("삭제 취소");            
        }
    }, [memberId]);

    // 로딩 상태 처리
    if (!load) {
        return <div>회원 정보를 로딩 중...</div>;
    }

    // member가 null인 경우 처리
    if (!member) {
        return <div>회원 정보를 찾을 수 없습니다.</div>;
    }

    //view
    return (
        <>
            <Jumbotron title={memberId + "님의 상세정보"} />

            <div className="row mt-4">
                <div className="col-sm-3">회원 아이디</div>
                <div className="col-sm-9">{member.memberId}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">회원 이름</div>
                <div className="col-sm-9">{member.memberName}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">등급</div>
                <div className="col-sm-9">{member.memberLevel}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">연락처</div>
                <div className="col-sm-9">{member.memberContact}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">회원 이메일</div>
                <div className="col-sm-9">{member.memberEmail}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">회원 생년월일</div>
                <div className="col-sm-9">{member.memberBirth}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">회원 가입일</div>
                <div className="col-sm-9">{member.memberJoin}</div>
            </div>

            <div className="row mt-4">
                <div className="col-sm-3">회원 포인트</div>
                <div className="col-sm-9">{member.memberPoint}</div>
            </div>

            {/* 이동 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button type="button" className="btn btn-secondary"
                        onClick={() => navigate("/Gykim94/admin/member/memberlist")}>
                        목록보기
                    </button>
                    <button type="button" className="btn btn-warning ms-2"
                        onClick={() => navigate("/Gykim94/admin/member/edit/" + memberId)}>
                        수정하기
                    </button>
                    <button type="button" className="btn btn-danger ms-2"
                        onClick={deleteMember}>
                        삭제하기
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminMemberDetail;
