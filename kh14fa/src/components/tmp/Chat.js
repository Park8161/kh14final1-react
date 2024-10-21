import { Routes, Route } from "react-router";
import RoomList from "../room/RoomList";
import ChatRoom from "../room/ChatRoom";
import WebSocketClient from "../room/WebSocketClient";

const Chat = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/roomlist" element={<RoomList/>}></Route>
            <Route path="/chatroom/:roomNo" element={<ChatRoom/>}></Route>
            <Route path="/websocketclient" element={<WebSocketClient/>}></Route>
            <Route />
        </Routes>
        </>
    );
};
export default Chat;