import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginState, memberIdState, memberLoadingState } from '../../utils/recoil';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import moment from "moment";

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
        setRoomList(resp.data);
        
    },[roomList]);

    return (
        <>          
        <div className="container row">
            <div className="col">
                <h4>채팅 목록</h4>
                {roomList.length > 0 ? (
                    <div className="row mt-4 d-flex justify-content-center">
                        <div className="col-md-8">
                            <ul className="list-group" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {roomList.map((room) => (
                                    <NavLink 
                                        to={`/chat/chatroom/${room.roomNo}`} 
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 p-3"
                                        key={room.roomNo}
                                        style={{ borderRadius: "8px", transition: "all 0.3s ease",
                                            border: '1px solid #ccc', // 테두리 추가
                                            padding: '10px' 
                                         }}>
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-1 text-dark">
                                                <h6 className="mb-0">{room.memberId}</h6>
                                                <p className="text-muted small mb-0 mx-2">|</p> 
                                                <p className="text-muted small mb-0">{room.productName}</p>
                                            </div>
                                            <div className="row d-flex justify-content-between align-items-center" style={{ minHeight: '1.5em' }}> 
                                                <div className="col-10">
                                                    {room.roomMessageContent ? (
                                                        <p className="text-muted small my-2 mb-0">{room.roomMessageContent}</p>
                                                    ) : (
                                                        <p className="text-muted small my-2 mb-0" style={{ visibility: 'hidden' }}>
                                                            {/* Placeholder to maintain spacing */}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="col-2 d-flex justify-content-end">
                                                    {room.unreadCnt === 0 ? (
                                                        <></>
                                                    ) : (
                                                        <p className="small mb-0 badge bg-primary">{room.unreadCnt}</p>
                                                    )}
                                                </div>
                                            </div>  
                                            {moment(room.roomMessageTime).isAfter(moment().startOf('day')) ? (
                                                <p className="text-muted small mt-2 mb-0">{moment(room.roomMessageTime).format("a h:mm")}</p>
                                            ) : (
                                                <p className="text-muted small mt-2 mb-0">{moment(room.roomMessageTime).format("YYYY-MM-DD h:mm")}</p>
                                            )}
                                        </div>
                                    </NavLink>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted mt-5 d-flex align-items-center justify-content-center" 
                         style={{ maxHeight: '500px', minHeight: '500px' }}>
                        <div>
                            <i className="bi bi-chat-slash fs-1 mb-3"></i>
                            <p>참여중인 채팅방이 없습니다</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
    
        


};
export default RoomList;