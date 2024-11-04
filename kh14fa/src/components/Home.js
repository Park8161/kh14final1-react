// import
import { useEffect } from "react";
import { useNavigate } from "react-router";

// component
const Home = () => {
    // navigate
    const navigate = useNavigate();

    useEffect(()=>{
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
