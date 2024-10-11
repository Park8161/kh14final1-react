// import
import {useState, useCallback, useEffect} from "react";
import Jumbotron from "../Jumbotron";
import { FaAnglesRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

// component
const MemberCheck = ()=>{ 
    // navigate
    const navigate = useNavigate();
    
    // state
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [check4, setCheck4] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const [checkReqAll, setCheckReqAll] = useState(false);
    
    // effect
    useEffect(()=>{
        const checked = check1 && check2 && check3 && check4 ;
        setCheckAll(checked);
    },[check1,check2,check3,check4]);
    useEffect(()=>{
        const checked = check1 && check2 ;
        setCheckReqAll(checked);
    },[check1,check2]);

    // callback
    const changeCheckAll = useCallback((checked)=>{
        setCheck1(checked);
        setCheck2(checked);
        setCheck3(checked);
        setCheck4(checked);
    },[]);
    const changeCheckReqAll = useCallback((checked)=>{
        setCheck1(checked);
        setCheck2(checked);
    },[]);
    const goMemberJoin = useCallback(()=>{
        navigate("/member/join");
    },[]);

    // view
    return (
        <>
            <Jumbotron title="이용약관 안내" />

            <div className="row mt-4 text-center">
                <div className="col">
                    <div><img src="https://placehold.co/700x200" /></div>
                    <label className="mt-1">
                        <input type="checkbox" name="ckbox1" className="form-check-input"
                        checked={check1} onChange={e=>setCheck1(e.target.checked)} />
                        <span>(필수) 개인정보 취급 방침에 동의합니다</span>
                    </label>
                </div>
            </div>

            <div className="row mt-4 text-center">
                <div className="col">
                    <div><img src="https://placehold.co/700x200" /></div>
                    <label className="mt-1">
                        <input type="checkbox" name="ckbox2" className="form-check-input"
                        checked={check2} onChange={e=>setCheck2(e.target.checked)} />
                        <span>(필수) 홈페이지 이용규칙을 준수합니다</span>
                    </label>
                </div>
            </div>

            <div className="row mt-4 text-center">
                <div className="col">
                    <div><img src="https://placehold.co/700x200" /></div>
                    <label className="mt-1">
                        <input type="checkbox" name="ckbox3" className="form-check-input"
                        checked={check3} onChange={e=>setCheck3(e.target.checked)} />
                        <span>(선택) 이벤트성 정보 수신에 동의합니다</span>
                    </label>
                </div>
            </div>

            <div className="row mt-4 text-center">
                <div className="col">
                    <div><img src="https://placehold.co/700x200" /></div>
                    <label className="mt-1">
                        <input type="checkbox" name="ckbox4" className="form-check-input"
                        checked={check4} onChange={e=>setCheck4(e.target.checked)} />
                        <span>(선택) 개인정보의 제 3자 제공에 대해 동의합니다</span>
                    </label>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col text-center">
                    <label className="mt-1 me-4">
                        <input type="checkbox" name="ckbox4" className="form-check-input mx-2"
                        checked={checkReqAll} onChange={e=>changeCheckReqAll(e.target.checked)} />
                        <span>(필수) 전체선택</span>
                    </label>
                    <label className="mt-1">
                        <input type="checkbox" name="ckbox4" className="form-check-input mx-2"
                        checked={checkAll} onChange={e=>changeCheckAll(e.target.checked)} />
                        <span>(전체) 전체선택</span>
                    </label>
                </div>
            </div>

            <div className="row mt-4 text-center">
                <div className="col-6 offset-3">
                    <button className="btn btn-success w-100" disabled={checkReqAll === false} onClick={goMemberJoin}>
                        다음 단계로
                        <FaAnglesRight className="ms-1" />
                    </button>
                </div>
            </div>

        </>
    );
}

// export
export default MemberCheck;