import axios from "axios";
import { useCallback } from "react";

const GoChat = ()=>{
    
    const gochat = useCallback(()=>{


    },[]);

    return(<>
        <h1>
        '채팅하기'로 이동 구현을 위한 테스트 페이지
        </h1>

        {/* 방 생성 화면 */}
                    {/* useParam 을 통해 판매자 아이디 받는 방식으로 처리예정 */}
        <div className="row mt-4">
            <div className="col">
                    <button className="btn btn-primary"
                                onClick={gochat}>
                        채팅하기
                    </button>
            </div>
        </div>
    </>);
};

export default GoChat;