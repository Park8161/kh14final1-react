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
        if (isConfirmed) {
            try {
                console.log(`삭제 요청 경로: /admin/member/detail/${memberId}`);
                await axios.delete(`/admin/member/${memberId}`);
                navigate("/admin/member/memberlist");
            } catch (error) {
                // 서버 오류 처리
                if (error.response) {
                    // 서버 응답이 있는 경우
                    console.error("삭제 실패: ", error.response.data);
                    alert(`삭제 실패: ${error.response.data.message || "알 수 없는 오류"}`);
                } else if (error.request) {
                    // 요청이 보내졌으나 응답이 없는 경우
                    console.error("응답 없음: ", error.request);
                    alert("서버와 연결할 수 없습니다.");
                } else {
                    // 요청을 설정하는 중에 오류가 발생한 경우
                    console.error("요청 설정 오류: ", error.message);
                    alert("삭제 요청을 처리하는 중 오류가 발생했습니다.");
                }
            }
        } else {
            console.log("삭제 취소");
        }
    }, [member, memberId]);

    // 차단 callback
const blockMember = useCallback(async () => {
    const isConfirmed = window.confirm("정말 차단하시겠습니까?");
    if (isConfirmed) {
        try {            
            const banDto = {
                banTarget: memberId,
                banType: '차단',
                banMemo: '운영진에 의한 계정 차단',
                banTime: new Date().toISOString()
            };

            await axios.post("/admin/member/bann", banDto); 
            alert("회원이 차단되었습니다.");
            loadMember();
        } catch (error) {
            console.error("차단 실패", error.response || error.message);
            alert("차단 실패: 서버에 문제가 발생했습니다.");
        }
    } else {
        console.log("차단 취소");
    }
}, [memberId, loadMember]);

   // 차단 해제 callback
const unblockMember = useCallback(async () => {
    const isConfirmed = window.confirm("차단을 해제하시겠습니까?");
    if (isConfirmed) {
        try {            
            const banDto = {
                banTarget: memberId,
                banType: '해제',
                banMemo: '운영진에 의한 차단 해제',
                banTime: new Date().toISOString()
            };

            await axios.post("/admin/member/free", banDto);
            alert("회원 차단이 해제되었습니다.");
            loadMember();
        } catch (error) {
            console.error("차단 해제 실패", error.response || error.message);
            alert("차단 해제 실패: 서버에 문제가 발생했습니다.");
        }
    } else {
        console.log("차단 해제 취소");
    }
}, [memberId, loadMember]);

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
                        onClick={() => navigate("/admin/member/memberlist")}>
                        목록보기
                    </button>
                    <button type="button" className="btn btn-warning ms-2"
                        onClick={() => navigate("/admin/member/edit/" + memberId)}>
                        수정하기
                    </button>
                    <button type="button" className="btn btn-danger ms-2"
                        onClick={deleteMember}>
                        삭제하기
                    </button>
                    <button type="button" className="btn btn-danger ms-2"
                        onClick={blockMember}>
                        차단하기
                    </button>
                    <button type="button" className="btn btn-success ms-2"
                        onClick={unblockMember}>
                        차단 해제
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminMemberDetail;
