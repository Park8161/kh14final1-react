import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";

const PayFail2 = ()=>{

    return(<>
         <div className="row d-flex align-items-middle" style={{ minHeight: "100vh" }}>
            <div className="col text-center">
                <div className="my-5">
                    <p className="fs-5 mt-2">결제에 실패했습니다.</p>
                    <NavLink to="/">
                    <p className="fs-6 mt-2">메인 페이지로</p>
                    </NavLink>
                    <NavLink to="/qna/list">
                    <p className="fs-6 mt-2">문의하기</p>
                    </NavLink>
                </div>
            </div>
        </div>
    </>);

};
export default PayFail2;