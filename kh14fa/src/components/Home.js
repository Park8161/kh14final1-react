// import
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import event1 from '../assets/event1.jpg';
import event2 from '../assets/event2.gif';
import event3 from '../assets/event3.gif';
import event4 from '../assets/event4.jpg';
import event5 from '../assets/event5.jpg';
import event6 from '../assets/event6.jpg';
import event7 from '../assets/event7.jpg';
import event8 from '../assets/event8.jpg';
import event9 from '../assets/event9.jpg';
import event10 from '../assets/event10.jpg';
import event11 from '../assets/event11.jpg';
import event12 from '../assets/event12.jpg';

// component
const Home = () => {
    // 상태 관리: 현재 배너의 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigate = useNavigate();

    // 배너 데이터 (예시)
    const banners = [
        [event4, "배너 1"],
        [event2, "배너 2"],
        [event3, "배너 3"],
        [event1, "배너 4"],
        [event5, "배너 5"],
        [event6, "배너 6"],
        [event7, "배너 7"],
        [event8, "배너 8"],
        [event9, "배너 9"],
        [event10, "배너 10"],
        [event11, "배너 11"],
        [event12, "배너 12"],       
    ];

    // 다음 배너로 이동하는 함수
    const nextBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(banners.length / 3));
    };

    // 이전 배너로 이동하는 함수
    const prevBanner = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(banners.length / 3)) % Math.ceil(banners.length / 3));
    };

    // 현재 배너 그룹 가져오기
    const displayedBanners = banners.slice(currentIndex * 3, currentIndex * 3 + 3);
    const totalPages = Math.ceil(banners.length / 3);

    // 자동으로 배너를 변경하는 효과
    useEffect(() => {
        const timer = setInterval(() => {
            nextBanner();
        }, 4000); // 4초마다 다음 배너로 이동
    
    // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearInterval(timer);
    }, [currentIndex]);

    // 배너 클릭 시 페이지 이동
    const LinkNotice = (link)=>{
        navigate(link);
    };

    // view
    return (
        <>
            {/* 이벤트 배너 */}
            <div className="container mt-4">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="row">
                                {displayedBanners.map((banner, index) => (
                                    <div className="col" key={index}>
                                        <img src={banner[0]} className="d-block w-100" alt={banner[1]} style={{ width: '300px' , height: '300px', objectFit: 'contain', margin:'0 5px'}} />
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
                                    left: '-30px',
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
                                    right: '-30px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    zIndex: '1',
                                    border: 'none'                                }}>
                                
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    
                    
                    {/* 인디케이터 추가 */}
                    <div className="carousel-indicators">
                        {[...Array(totalPages)].map((_, index) => (
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
        </>
    );
}

// export
export default Home;
