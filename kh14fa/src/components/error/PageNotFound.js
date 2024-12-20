import { useNavigate } from "react-router";

// 404 상황에서 표시될 페이지
const PageNotFound = () => {
    // navigator
    const navigate = useNavigate();

    return (
        <>
            <div className="row mt-4">
                <div className="col">
                    <h2>요청하신 페이지를 찾을 수 없습니다</h2>
                    <button type="button" className="btn btn-primary" onClick={e=>navigate("/")}>홈으로</button>
                </div>
            </div>
        </>
    );
};

export default PageNotFound;