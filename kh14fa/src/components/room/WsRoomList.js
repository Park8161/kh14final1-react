import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilValue } from "recoil";
import { loginState, memberIdState, memberLevelState, memberLoadingState } from "../../utils/recoil";
import moment from "moment";
import { NavLink } from 'react-router-dom';
import PacmanLoader from "react-spinners/PacmanLoader";

const WsRoomList = ()=>{

    // state
    const [client, setClient] = useState(null);
    const [connect, setConnect] = useState(false);
    const location = useLocation();
    const [roomList, setRoomList] = useState([]);
    const [load, setLoad] = useState(false);
   

    // recoil
    const login = useRecoilValue(loginState);
    const memberId = useRecoilValue(memberIdState);
    const memberLoading = useRecoilValue(memberLoadingState);

    // token
    const accessToken = axios.defaults.headers.common["Authorization"];
    const refreshToken = window.localStorage.getItem("refreshToken")
                                    || window.sessionStorage.getItem("refreshToken");

    

    useEffect(() => {
        if(memberLoading === false) return;
             loadRoomList(); // 방 목록 로딩             
    },[memberLoading]);

    useEffect(()=>{
            if(roomList.length === 0) return;
            
            const client = connectToServer();
                    setClient(client);
            return () => {
                disconnectFromServer(client);
            };       
    },[memberLoading, location.pathname, roomList]);

     // callback
     const loadRoomList = useCallback(async ()=>{
        const resp = await axios.get("/room/");
        setRoomList(resp.data);
        setLoad(true);
    },[]);
    
    const connectToServer = useCallback(()=>{
        
        // 소켓 연결 생성
        const socket = new SockJS(process.env.REACT_APP_BASE_URL+"/ws");
        // STOMP로 업그레이드
        const client = new Client({
            webSocketFactory: ()=>socket,
            connectHeaders:{
                accessToken : accessToken,
                refreshToken : refreshToken
            },
            // 연결 되었을때 할일 
            onConnect:()=>{
            roomList.forEach(room => {
                client.subscribe(`/private/chat/${room.roomNo}`, (message) => {
                    const data = JSON.parse(message.body);
                    
                    setRoomList(prevRoomList => 
                        prevRoomList.map(r => 
                            r.roomNo === room.roomNo ? { ...r,
                                roomMessageContent: data.content,
                                roomMessageTime: data.time,
                                unreadCnt : r.unreadCnt +1
                             } : r));
                });
            });
            },
            // 연결이 사라졌을 때 할일 
            onDisconnect:()=>{
                setConnect(false);
            },
            debug:(str)=>{
                // console.log(str);
            }
        });
        client.activate();
        return client;
    },[memberLoading, roomList]);

    const disconnectFromServer = useCallback((client)=>{
        if(client){
            client.deactivate();
        }
    },[]);

    if(load === true && roomList.length > 0){
        return (
            <>          
            <div className="container row">
                <div className="col">
                    <h4>채팅 목록</h4>
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
                                                            <>
                                                            <p className="text-muted small my-2 mb-0">{room.roomMessageContent}</p>
                                                            {moment(room.roomMessageTime).isAfter(moment().startOf('day')) ? (
                                                                <p className="text-muted small mt-2 mb-0">{moment(room.roomMessageTime).format("a h:mm")}</p>
                                                            ) : (
                                                                <p className="text-muted small mt-2 mb-0">{moment(room.roomMessageTime).format("YYYY-MM-DD h:mm")}</p>
                                                            )}
                                                            </>
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
                                                  
                                            </div>
                                        </NavLink>
                                    ))}
                                </ul>
                            </div>
                        </div>
                </div>
            </div>
            </>
        );
    }
    else if(load === true && roomList.length === 0){
        return(<>
        <div className="text-center text-muted mt-5 d-flex align-items-center justify-content-center" 
                             style={{ maxHeight: '500px', minHeight: '500px' }}>
            <div>
                <i className="bi bi-chat-slash fs-1 mb-3"></i>
                <p>참여중인 채팅방이 없습니다</p>
            </div>
        </div>
        </>);
    }
    else if(load === false){
        return(<>
        <div className="text-center text-muted mt-5 d-flex align-items-center justify-content-center" 
                             style={{ maxHeight: '500px', minHeight: '500px' }}>
            <div>
                <i className="bi bi-chat-slash fs-1 mb-3"></i>
                <p>채팅방 목록을 불러오고 있습니다</p>
                <PacmanLoader/>
            </div>
        </div>
        </>);
    }
    
};

export default WsRoomList;