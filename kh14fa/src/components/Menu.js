// import
import { useState, useMemo, useCallback, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { loginState, memberIdState, memberLevelState, memberLoadingState, productColumnState, productKeywordState } from "../utils/recoil";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import { MdContactPage } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { FaLocationDot, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import '../style/Menu.css';
import { toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import '../style/Search.css';


// component
const Menu = () => {
    // navigate
    const navigate = useNavigate();

    // state
    const [noticeCnt, setNoticeCnt] = useState(0);
    const [roomList, setRoomList] = useState([]);
    const [connect, setConnect] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const location = useLocation();
    const [chatUrl, setChatUrl] = useState();

    // token
    const accessToken = axios.defaults.headers.common["Authorization"];
    const refreshToken = window.localStorage.getItem("refreshToken") || window.sessionStorage.getItem("refreshToken");

    // location
    const loacation = useLocation();

    // state
    const [size, setSize] = useState("");
    const [input, setInput] = useState({ // 검색창
        column : "",
        keyword : ""
    });
    const [category, setCategory] = useState([]);
    const [categoryInput, categorySetInput] = useState({
        categoryName: "",
        categoryGroup: "",
        categoryUpper: "",
        categoryDepth: ""
    });
    const [hotList, setHotList] = useState([]);
    

    // recoil state
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
    const login = useRecoilValue(loginState); // 읽기전용 항목은 이렇게 읽음
   const memberLoading = useRecoilValue(memberLoadingState);

    const [productColumn, setProductColumn] = useRecoilState(productColumnState);
    const [productKeyword, setProductKeyword] = useRecoilState(productKeywordState);
    
    //effect
    useEffect(() => {
        loadCategory();
        loadHotList();
    }, []);

    
    // callback
    const logout = useCallback(()=>{
        // recoil에 저장된 memberId와 memberLevel을 제거 >> 초기값으로 변환
        setMemberId("");
        setMemberLevel("");
        
        // axios에 설정된 Authorization 헤더도 제거
        delete axios.defaults.headers.common["Authorization"];

        // localStorage, sessionStorage의 refreshToken을 제거
        window.localStorage.removeItem("refreshToken");
        window.sessionStorage.removeItem("refreshToken");

        navigate("/");
    },[memberId, memberLevel]);

    const changeInput = useCallback((e)=>{
        setInput({
            ...input,
            [e.target.name] : e.target.value
        });
    },[input]);

    const sendToProduct = useCallback(()=>{
        setProductColumn(input.column);
        if(input.column === 'product_category'){
            setProductKeyword(category.filter(cat => (cat.categoryName.includes(input.keyword) && cat.categoryDepth === 3))[0]?.categoryNo);
        }
        else setProductKeyword(input.keyword);
        navigate("/product/list");
    },[input]);

    //카테고리 관련
    //effect
    useEffect(() => {
        loadCategory();
    }, []);

    useEffect(()=>{
        if(login === false) return;
        loadNoticeCnt(memberId);
    },[login, memberId, location.pathname]);

    // 카테고리 리스트 가져오기
    const loadCategory = useCallback(async () => {
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);        
    }, [category]);

     // 카테고리 계층 구조화
     const buildCategoryTree = (categories) => {
        const categoryMap = {};
        const tree = [];

        categories.forEach(cat => {
            categoryMap[cat.categoryNo] = { ...cat, children: [] };
        });

        categories.forEach(cat => {
            if (cat.categoryDepth === 1) {
                tree.push(categoryMap[cat.categoryNo]);
            } else {
                const parent = categoryMap[cat.categoryUpper];
                if (parent) {
                    parent.children.push(categoryMap[cat.categoryNo]);
                }
            }
        });

        return tree;
    };

    const categoryTree = buildCategoryTree(category);

    const handleMouseEnter = (e) => {
        e.preventDefault();
        const submenu = e.currentTarget.querySelector(':scope > .dropdown-menu');
        if (submenu) {
            submenu.classList.add('show');
        }
    };

    const handleMouseLeave = (e) => {
        e.preventDefault();
        const submenu = e.currentTarget.querySelector(':scope > .dropdown-menu');
        if (submenu) {
            submenu.classList.remove('show');
        }
    };

    // 새로운 알림 수 
    const loadNoticeCnt = useCallback(async (memberId)=>{
        const resp = await axios.get("/room/unread/cntall");
        setNoticeCnt(resp.data);
        loadRoomList(memberId);
    },[]);

    // 통신 시 알림 수 재 갱신
    const reloadNoticeCnt = useCallback(async ()=>{
        const resp = await axios.get("/room/unread/cntall");
        setNoticeCnt(resp.data);
    },[]);

    // 채팅방 구독을 위한 채팅방 목록 세팅
    const loadRoomList = useCallback(async (memberId)=>{
        const resp = await axios.get("/room/");
        setRoomList(resp.data);
        connectToServer(resp.data, memberId);
    },[]);

    // const postNoticeCnt = useCallback(async()=>{
    //     await axios.post("/room/unread/cntall");
    //      console.log("noticeCnt실행");
    //  },[]);

    // 메시지 알림
    const showNotice = useCallback((newMsg)=>{
        if(connect === true) return;
        toast.info(newMsg.senderMemberId+"님으로 부터 새로운 메시지 도착 "+newMsg.content);
    },[connect]);

    // 현재 주소
    const getCurrentUrl = useCallback(()=>{
        const result = window.location.origin 
                    + window.location.pathname 
                    + (window.location.hash || '');
        return result;
    }, [location.pathname]);

    // 채팅방 주소
    const getChatRoomUrl = useCallback((roomNo)=>{
        return `${window.location.origin}/#/chat/chatroom/${roomNo}`;
    }, []);

    //알림 개수 실시간 갱신을 위한 웹소켓 연결 설정
    const connectToServer = useCallback((updatedRoomList, memberId)=>{
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
                updatedRoomList.forEach(room => {
                    client.subscribe(`/private/chat/${room.roomNo}`, (message) => {
                        const data = JSON.parse(message.body); 
                        const currentUrl = getCurrentUrl(); // 현재 URL을 가져옴
                        const chatRoomUrl = getChatRoomUrl(room.roomNo);
                        // console.log(currentUrl);
                        if(data.senderMemberId !== memberId && chatRoomUrl !== currentUrl){
                            // setNoticeCnt(prevCnt => prevCnt + 1); 
                            reloadNoticeCnt();
                            // showNotice(data);
                        }
                    });
                    client.subscribe(`/private/user/${room.roomNo}`,(message)=>{
                        reloadNoticeCnt();  
                    });
                    client.subscribe(`/private/db/${room.roomNo}/${memberId}`,(message)=>{
                        reloadNoticeCnt();        
                    });
                });
                // setConnect(true);
                // console.log("연결됨?"+connect);
                },
            // 연결이 사라졌을 때 할일 
            onDisconnect:()=>{
                setConnect(false);
                reloadNoticeCnt();
            },
            // debug:(str)=>{
            //     console.log(str);
            // }
        });
        client.activate();
        return client;
    },[memberLoading, noticeCnt, chatUrl]);

    const disconnectFromServer = useCallback((client)=>{
        if(client){
            client.deactivate();
        }
    },[]);
  
    const goToProduct = useCallback((categoryNo)=>{
        setProductColumn("product_category");
        setProductKeyword(categoryNo);
        navigate("/product/list");
        window.location.reload();
    },[input]);

    // 인기 카테고리(소분류) 20위까지
    const loadHotList = useCallback(async()=>{
        const response = await axios.get("/product/hotList");
        setHotList(response.data);
        // console.log(response.data);
    },[hotList]);

    // view
    return (
        <>
            {/* 
                (주의)
                React는 한 페이지이므로 a태그로 이동 설정을 하지 않는다
                대신, react-router-dom에 있는 <NavLink to=주소>를 사용
                NaviLink는 Router의 상황에 맞는 주소를 생성하며, a태그로 변환된다
            */}
            {/* 메뉴(Navbars) */}
            <nav className="navbar navbar-expand-lg bg-primary fixed-top" data-bs-theme="dark">
                <div className="container-fluid">
                    {/* 메인 로고 또는 텍스트가 존재하는 위치 */}
                    <NavLink className="navbar-brand" to="/">KH정보교육원</NavLink>

                    <div className="d-flex align-items-center">
                    {/* 알림 아이콘 */}
                        <NavLink to="/Chat/roomlist">
                            <div className="d-flex align-items-center">
                                <FaBell className="text-white" /> {/* 아이콘을 흰색으로 설정 */}
                                <p className="fs-6 ms-1 mb-0 text-white">{noticeCnt}</p> {/* 같은 행에 표시하고, 아이콘 오른쪽에 띄워줌 */}
                            </div>
                        </NavLink>
                        {/* 폭이 좁은 경우 메뉴를 숨겼다 펼쳤다 하는 버튼(三햄버거 버튼) */}
                        <button className="navbar-toggler ms-3" type="button" data-bs-toggle="collapse" data-bs-target="#top-menu"
                            aria-controls="top-menu" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    {/* 
                        실제 메뉴 영역
                        - 폭이 충분할 경우에는 상단 메뉴바에 표시
                        - 폭이 충분하지 않을 경우에는 접이식으로 표시 
                    */}
                    <div className="collapse navbar-collapse" id="top-menu">
                        <ul className="navbar-nav me-0"> {/*me-auto : 오른쪽으로 최대한 공간을 많이 부여하라*/}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">관리자 전용</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/admin/member/list">회원 관리 목록</NavLink>
                                    <NavLink className="dropdown-item" to="/admin/category/list">카테고리 관리 목록</NavLink>
                                    <NavLink className="dropdown-item" to="/admin/product/list">상품 관리 목록</NavLink>
                                    
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">상품</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/product/list">상품목록</NavLink>
                                    <NavLink className="dropdown-item" to="/product/insert">상품등록</NavLink>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">게시판</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/qna/list">1:1 문의 게시판</NavLink>
                                    {/* <div className="dropdown-divider"></div> */}
                                    <NavLink className="dropdown-item" to="/notice/list">공지사항 게시판</NavLink>
                                </div>
                            </li>
                            
                            {/* 카테고리 */}
                            <li className="nav-item dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <a className="nav-link dropdown-toggle" role="button">카테고리</a>
                                <div className="dropdown-menu">
                                    {categoryTree.map(cat1 => (
                                        <div key={cat1.categoryNo} className="dropdown-submenu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                            <a className="dropdown-item" >{cat1.categoryName}</a>
                                            {cat1.children.length > 0 && (
                                                <div className="dropdown-menu">
                                                    {cat1.children.map(cat2 => (
                                                        <div key={cat2.categoryNo} className="dropdown-submenu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                                            <a className="dropdown-item">{cat2.categoryName}</a>
                                                            {cat2.children.length > 0 && (
                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                    {cat2.children.map(cat3 => (
                                                                        <a key={cat3.categoryNo} className="dropdown-item" onClick={e=>goToProduct(cat3.categoryNo)}>{cat3.categoryName}</a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </li>

                        </ul>

                        <ul className="navbar-nav">
                            <li>
                                {/* 검색창 */}
                                <div className="row mx-4 w-100 d-flex jusityfy-content-center search-window">
                                    <div className="col input-group w-auto mx-4 px-4">
                                        <select type="search" className="form-select bg-white border-0" 
                                                name="column" value={input.column} onChange={changeInput}>
                                            <option value="">선택</option>
                                            <option value="product_name">상품명</option>
                                            <option value="product_member">판매자</option>
                                            <option value="product_category">카테고리</option>
                                        </select>
                                        <input type="search" className="form-control w-auto bg-white border-0" 
                                                name="keyword" value={input.keyword} onChange={changeInput}
                                                onKeyUp={e=>e.key === 'Enter' && sendToProduct()}/>
                                        <button className="btn btn-dark d-flex justify-content-center align-items-center" onClick={sendToProduct}>
                                            <FaMagnifyingGlass />
                                            검색
                                        </button>
                                    </div>
                                </div>
                            </li>                     
                        </ul>
                        
                        {/* 인기 순위 목록 : 현재 카테고리 */}
                        <ul className="navbar-nav me-auto">
                            <li>
                                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-inner text-light">
                                        {hotList.map((hot,index)=>(
                                        <div className={"carousel-item "+(index===0 && ("active"))} key={index}>
                                            {hot.categoryName}
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                        <ul className="navbar-nav">
                            {/* 로그인이 되어있다면 아이디(등급) 형태로 출력 */}
                            {login ? (<>
                            <li className="nav-item">
                                <a className="nav-link" >
                                    환영해요 {memberId}님!
                                </a>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/member/mypage">
                                    <MdContactPage />
                                    MyPage
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={logout}>
                                    <RiLogoutBoxLine />
                                    로그아웃
                                </a>
                            </li>
                            </>) : (<>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/member/check">
                                    <FaUserPlus />
                                    회원가입
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/member/login">
                                    <RiLoginBoxLine />
                                    로그인
                                </NavLink>
                            </li>
                            </>)}
                        </ul>
                        {/* <form className="d-flex">
                            <input className="form-control me-sm-2" type="search" placeholder="Search">
                                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                        </form> */}
                    </div>
                </div>
            </nav>
        </>
    );
}

// export
export default Menu;