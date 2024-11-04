// import
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

// component
const Home = () => {
    // 상태 관리: 현재 배너의 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bannerList, setBannerList] = useState([]);

    const navigate = useNavigate();
    
    const BannerClick = useCallback((noticeNo)=>{
        navigate(`/notice/detail/${noticeNo}`);
    });
    
    // 다음 배너로 이동하는 함수
    const nextBanner = () => {
        if(bannerList.length > 0){
            setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(bannerList.length / 3));
        }
    };

    // 이전 배너로 이동하는 함수
    const prevBanner = () => {
        if(bannerList.length > 0){
            setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(bannerList.length / 3)) % Math.ceil(bannerList.length / 3));
        }
    };

    // 현재 배너 그룹 가져오기
    const displayedBanners = bannerList.slice(currentIndex * 3, currentIndex * 3 + 3);
    const totalPages = Math.ceil(bannerList.length / 3);

    // 자동으로 배너를 변경하는 효과
    useEffect(() => {
        const timer = setInterval(() => {
            nextBanner();
        }, 4000); // 4초마다 다음 배너로 이동
    
    // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearInterval(timer);
    }, [bannerList]);
   

    const loadBannerList = useCallback(async()=>{
        const resp = await axios.get("/notice/bannerList");
        setBannerList(resp.data);
    }, []);

    useEffect(()=>{
        loadBannerList();
    }, [loadBannerList]);

    // view
    return (
        <>
        <div className="row">
            <div className="col">

            <div className="container mt-4 grid grid-cols-1 gap-4">
                <div className="flex items-center">
                    <h3 className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading">
                        진행중인 이벤트
                    </h3>
                </div>

                {/* 이벤트 배너 */}
                <div className="container mt-4">
                    <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                        {/* <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row">
                                    {displayedBanners.map((banner, index) => (
                                        <div className="col" key={index}>
                                            <img src={banner[0]} className="d-block w-100" alt={banner[1]} style={{ width: '300px' , height: '300px', objectFit: 'contain', margin:'0 5px'}} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div> */}
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="row">
                                    {displayedBanners.map((banner, index) => (
                                        <div className="col" key={index}>
                                            <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${banner.attachment}`} 
                                                    className="d-block w-100" alt={banner.title} onClick={e=>BannerClick(banner.noticeNo)}
                                                    style={{ 
                                                        width: '250px' ,
                                                        height: '300px', 
                                                        objectFit: 'fill', 
                                                        margin:'0 1px',
                                                        padding: '1px'
                                                    }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* 이전 버튼 (<) */}
                        <button className="carousel-control-prev" type="button" onClick={prevBanner}
                                    data-bs-slide="prev"
                                    style={{
                                        position: 'absolute'  ,
                                        left: '-70px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: '1',
                                        border: 'none'
                                    }}>
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>                                    
                        {/* 다음 버튼 (>) */}
                        <button className="carousel-control-next" type="button" onClick={nextBanner}
                                    data-bs-slide="next"
                                    style={{
                                        position: 'absolute'  ,
                                        right: '-70px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: '1',
                                        border: 'none'
                                    }}>
                                    
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        
                        
                        {/* 인디케이터 추가 */}
                        <div className="carousel-indicators">
                            {[...Array(Math.ceil(bannerList.length / 3))].map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={currentIndex === index ? "active" : ""}
                                    aria-current={currentIndex === index ? "true" : "false"}
                                    onClick={() => setCurrentIndex(index)}
                                    style={{
                                        borderRadius: '50%',
                                        width: '10px',
                                        height: '10px',
                                        margin: '2px',
                                        backgroundColor: currentIndex === index ? 'black' : 'lightgray', // 색상 변경
                                        border: 'none', // 기본 테두리 제거
                                    }}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
                </div>

            </div>
        </div>
        </>
    );
}

// export
export default Home;
