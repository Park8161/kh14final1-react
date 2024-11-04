// import
import { useNavigate } from "react-router";

// component
const Home = () => {
    // navigate
    const navigate = useNavigate();
    
    // view
    return (
        <>
        {navigate("/product/list")};
        </>
    );
}

// export
export default Home;
