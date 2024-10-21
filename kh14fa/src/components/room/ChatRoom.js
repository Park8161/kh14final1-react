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
    const [client, setClient] = useState(null);
    const [connect, setConnect] = useState(false);
    const [productInfo, setProductInfo] = useState();

    // recoil
    const login = useRecoilValue(loginState);
    const memberId = useRecoilValue(memberIdState);
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

    //상품정보 추출
    const getProductInfo = useCallback(async()=>{
        try {
            const resp = await axios.get("/room/productInfo/" + roomNo); // Awaiting the promise
            setProductInfo(resp.data);
            console.log("productInfo: ", resp.data); // Now this will log the actual product info
        } catch (error) {
            console.error("Error fetching product info:", error);
        }
    },[ roomNo]);

    const leaveRoom = useCallback(()=>{
        if(window.confirm("채팅방을 나가겠습니까?")){
            const resp = axios.post("/room/leave", {roomNo : roomNo});
            navigate("/chat/roomlist");
            console.log("resp.data: "+resp.data);
        }
        else{}
    },[]);


    return(
        <>
        <h1>
        {roomNo}번 채팅방
        </h1>

        <Jumbotron title="웹소켓 클라이언트(삭제예정)" 
                content={"현재 연결 상태 = " + (connect ? "연결됨" : "종료됨")}/>
    
        <div>
            {/* 메세지 목록 */}
            <div className="col-9">
                
                <ul className="list-group">

                    <li className="list-group-item">
                        <button type="button" className="btn"
                        onClick={leaveRoom}>나가기</button>
                        <button type="button" className="btn"
                        onClick={getProductInfo}>구매하기</button>
                    </li>

                    {messageList.map((message, index)=>(
                    <li className="list-group-item" key={index}>
                     
                        <div className="row">
                            <div className={`col-5${(login && memberId === message.senderMemberId) && 'offset-7 bg-light'}`}>
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
                                <div className="">
                                {message.content}
                                </div>
                                {/* 시간 */}
                                <p className="text-muted">
                                    {moment(message.time).format("a h:mm")}
                                    {/* ({moment(message.time).fromNow()}) */}
                                </p>
                            </div>
                        </div>
                        
                        
                        {message.type === "system" && (<></>)}
                         
                    </li>
                    ))}
               
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

                </ul>
            </div>
        </div>
    

       
    </>
    );
    

};

export default ChatRoom;