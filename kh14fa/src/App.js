import axios from "axios";
import MainContent from "./components/MainContent";
import Menu from "./components/Menu";
import { useCallback, useEffect } from 'react';
import { useRecoilState } from "recoil";
import { memberIdState, memberLevelState,memberLoadingState } from "./utils/recoil";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer } from "react-toastify";

// HashRouter : localhost:3000/#/ex01
// 하나의 주소만 허용해줄 때 사용, /#/~~ (ex. GitHub)
// 배포 환경에서 주소 매핑을 사용할 수 없을 경우 사용
// 리액트와 스프링 충돌 방지 목적?
// BrowserRouter : localhost:3000/ex01
// 여러 주소를 허용해줄 때 사용, /~~~

// 화면 전체에 영향을 미칠 수 있는 작업들을 구현
// - 새로고침 시 로그인 갱신 처리
const App = ()=> {
  // recoil state
  const [memberId, setMemberId] = useRecoilState(memberIdState);
  const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
  const [memberLoading, setMemberLoading] = useRecoilState(memberLoadingState);

  // callback
  const refreshLogin = useCallback(async()=>{
    // [1] sessionStorage에 refreshToken이라는 이름의 값이 있는지 확인
    const sessionToken = window.sessionStorage.getItem("refreshToken");
    // [2] localStorage에 refreshToken이라는 이름의 값이 있는지 확인
    const localToken = window.localStorage.getItem("refreshToken");
    // [3] 둘 다 없으면 차단
    if(sessionToken === null && localToken === null) return;
    // [4] 둘 중 하나라도 있다면 로그인 갱신을 진행
    const refreshToken = sessionToken || localToken; // 앞이 없으면 뒤를 넣어라
    // [5] 헤더에 Authorization 설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + refreshToken;
    // [6] 백엔드에 갱신 요청을 전송
    const resoponse = await axios.post("http://localhost:8080/member/refresh");
    // [7] 갱신 성공 시 응답(response)에 담긴 데이터들을 적절하게 분배하여 저장(로그인과 동일)
    setMemberId(resoponse.data.memberId);
    setMemberLevel(resoponse.data.memberLevel);
    axios.defaults.headers.common["Authorization"] = "Bearer " + resoponse.data.accessToken;
    if(window.localStorage.getItem("refreshToken") !== null){
      window.localStorage.setItem("refreshToken", resoponse.data.refreshToken);
    }
    else{
      window.sessionStorage.setItem("refreshToken", resoponse.data.refreshToken);
    }

    setMemberLoading(true);
  },[]);

  // effect - 화면 첫 로딩 시 1회 실행
  useEffect(()=>{
    refreshLogin();
  },[]);
  
  return (
    <>
      <Menu />
      <MainContent />

      {/* toast 메세지 출력을 위한 컨테이너 */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

export default App;
