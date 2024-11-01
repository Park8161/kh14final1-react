// import
import { useRecoilValue } from "recoil";
import Jumbotron from "../Jumbotron";
import { memberIdState } from "../../utils/recoil";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { last, throttle } from "lodash";
import { useNavigate } from 'react-router-dom';
import { Modal } from "bootstrap";
import { FaAsterisk, FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { toast } from 'react-toastify';

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

///////////////////////////////////////////////////////////////////////////////////////////////////
    // 여기서부터 차단 등록/해제 기능

    // state
    const [inputInsert, setInputInsert] = useState({
        blockTarget : "",
        blockMemo : ""
    });
    const [inputCancel, setInputCancel] = useState({
        blockTarget : "",
        blockMemo : ""
    });

    // ref
    const insertModal = useRef();
    const cancelModal = useRef();

    // callback
    const clearInputInsert = useCallback(()=>{
        setInputInsert({
            ...inputInsert,
            blockTarget : "",
            blockMemo : ""
        });
    },[inputInsert]);

    const clearInputCancel = useCallback(()=>{
        setInputCancel({
            ...inputCancel,
            blockTarget : "",
            blockMemo : ""
        });
    },[inputCancel]);

    const changeInputInsert = useCallback((e)=>{
        setInputInsert({
            ...inputInsert,
            [e.target.name] : e.target.value
        });
    },[inputInsert]);

    const changeInputCancel = useCallback((e)=>{
        setInputCancel({
            ...inputCancel,
            [e.target.name] : e.target.value
        });
    },[inputCancel]);

    const openInsertModal = useCallback(()=>{
        const tag = Modal.getOrCreateInstance(insertModal.current);
        tag.show();
    },[insertModal]);

    const closeInsertModal = useCallback(()=>{
        var tag = Modal.getInstance(insertModal.current);
        tag.hide();
        clearInputInsert();
    },[insertModal]);

    const openCancelModal = useCallback(()=>{
        const tag = Modal.getOrCreateInstance(cancelModal.current);
        tag.show();
    },[cancelModal]);
    
    const closeCancelModal = useCallback(()=>{
        const tag = Modal.getInstance(cancelModal.current);
        tag.hide();
        clearInputCancel();
    },[cancelModal]);

    const insertBlock = useCallback(async()=>{
        try{
            const response = await axios.post("/member/block/insert", inputInsert);
            closeInsertModal();
            toast.success("차단 등록 완료");
            loadBlockList();
        }
        catch(e){
            toast.error("없는 회원 아이디 혹은 이미 차단한 회원");
        }
    },[inputInsert]);
    const cancelBlock = useCallback(async()=>{
        try{
            const response = await axios.post("/member/block/cancel", inputCancel);
            closeCancelModal();
            toast.success("차단 해제 완료");
            loadBlockList();
        }
        catch(e){
            toast.error("없는 회원 아이디 혹은 이미 해제한 회원");
        }
    },[inputCancel]);

    const checkInsertLength = useMemo(()=>{
        const checkLength = inputInsert.blockTarget.length > 0 && inputInsert.blockMemo.length > 0;
        return checkLength;
    },[inputInsert]);

    const checkCancelLength = useMemo(()=>{
        const checkLength = inputCancel.blockTarget.length > 0 && inputCancel.blockMemo.length > 0;
        return checkLength;
    },[inputCancel]);

    return (
        <>
            {/* <Jumbotron title="차단 목록 페이지" content={`${memberId}님의 차단 목록을 확인할 수 있습니다`}/> */}

            <div className="row mt-4">
                <div className="col-6">
                    <p>목록이 보이지 않을 시 새로고침 한번 하시면 나타납니다</p>
                </div>
                <div className="col-6 text-end">
                    <button className="btn btn-primary me-3" onClick={openInsertModal} >
                        차단하기
                    </button>
                    <button className="btn btn-info me-3" onClick={openCancelModal} >
                        차단해제
                    </button>
                    <button className="btn btn-danger" onClick={goBack}>
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




            {/* 차단 등록용 모달 */}
            <div className="modal fade" tabIndex="-1" ref={insertModal} data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* 모달 헤더 - 제목, x버튼 */}
                        <div className="modal-header">
                            <h5 className="modal-title">회원 차단 등록</h5>
                            <button type="button" className="btn-close btn-manual-close" 
                                    onClick={closeInsertModal}></button>
                        </div>

                        {/* 모달 본문 */}
                        <div className="modal-body">
                            {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                            <div className="row">
                                <div className="col">
                                    <FaAsterisk className="text-danger" />
                                    차단 등록 시 그 유저의 상품 확인 및 채팅이 불가능합니다
                                    <FaAsterisk className="text-danger" />
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>
                                        차단할 대상의 아이디를 입력해주세요
                                    </label>
                                    <input type="text" className="form-control" name="blockTarget"
                                        value={inputInsert.blockTarget} onChange={changeInputInsert}/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>
                                        차단 사유 등의 기록을 해주세요
                                    </label>
                                    <input type="text" className="form-control" name="blockMemo"
                                        value={inputInsert.blockMemo} onChange={changeInputInsert}/>
                                </div>
                            </div>
                        </div>

                            {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeInsertModal}>
                                취소<FaMinusSquare className="ms-1" />
                            </button>
                            <button type="button" className="btn btn-danger btn-manual-close me-3" onClick={insertBlock} disabled={checkInsertLength === false}>
                                차단<FaPlusSquare className="ms-1" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* 차단 해제용 모달 */}
            <div className="modal fade" tabIndex="-1" ref={cancelModal} data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">

                        {/* 모달 헤더 - 제목, x버튼 */}
                        <div className="modal-header">
                            <h5 className="modal-title">회원 차단 해제</h5>
                            <button type="button" className="btn-close btn-manual-close" 
                                    onClick={closeInsertModal}></button>
                        </div>

                        {/* 모달 본문 */}
                        <div className="modal-body">
                            {/* 모달은 나중에 만들고 모달 내부에 있을 화면만 구현 */}
                            <div className="row">
                                <div className="col">
                                    <FaAsterisk className="text-danger" />
                                    차단 해제 시 원하지 않는 만남이 이루어질 수도 있습니다
                                    <FaAsterisk className="text-danger" />
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>
                                        차단할 대상의 아이디를 입력해주세요
                                    </label>
                                    <input type="text" className="form-control" name="blockTarget"
                                        value={inputCancel.blockTarget} onChange={changeInputCancel}/>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label>
                                        차단 사유 등의 기록을 해주세요
                                    </label>
                                    <input type="text" className="form-control" name="blockMemo"
                                        value={inputCancel.blockMemo} onChange={changeInputCancel}/>
                                </div>
                            </div>
                        </div>

                            {/* 모달 푸터 - 종료, 확인, 저장 등 각종 버튼 */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeCancelModal}>
                                취소<FaMinusSquare className="ms-1" />
                            </button>
                            <button type="button" className="btn btn-success btn-manual-close me-3" onClick={cancelBlock} disabled={checkCancelLength === false} >
                                해제<FaPlusSquare className="ms-1" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
};

export default BlockList;