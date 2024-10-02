import { RecoilRoot } from "recoil";
import MainContent from "./components/MainContent";
import Menu from "./components/Menu";

import {HashRouter, BrowserRouter} from "react-router-dom";
// HashRouter : localhost:3000/#/ex01
// 하나의 주소만 허용해줄 때 사용, /#/~~ (ex. GitHub)
// 배포 환경에서 주소 매핑을 사용할 수 없을 경우 사용
// 리액트와 스프링 충돌 방지 목적?
// BrowserRouter : localhost:3000/ex01
// 여러 주소를 허용해줄 때 사용, /~~~

const App = ()=> {
  return (
    <>
      {/* RecoilRoot를 설정하면 해당범위에서만 Recoil 이용 가능 */}
      <RecoilRoot>
      {/* HashRouter를 설정하면 해당 범위에서만 Route 이용 가능 */}
      <HashRouter>
        <Menu />
        <MainContent />
      </HashRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
