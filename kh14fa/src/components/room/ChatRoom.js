import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useRecoilValue } from "recoil";
import { loginState, memberIdState, memberLevelState, memberLoadingState } from "../../utils/recoil";
import Jumbotron from "../Jumbotron";
import moment from "moment";
import { BsSend } from "react-icons/bs";

const ChatRoom = () => {

    // 방번호
    const { roomNo } = useParams();
    const navigate = useNavigate();


    // state
    const [input, setInput] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [client, setClient] = useState(null);
    const [connect, setConnect] = useState(false);
    const [productInfo, setProductInfo] = useState({});
    const messageEndRef = useRef(null);

    // @@파일첨부 추가코드 state
    //const [fileMessageList, setFileMessageList] = useState([]);
    const [target, setTarget] = useState([]);
    //파일 선택 Ref
    const inputFileRef = useRef(null);

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
    
    useEffect(() => {
        if (memberLoading === false) return;
        checkRoom();
        loadProductInfo();
        const client = connectToServer();
        setClient(client);
        return () => {
            disconnectFromServer(client);
        };
    }, [location.pathname, memberLoading]);

    // @@파일 첨부 추가 코드 - 사진 목록, client와 connect가 변경될때마다 목록 통신이 이루어짐
    useEffect(() => {
        loadFileImage();
    }, [client, connect])

    useEffect(()=>{
        if (messageEndRef.current) {
           messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
                    }
    },[messageList]);

    const connectToServer = useCallback(() => {
        // 소켓 연결 생성
        const socket = new SockJS(process.env.REACT_APP_BASE_URL + "/ws");
        // STOMP로 업그레이드
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            onConnect: () => {
                client.subscribe(`/private/chat/${roomNo}`, (message) => {
                    const data = JSON.parse(message.body);
                    setMessageList(prev => [...prev, data]);
                });
                client.subscribe(`/private/user/${roomNo}`, (message) => { });
                client.subscribe(`/private/db/${roomNo}/${memberId}`, (message) => {
                    const data = JSON.parse(message.body);
                    setMessageList(data);
                });

                // @@파일 첨부 추가 코드 - 파일 목록
                client.subscribe(`/private/chat/${roomNo}/fileList`, (fileMessageList) => {
                    const data = JSON.parse(fileMessageList.body);
                    //console.log(data);
                    setMessageList(prev => {
                        const newMessageList = [...prev]; // 기존 메시지 목록 복사
                        data.forEach(item => {
                            const newMessage = {
                                image: `${process.env.REACT_APP_BASE_URL}/attach/download/${item.image}`,
                                time: item.time,
                                senderMemberId: item.senderMemberId,
                                senderMemberLevel: item.senderMemberLevel,
                                type: item.type
                            };

                            // 목록 중복으로 불러와지는 문제 해결 위한 중복 검사 코드
                            // 고유 식별자 생성 - 시간 + 보낸 사용자를 묶은 메세지 아이디
                            const messageId = `${newMessage.time}-${newMessage.senderMemberId}`;

                            // 중복 검사 - 불러온 목록에 들어있는 시간과 아이디와 기존에 있던 목록 기록과 비교
                            const messageExists = newMessageList.some(msg => 
                                `${msg.time}-${msg.senderMemberId}` === messageId
                            );

                            if (!messageExists) {
                                newMessageList.push(newMessage); // 중복이 아닐 경우 추가
                            }
                        });

                        // 시간 순으로 정렬
                        newMessageList.sort((b, a) => new moment(b.time).valueOf() - moment(a.time).valueOf());
                        return newMessageList; // 업데이트된 메시지 목록 반환
                    });
                });

                // @@파일 첨부 추가 코드 - 전송된 파일 받는 곳
                client.subscribe(`/private/chat/${roomNo}/file`, (fileMessage) => {
                    // const data = JSON.parse(fileMessage.body);
                    // setFileMessageList(prev => [...prev, data]);
                    //updateMessageList({ ...data});
                    const data = JSON.parse(fileMessage.body);
                    //console.log(data);
                    //기존 messageList에 type이 file인 배열들을 추가함
                    const newMessage = {
                        image: `${process.env.REACT_APP_BASE_URL}/attach/download/${data.image}`,
                        time: data.time,
                        senderMemberId: data.senderMemberId,
                        senderMemberLevel: data.senderMemberLevel,
                        type: data.type
                    };
                    //setMessageList(prev => [...prev, newMessage]);
                });

                // 연결 시점? 에서 loadUnread
                // console.log("setUnread 전: "+roomNo);
                setUnreadZero(roomNo);
                setConnect(true);
            },
            onDisconnect: () => {
                setConnect(false);
            },
            // debug:(str)=>{
            //     console.log(str);
            // }
        });
        client.activate();
        return client;
    }, [memberLoading]);

    const disconnectFromServer = useCallback((client) => {
        if (client) {
            client.deactivate();
            setUnreadZero(roomNo);
        }
    }, []);

    const sendMessage = useCallback(() => {
        if (client === null) return;
        if (connect === false) return;
        if (input.length === 0) return;

        client.publish({
            destination: "/app/room/" + roomNo,
            headers: {
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            body: JSON.stringify({ content: input })
        });
        setInput("");
    }, [input, client, connect]);

    //상품정보 추출
    const loadProductInfo = useCallback(async () => {
        try {
            const resp = await axios.get("/room/productInfo/" + roomNo);
            setProductInfo(resp.data);
        } catch (error) {
        }
    }, [roomNo]);

    const leaveRoom = useCallback(async (roomNo) => {
        if (window.confirm("채팅방을 나가겠습니까?")) {
            const resp = axios.post("/room/leave", { roomNo: roomNo });
            navigate("/chat/roomlist");
        }
        else { }
    }, []);

    const setUnreadZero = useCallback(async (roomNo) => {
        axios.post("/room/setzero/" + roomNo);
    }, []);

    const checkRoom = useCallback(async ()=>{
        const resp = await axios.get("/room/check/"+roomNo);
        if(resp.data === false) {
            // replace는 기록에 남지 않도록 설정하는것(뒤로가기로 진입불가)
            navigate("/chat/roomlist", {replace:true});
        }
    }, [roomNo]);

    // @@파일 첨부 추가코드 - reutrn 전까지 전부
    // 파일 선택 변경 감지
    const changeTarget = useCallback(e => {
        if (e.target.type === "file") {
            const files = Array.from(e.target.files);
            setTarget({
                ...target,
                attachList: files
            });
        }
        else {
            setTarget({
                ...target,
                [e.target.name]: e.target.value
            });
        }
    }, [target]);

    // 파일 목록 통신 코드 
    const loadFileImage = useCallback(async () => {
        if (client === null) return;
        if (connect === false) return;

        // roomNo를 URL의 일부로 사용하여 요청
        const resp = await axios.get(`/room/imageList/${roomNo}`)

        if (resp.status === 200) {
            // 파일 업로드 성공 처리
            inputFileRef.current.value = "";
            //console.log("파일목록업데이트")
        } else {
            // 오류 처리
            console.error("파일 업로드 실패");
        }
    });

    // 전송 통신 코드
    const fileSend = useCallback(async () => {
        if (client === null) return;
        if (connect === false) return;

        //객체 생성, multipart/form-data 형식으로 전송해줌
        const formData = new FormData();
        const fileList = inputFileRef.current.files;
        for (let i = 0; i < fileList.length; i++) {
            formData.append("attachList", fileList[i]);
        }

        const resp = await axios.post(`/room/fileSend/${roomNo}`, formData, {
            headers: {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
        });
        if (resp.status === 200) {
            // 파일 업로드 성공 처리
            inputFileRef.current.value = ""
            //console.log("파일전송됨");
            loadFileImage();
        } else {
            // 오류 처리
            console.error("파일 업로드 실패");
        }
    }, [loadFileImage]);

    return (
        <>
            {/* <Jumbotron title="웹소켓 클라이언트(삭제예정)"
                content={"현재 연결 상태 = " + (connect ? "연결됨" : "종료됨")} /> */}

            
            <div className="d-flex justify-content-center">
        {/* 메세지 목록 */}
        <div className="col-9">
        {productInfo.productNo ? (
            <>
            <li className="list-group-item fs-5">
                {productInfo.productMember}
            </li>
            <li className="list-group-item">
            <div className="row align-items-center">
            <div className="col">
                <span className="text-muted">
                    {productInfo.productName} ({productInfo.productState})
                </span>
            </div>
            <div className="col-auto d-flex">
                {productInfo.productState === '판매중' ? (
                    <button type="button" className="btn btn-primary me-2" onClick={() => navigate("/Pay/paystart/" + productInfo.productNo)}>
                        구매하기
                    </button>
                ):(
                    <button type="button" className="btn btn-primary me-2" disabled={true}>
                        구매 불가 상태
                    </button>
                    )}
                <button type="button" className="btn btn-secondary" onClick={() => leaveRoom(roomNo)}>
                    나가기
                </button>
                </div>
            </div>
            <div className="font-weight-bold mt-2 mb-3">
                {productInfo.productPrice.toLocaleString()}원
            </div>
        </li>
            </>
    ) : (
            <div className="mt-1">
                <small className="col-6 fs-6">
                    상품정보가 없습니다.
                </small>
                        <div className="col-auto d-flex justify-content-end mb-3">
                            <button type="button" className="btn btn-secondary" onClick={() => leaveRoom(roomNo)}>
                                나가기
                            </button>
                        </div>
            </div>
        )}
        <ul className="list-group bg-light borderless"  ref={messageEndRef} 
            style={{maxHeight: '500px', minHeight: '500px', overflowY: 'auto', width:'100'}}>
            {/* @@파일첨부 추가 코드 - type으로 file / chat 으로 구분해서 나눔 */}
            {messageList.map((message, index) => (
                <li className="list-group-item bg-light border-0" key={index}>
            <div className={` ${login && memberId === message.senderMemberId ? 'text-end' : 'text-start'}`}>
            {/* 내가보낸 메시지일 경우 우측에서 출력 */}
                        {/* <div className={`${(login && memberId === message.senderMemberId) ?
                             'justify-content-end':'justify-content-start'}`}> */}
                            {/* 상대방 정보 출력 */}
                            <div>{(login && memberId !== message.senderMemberId) && (
                                <h6>
                                    {message.senderMemberId}
                                    <small>
                                        ({message.senderMemberLevel})
                                    </small>
                                </h6>
                            )}</div>
                            {/* @@파일첨부 추가 코드 - 사용자가 보낸 본문 , type이 file이면 file을 아니면 텍스트가 나옴*/}
                            {/* <div className="">
                                {message.content}
                            </div> */}
                            {/* 메시지 내용 */}
                                <div className={`p-3 rounded text-wrap text-break
                                    ${login && memberId === message.senderMemberId ?
                                    'bg-primary text-white' : 'bg-white text-dark'}`}
                                    style={{ display: 'inline-block'}}>
                                {message.type === "file" ? (
                                    <img src={message.image} alt={`파일 ${index}`} style={{ maxWidth: '30%', height: 'auto' }} />
                                ) : (
                                    <p className="mb-1">{message.content}</p>                                    
                                )}
                            </div>
                            {/* 시간 */}
                            <div className="text-muted small mt-2 mb-0">
                            {/* 그날 메시지일경우 시간만, 그 이전일 경우 날짜까지 */}
                            {moment(message.time).isAfter(moment().startOf('day')) ? (
                                <p>오늘 {moment(message.time).format("a h:mm")}</p>
                            ) : (
                                <p>{moment(message.time).format("YYYY-MM-DD h:mm")}</p>
                            )}
                            </div>
                        {/* </div> */}
                    </div>
                </li>
            ))}
        </ul>
                        <div className="row mt-4">
                            <div className="col-4">
                                <div className="input-group">

                                    {/*  @@파일 첨부 추가 코드 - 선택파일, 파일전송 버튼 */}
                                    <input type="file" className="form-control " name="attachList" multiple accept="image/*" ref={inputFileRef}
                                        onChange={changeTarget} />
                                    <button className="btn btn-primary" onClick={fileSend}
                                        disabled={!inputFileRef.current || inputFileRef.current.value === ""}><BsSend /></button>
                                </div>
                            </div>

                            <div className="col-8">
                                <div className="input-group">
                                    <input type="text" value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyUp={e => e.key === 'Enter' && sendMessage()}
                                        className="form-control" />
                                    <button className="btn btn-primary" onClick={e=>sendMessage()}>보내기</button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );


};

export default ChatRoom;