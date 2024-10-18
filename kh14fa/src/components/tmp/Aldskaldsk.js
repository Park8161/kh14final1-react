import { Route, Routes } from "react-router";
import MemberDetail from './../member/MemberDetail';
import RoomList from './../room/RoomList';
import ChatRoom from "../room/ChatRoom";
import WebSocketClient from "../room/WebSocketClient";

// 박민아
const Aldskaldsk = ()=>{
    return (
        <>
        <Routes>
            {/* <Route path="/autocomplete" element={<AutoComplete/>} /> */}
            <Route path="/memberdetail/:memberId" element={<MemberDetail/>}></Route>
            <Route path="/roomlist" element={<RoomList/>}></Route>
            <Route path="/chatroom/:roomNo" element={<ChatRoom/>}></Route>
            <Route path="/websocketclient" element={<WebSocketClient/>}></Route>
        </Routes>
        </>
    );
};
export default Aldskaldsk;