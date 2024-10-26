import { Routes, Route } from "react-router";
import RoomList from "../room/RoomList";
import ChatRoom from "../room/ChatRoom";
import WebSocketClient from "../room/WebSocketClient";

const Chat = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/chat/*" */}
            <Route path="/roomlist" element={<RoomList/>} />
            <Route path="/chatroom/:roomNo" element={<ChatRoom/>} />
            <Route path="/websocketclient" element={<WebSocketClient/>} />
        </Routes>
        </>
    );
};
export default Chat;