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
        setRoomList(resp.data);
        
    },[roomList]);

    return (
        <>          
        <div className="container">
            <h4>채팅 목록</h4>
            <div>
                {roomList.length > 0 ? (
                    <div className="row mt-4 d-flex justify-content-center">
                        <div className="col-md-8">
                            <ul className="list-group">
                                {roomList.map((room) => (
                                    <NavLink 
                                        to={`/chat/chatroom/${room.roomNo}`} 
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 p-3"
                                        key={room.roomNo}
                                        style={{ borderRadius: "8px", transition: "all 0.3s ease" }}
                                    >
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-1 text-dark">
                                                {/* {memberId !== room.productMember ? (
                                                    <h6 className="mb-0">{room.productMember}</h6>)
                                                : (
                                                    <h6>구매자</h6>
                                                )
                                                } */}
                                                <p className="text-muted small mb-0 ml-auto">{room.productName}</p>
                                            </div>
                                            <div style={{ minHeight: '1.5em' }}> {/* 최소 높이 설정 */}
                                                {room.roomMessageContent ? (
                                                    <p className="text-muted small my-2">{room.roomMessageContent}</p>
                                                ) : (
                                                    <p className="text-muted small my-2" style={{ visibility: 'hidden' }}>
                                                        {/* 빈 공간을 유지하기 위한 요소 */}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-muted mt-5">
                        <i className="bi bi-chat-slash fs-1 mb-3"></i>
                        <p>참여중인 채팅방이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
    
        


};
export default RoomList;