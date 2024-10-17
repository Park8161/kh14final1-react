import { useCallback, useEffect, useState } from "react";
import Jumbotron from "../../Jumbotron";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const AdminMemberList = ()=> {
    //state
    const [memberList, setMemberList] = useState([]); // 목록

    //검색 state
    const [column, setColumn] = useState("member_id");
    const [keyword, setKeyword] = useState("");
       

    //effect
    useEffect(()=>{
        loadMemberList();
    }, []);

    //callback

    //목록 조회 callback
    const loadMemberList = useCallback(async () => {      
        const resp = await axios.get("/admin/member/");
        setMemberList(resp.data);      
    }, []);

    //검색 callback
    const searchMemberList = useCallback(async()=>{
        if(keyword.trim().length === 0){
            loadMemberList();
            return;
        }

        const encodeKeyword = encodeURIComponent(keyword);
        
        const response = await axios.get(`/admin/member/column/${column}/keyword/${encodeURIComponent(keyword)}`);
        setMemberList(response.data);
    }, [column, keyword, memberList]);

    return(<>

        <Jumbotron title="관리자 회원관리 목록"/>

        {/* 검색창 */}
        <div className="row mt-2">
            <div className="col-md-6 offset-md-3">
                <div className="input-group">
                    
                    <select name="column" className="form-select w-auto"
                            value={column} onChange={e=>setColumn(e.target.value)}>
                        <option value="member_id">회원 아이디</option>
                        <option value="member_name">회원 이름</option>
                        <option value="member_level">등급</option>
                    </select>

                    <input type="text" className="form-control w-auto"
                            value={keyword} onChange={e=>setKeyword(e.target.value)}/>
                    
                    <button type="button" className="btn btn-secondary"
                                onClick={searchMemberList}>
                        <FaMagnifyingGlass /> 검색       
                    </button>
                </div>
            </div>
        </div>



        {/* 목록 출력 */}
        <div className="row mt-4">
            <div className="col">
                <table className="table table-striped">

                    <thead>
                        <th>회원 아이디</th>
                        <th>회원 이름</th>
                        <th>등급</th>
                        <th>포인트</th>
                        <th>최근 로그인</th>
                    </thead>
                    <tbody>
                        {memberList.map(member =>(
                            <tr key={member.memberId}>
                                <td>
                                    <NavLink to ={"/admin/member/detail/"+member.memberId}>
                                        {member.memberId}
                                    </NavLink>
                                </td>
                                <td>{member.memberName}</td>
                                <td>{member.memberLevel}</td>
                                <td>{member.memberPoint}</td>
                                <td>{member.memberLogin}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>


    </>);
};
export default AdminMemberList;