import { useNavigate } from "react-router";

const BanPage = ()=>{

    const navigate = useNavigate(); 

    return(<>
        
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="text-center">
                <h1>차단 된 회원입니다.</h1>

                <button type="button" className="btn btn-secondary mt-5 ms-5"
                            onClick={() => navigate("/")}>
                    메인으로 이동
                </button>
            </div>
        </div>

    </>);
};
export default BanPage;