// import
import { useState, useMemo, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginState, memberIdState, memberLevelState } from "../utils/recoil";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";

// component
const Menu = () => {
    // navigate
    const navigate = useNavigate();

    // state

    // recoil state
    const [memberId, setMemberId] = useRecoilState(memberIdState);
    const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
    const login = useRecoilValue(loginState); // 읽기전용 항목은 이렇게 읽음
    
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
    
    // effect

    // memo

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
                    {/* 폭이 좁은 경우 메뉴를 숨겼다 펼쳤다 하는 버튼(三햄버거 버튼) */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#top-menu"
                        aria-controls="top-menu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* 
                        실제 메뉴 영역
                        - 폭이 충분할 경우에는 상단 메뉴바에 표시
                        - 폭이 충분하지 않을 경우에는 접이식으로 표시 
                    */}
                    <div className="collapse navbar-collapse" id="top-menu">
                        <ul className="navbar-nav me-auto"> {/*me-auto : 오른쪽으로 최대한 공간을 많이 부여하라*/}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">예제</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/ex01">예제1</NavLink>
                                    <NavLink className="dropdown-item" to="/ex02">예제2</NavLink>
                                    <NavLink className="dropdown-item" to="/todolist">오늘의 할일</NavLink>
                                    <NavLink className="dropdown-item" to="/fruit-cart">과일구매</NavLink>
                                    <NavLink className="dropdown-item" to="/bank-acc">통장관리</NavLink>
                                    <NavLink className="dropdown-item" to="/testbank">TestBank</NavLink>
                                    <NavLink className="dropdown-item" to="/data/exam01">통합state필요성</NavLink>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">검색</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/search/autocomplete">자동완성</NavLink>
                                    <NavLink className="dropdown-item" to="/search/autocomplete2">자동완성2</NavLink>
                                    <NavLink className="dropdown-item" to="/search/member">멤버복합검색</NavLink>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                                    aria-haspopup="true" aria-expanded="false">데이터</a>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/poketmon">포켓몬</NavLink>
                                    {login === true && (<>
                                    <NavLink className="dropdown-item" to="/emp">사원</NavLink>
                                    <NavLink className="dropdown-item" to="/emp2">사원2</NavLink>
                                    <NavLink className="dropdown-item" to="/book/spa">도서(SPA)</NavLink>
                                    <NavLink className="dropdown-item" to="/book/list">도서(Multi)</NavLink>
                                    </>)}
                                    {/* <div className="dropdown-divider"></div> */}
                                    <a className="dropdown-item" href="#">기타</a>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">게시판</a>
                            </li>
                        </ul>
                        
                        <ul className="navbar-nav">
                            {/* 로그인이 되어있다면 아이디(등급) 형태로 출력 */}
                            {login ? (<>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
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
                                <a className="nav-link" href="#">
                                    <i className="fa-solid fa-user"></i>
                                    회원가입
                                </a>
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