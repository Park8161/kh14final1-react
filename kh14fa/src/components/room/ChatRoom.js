import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilValue } from "recoil";
import { loginState, memberIdState, memberLevelState, memberLoadingState } from "../../utils/recoil";
import Jumbotron from "../Jumbotron";
import moment from "moment";

const ChatRoom = ()=>{

    // 방번호
    const {roomNo} = useParams();
    const navigate = useNavigate();
    
    // state
    const [input, setInput] = useState("");
    const [messageList, setMessageList] = useState([]); 
    const [userList, setUserList] = useState([]);
    const [client, setClient] = useState(null);
    const [connect, setConnect] = useState(false);

    // recoil
    const login = useRecoilValue(loginState);
    const memberId = useRecoilValue(memberIdState);
    const memberLevel = useRecoilValue(memberLevelState);
    const memberLoading = useRecoilValue(memberLoadingState);

    // token
    const accessToken = axios.defaults.headers.common["Authorization"];
    const refreshToken = window.localStorage.getItem("refreshToken")
                                    || window.sessionStorage.getItem("refreshToken");

    //effect
    const location = useLocation();

    useEffect(()=>{
        if(memberLoading === false) return;

        // checkRoom();

        const client = connectToServer();
        setClient(client);
        return()=>{
            disconnectFromServer(client);
        };
    },[location.pathname, memberLoading]);

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
            onConnect:()=>{
                client.subscribe(`/private/chat/${roomNo}`, (message)=>{
                    const data = JSON.parse(message.body);
                    setMessageList(prev=>[...prev, data]);
                });
                client.subscribe(`/private/user/${roomNo}`,(message)=>{});
                client.subscribe(`/private/dm/${roomNo}/${memberId}`,(message)=>{})
                client.subscribe(`/private/db/${roomNo}/${memberId}`,(message)=>{
                    const data = JSON.parse(message.body);
                    setMessageList(data.messageList);
                });

                setConnect(true);
                console.log(connect);
            },
            onDisconnect:()=>{
                setConnect(false);
            },
            debug:(str)=>{
                console.log(str);
            }
        });
        client.activate();
        return client;
    },[memberLoading]);

    const disconnectFromServer = useCallback((client)=>{
        if(client){
            client.deactivate();
        }
    },[]);

    const sendMessage = useCallback(()=>{
        if(client === null) return;
        if(connect === false) return;
        if(input.length === 0) return;
        
        client.publish({
            destination : "/app/room/"+roomNo,
            headers:{
                accessToken : accessToken,
                refreshToken : refreshToken
            },
            body: JSON.stringify({content: input})
        });
        setInput("");
    },[input, client, connect]);

    // const checkRoom = useCallback(async()=>{

    // })

    return(
        <>
        <h1>
        {roomNo}번 채팅방
        </h1>

        <Jumbotron title="웹소켓 클라이언트" 
                content={"현재 연결 상태 = " + (connect ? "연결됨" : "종료됨")}/>

        <div>

            <div className="row mt-4">
                <ul className="list-group">
                    {userList.map((user, index)=>(
                        <li className="list-group-item" key={index}>
                            {user === memberId ? user + "(나)" : user}
                        </li>
                    ))}
                </ul>
            </div>
            {/* 메세지 목록 */}
            <div className="col-9">
                
                <ul className="list-group">
                    {messageList.map((message, index)=>(
                    <li className="list-group-item" key={index}>

                        {/* 일반 채팅일 경우(type === chat) */}
                        {message.type === "chat" && (
                        <div className="row">
                            <div className={`col-5${(login && memberId === message.senderMemberId) && ' offset-7'}`}>
                                {/* 발신자 정보 */}
                                {(login && memberId !== message.senderMemberId) && (
                                <h3>
                                    {message.senderMemberId}
                                    <small>
                                        ({message.senderMemberLevel})
                                    </small>
                                </h3>
                                )}
                                {/* 사용자가 보낸 본문 */}
                                <p>{message.content}</p>
                                {/* 시간 */}
                                <p className="text-muted">
                                    {moment(message.time).format("a h:mm")}
                                    {/* ({moment(message.time).fromNow()}) */}
                                </p>
                            </div>
                        </div>
                        )}
                        {/* DM인 경우(type === dm) */}
                        {message.type === "dm" && (
                        <div className="row">
                            <div className={`col-5${(login && memberId === message.senderMemberId) && ' offset-7'}`}>
                                {/* 수신자일 경우 ooo님으로부터 온 메세지 형태로 출력 */}
                                {(memberId === message.receiverMemberId) && (
                                <h3 className="text-danger">
                                    {message.senderMemberId} 님으로 부터 온 메세지
                                </h3>
                                )}
                                {/* 발신자일 경우 ooo님에게 보낸 메세지 형태로 출력 */}
                                {(memberId === message.senderMemberId) && (
                                <h3 className="text-danger">
                                    {message.receiverMemberId} 님에게 보낸 메세지
                                </h3>
                                )}
                                
                                {/* 사용자가 보낸 본문 */}
                                <p className="text-danger">{message.content}</p>
                                {/* 시간 */}
                                <p className="text-muted">
                                    {moment(message.time).format("a h:mm")}
                                    {/* ({moment(message.time).fromNow()}) */}
                                </p>
                            </div>
                        </div>
                        )}

                        {message.type === "system" && (<></>)}

                    </li>
                    ))}
                </ul>

            </div>
        </div>
            <div className="row mt-4">
                <div className="col">
                    <div className="input-group">
                        <input type="text" value={input}
                            onChange={e=>setInput(e.target.value)}
                            onKeyUp={e=>e.key === 'Enter' && sendMessage()}
                            className="form-control"/>
                        <button className="btn btn-primary">보내기</button>
                    </div>
                </div>
            </div>

      

       
    </>
    );
    

};

export default ChatRoom;