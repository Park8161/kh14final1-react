import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginState, memberIdState, memberLoadingState } from '../../utils/recoil';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

const RoomList = ()=>{
    const navigate = useNavigate();

    // state
    const [roomList, setRoomList] = useState([]);

    //recoil
    const memberId = useRecoilValue(memberIdState);
    const memberLoading = useRecoilValue(memberLoadingState);

    //effect
    useEffect(()=>{
        if(memberLoading === false) return;//로딩이 완료되지 않았다면 중지
        loadRoomList();
    },[memberLoading]);

    // callback
    const loadRoomList = useCallback(async ()=>{
        const resp = await axios.get("/room/");
        console.log("/room/"+memberId);
        setRoomList(resp.data);
    },[roomList]);

    return(<>          
            <h1>채팅방 목록</h1>
        <div>
            {roomList.length > 0 ?(
                 <div className="row mt-4">
                 <div className="col">
                     <ul className="list-group list-group-flush">
                         {roomList.map(room=>(
                                <NavLink to={"/chat/chatroom/"+room.roomNo}>
                             <li className="list-group-item">
                                 {room.roomName}
                             </li>
                                </NavLink>
                         ))}
                     </ul>
     
                 </div>
             </div>
            ):(
                <p>참여중인 채팅방이 없습니다</p>
            )}
        </div>
       
    </>);
};
export default RoomList;