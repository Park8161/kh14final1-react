// import
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from 'recoil';
import { productColumnState, productKeywordState } from "../utils/recoil";

// component
const Home = () => {
    // navigate
    const navigate = useNavigate();

    // recoil
    const [column, setColumn] = useRecoilState(productColumnState);
    const [keyword, setKeyword] = useRecoilState(productKeywordState);

    useEffect(()=>{
        setColumn(null);
        setKeyword(null);
        navigate("/product/list");
    },[]);
    
    // view
    return (
        <>
        </>
    );
}

// export
export default Home;
