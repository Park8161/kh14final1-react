import { Routes, Route } from "react-router";
// import RoomList from "../room/RoomList";
import ChatRoom from "../room/ChatRoom";
import PrivateRoute from "../router/PrivateRoute";
import WsRoomList from "../room/WsRoomList";

const Chat = ()=>{
    return (
        <>
        <Routes>
            {/* 중첩 라우팅 : path="/chat/*" */}
            <Route path="/roomlist" element = {<PrivateRoute element={<WsRoomList/>}/>} />
            <Route path="/chatroom/:roomNo" element = {<PrivateRoute element={<ChatRoom/>}/>} />
            {/* <Route path="/wsroomlist" element = {<PrivateRoute element={<WsRoomList/>}/>} /> */}
        </Routes>
        </>
    );
};
export default Chat;