// import
import { useRecoilValue } from "recoil";
import Jumbotron from "../Jumbotron";
import { memberIdState } from "../../utils/recoil";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { last, throttle } from "lodash";
import { useNavigate } from 'react-router-dom';

const BlockList = ()=>{
    // navigate
    const navigate = useNavigate();

    // recoil state
    const memberId = useRecoilValue(memberIdState);
    
    // state
    const [input, setInput] = useState({
        column : "",
        keyword : "",
        beginRow : "",
        endRow : ""
    });
    const [page, setPage] = useState(null);
    const [size, setSize] = useState(10);    
    const [result, setResult] = useState({
        count : 0,
        last : true,
        memberBlockList : []
    });

    // effect
    useEffect(()=>{
        setInput({
            ...input,
            beginRow : page * size - (size-1),
            endRow : page * size
        });
    },[page,size]);
    useEffect(()=>{
        // console.log(input.beginRow,input.endRow);
        if(page === null) setFirstPage(); // 초기상태
        if(page <= 1) {
            loadBlockList();
        }
        else if(page >= 2){
            loadMoreBlockList();
        }
    },[input.beginRow, input.endRow]);
    // 스크롤 관련된 처리
    useEffect(()=>{
        if(page === null) return; // 결과를 검색하지 않았을 때
        if(result.last === true) return; // 더 볼게 없을 때

        // 리사이즈에 사용할 함수
        const resizeHandler = throttle(()=>{
            const percent = getScrollPercent();
            if(percent >= 70 && loading.current === false){
                setPage(page+1);
            }
        }, 300);

        // 윈도우에 resize 이벤트를 설정
        window.addEventListener("scroll", resizeHandler);

        return()=>{
            // 윈도우에 설정된 resize 이벤트를 해제
            window.removeEventListener("scroll", resizeHandler);
        };
    });

    // callback
    const loadBlockList = useCallback(async()=>{
        loading.current = true;
        const response = await axios.post("/member/block/list", input);
        // console.log(response.data.memberBlockList);
        setResult(response.data);
        loading.current = false;
    },[input]);
    const loadMoreBlockList = useCallback(async()=>{
        loading.current = true;
        const response = await axios.post("/member/block/list", input);
        setResult({
            ...result,
            last : response.data.last,
            memberBlockList : [...result.memberBlockList, ...response.data.memberBlockList]
        });
        loading.current = false;
    },[input.beginRow, input.endRow]);
    const setFirstPage = useCallback(()=>{
        setPage(prev=>null);
        setTimeout(()=>{
            setPage(prev=>1);
        }, 1); // 이 코드는 1ms 뒤에 실행해라
    },[page]);
    // - 스크롤의 현재 위치를 퍼센트로 계산하는 함수(Feat.ChatGPT)
    const getScrollPercent = useCallback(()=>{
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        return scrollPercent;
    },[]);
    const goBack = useCallback(()=>{
        navigate(-1);
    },[]);

    // ref - 로딩중에 추가로딩이 불가능하게 처리
    const loading = useRef(false);

    return (
        <>
            <Jumbotron title="차단 목록 페이지" content={`${memberId}님의 차단 목록을 확인할 수 있습니다`}/>

            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-info" onClick={goBack}>
                        돌아가기
                    </button>
                </div>
            </div>

            {/* 차단 목록 표시 */}
            <div className="row mt-2">
                <div className="col">
                    <ul className="list-group">
                        {result.memberBlockList.map(member=>(
                        <li className="list-group-item" key={member.blockNo}>
                            <div className="row">
                                <div className="col-3">회원ID</div>
                                <div className="col-9">{member.memberId}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">차단여부</div>
                                <div className="col-9">{member.blockType}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">차단일시</div>
                                <div className="col-9">{member.blockTime}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">차단사유</div>
                                <div className="col-9">{member.blockMemo}</div>
                            </div>
                            {/* <div className="row">
                                <div className="col-3">회원이름</div>
                                <div className="col-9">{member.memberName}</div>
                            </div> */}
                            <div className="row">
                                <div className="col-3">등급</div>
                                <div className="col-9">{member.memberLevel}</div>
                            </div>
                            
                            <div className="row">
                                <div className="col-3">가입일</div>
                                <div className="col-9">{member.memberJoin}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">최근접속일</div>
                                {member.memberLogin === null ? (
                                <div className="col-9">
                                    접속기록없음
                                </div>
                                    ) : (
                                <div className="col-9">
                                    {member.memberLogin}
                                </div>
                                )}
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>

        </>
    );
};

export default BlockList;