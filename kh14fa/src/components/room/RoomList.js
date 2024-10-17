import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginState, memberIdState } from '../../utils/recoil';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

const RoomList = ()=>{
    const navigate = useNavigate();

    // state
    const[roomList, setRoomList] = useState([]);
    const [input, setInput] = useState({roomName:""});

    //recoil
    const login = useRecoilValue(loginState);
    const memberId = useRecoilValue(memberIdState);
    
    //effect
    useEffect(()=>{
        loadRoomList();
    },[])

    // callback
    const loadRoomList = useCallback(async ()=>{
        const resp = await axios.get("/room/"+memberId);
        console.log("/room/"+memberId);
        setRoomList(resp.data);
    },[roomList]);

    const changeInput = useCallback(e=>{
        //setInput({ roomName : e.target.value});
        setInput({ [e.target.name] : e.target.value });
    }, [input]);

    const saveInput = useCallback(async ()=>{
        const resp = await axios.post("/room/", input);
        loadRoomList();
        setInput({roomName:""});
    }, [input]);

    const enterRoom = useCallback(async (target)=>{
        await axios.post("/room/enter", {roomNo:target.roomNo});
        navigate("/chatroom/"+target.roomNo);
    },[roomList]);

    return(<>

          {/* 방 생성 화면 */}
          <div className="row mt-4">
            <div className="col">
                <div className="input-group">
                    {/* useParam 을 통해 판매자 아이디 받는 방식으로 처리예정 */}
                    <input type="text" name="roomName" className="form-control"
                                value={input.roomName} onChange={changeInput}/>
                    <button className="btn btn-primary"
                                onClick={saveInput}>
                        등록
                    </button>
                </div>
            </div>
        </div>
            <h1>채팅방 목록</h1>
        <div>
            {roomList.length > 0 ?(
                 <div className="row mt-4">
                 <div className="col">
                     <ul className="list-group list-group-flush">
                         {roomList.map(room=>(
                             <li className="list-group-item">
                                 {room.roomName}
                             </li>
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