import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// import design
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootswatch/dist/spacelab/bootstrap.min.css';
import 'bootstrap';
import { RecoilRoot } from 'recoil';
import { HashRouter,BrowserRouter } from 'react-router-dom';

// HashRouter : localhost:3000/#/ex01
// 하나의 주소만 허용해줄 때 사용, /#/~~ (ex. GitHub)
// 배포 환경에서 주소 매핑을 사용할 수 없을 경우 사용
// 리액트와 스프링 충돌 방지 목적?
// BrowserRouter : localhost:3000/ex01
// 여러 주소를 허용해줄 때 사용, /~~~

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  {/* <React.StrictMode> */}
  {/* RecoilRoot를 설정하면 해당범위에서만 Recoil 이용 가능 */}
    <RecoilRoot>
      {/* HashRouter를 설정하면 해당 범위에서만 Route 이용 가능 */}
      <HashRouter>
        <App />
      </HashRouter>
    </RecoilRoot>
  {/* </React.StrictMode> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
