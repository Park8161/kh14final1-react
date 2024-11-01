import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../Jumbotron";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";

const AdminMemberList = ()=> {
    // navigate
    const navigate = useNavigate();

    //state
    const [memberList, setMemberList] = useState([]); // 목록
    const [filteredMembers, setFilteredMembers] = useState([]); // 필터된 회원 목록

    //검색 state
    const [column, setColumn] = useState("member_id");
    const [keyword, setKeyword] = useState("");
       
    // 페이지 관련 state
    const [page, setPage] = useState(1); // 현재 페이지
    const [pageSize, setPageSize] = useState(10); // 한 페이지 당 항목 수

    //회원 목록 불러오기 effect
    useEffect(()=>{
        loadMemberList();
    }, []);
    
    
    //목록 조회 callback
    const loadMemberList = useCallback(async () => {      
        const resp = await axios.get("/admin/member/");
        setMemberList(resp.data);      
        setFilteredMembers(resp.data); // 초기 필터된 회원 목록도 전체로 설정
    }, []);

    //검색 callback
    const searchMemberList = useCallback(async()=>{
        if(keyword.trim().length === 0){
            setFilteredMembers(memberList); // 검색어가 없으면 전체 목록으로 복원
            setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
            // loadMemberList();
            return;
        }

        const encodeKeyword = encodeURIComponent(keyword);
        
        const response = await axios.get(`/admin/member/column/${column}/keyword/${encodeURIComponent(keyword)}`);
        // setMemberList(response.data);
        setFilteredMembers(response.data); //필터된 회원 목록 업데이트

        //검색 설정
        setPage(1); // 검색 시 첫 페이지로 돌아가도록 설정
        // setKeyword(""); // 검색 후 입력값 초기화
    }, [column, keyword, memberList]);

    // 페이지네이션 관리
    const getPagedMembers = useCallback(()=>{
        const startIndex = (page -1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredMembers.slice(startIndex, endIndex);
    }) ;

    return(<>

        {/* <Jumbotron title="관리자 회원관리 목록"/> */}

        {/* 검색창 */}
        <div className="row mt-4">
            <div className="col-md-6 offset-md-3">
                <div className="input-group">
                    <select name="column" className="form-select w-auto"
                            value={column} onChange={e=>setColumn(e.target.value)}>
                        <option value="member_id">회원 아이디</option>
                        <option value="member_name">회원 이름</option>
                        <option value="member_level">등급</option>
                    </select>
                    <input type="search" className="form-control w-auto" placeholder="검색어 입력"
                            value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                    <button type="button" className="btn btn-secondary" onClick={searchMemberList}>
                        <FaMagnifyingGlass /> 검색       
                    </button>
                </div>
            </div>
        </div>



        {/* 목록 출력 */}
        <div className="row mt-4">
            <div className="col-8 offset-2">
                <table className="table border table-hover table-no-borders text-center">
                    <thead className="border-bottom">
                        <th className="py-2">회원 아이디</th>
                        <th className="py-2">회원 이름</th>
                        <th className="py-2">등급</th>
                        <th className="py-2">포인트</th>
                        <th className="py-2">최근 로그인</th>
                    </thead>
                    <tbody>
                        {getPagedMembers().map(member =>(
                            <tr key={member.memberId} onClick={e=>navigate("/admin/member/detail/"+member.memberId)} style={{cursor:"pointer"}}>
                                <td>
                                    {member.memberId}
                                </td>
                                <td>{member.memberName}</td>
                                <td>{member.memberLevel}</td>
                                <td>{member.memberPoint}</td>
                                {member.memberLogin === null ? (
                                    <td>-</td>
                                ) : (
                                    <td>{member.memberLogin}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>

        {/* 페이징 */}
        <div className="row mt-4">
                <div className="col text-center">
                    <button
                        className="btn btn-outline-primary"
                        disabled={page === 1 || filteredMembers.length === 0}
                        onClick={() => setPage(page - 1)}>
                        이전
                    </button>
                    <span className="mx-3">Page {page} of {Math.ceil(filteredMembers.length / pageSize)}</span>
                    <button
                        className="btn btn-outline-primary"
                        disabled={page === Math.ceil(filteredMembers.length / pageSize)}
                        onClick={() => setPage(page + 1)}>
                        다음
                    </button>
                </div>
            </div>

    </>);
};
export default AdminMemberList;