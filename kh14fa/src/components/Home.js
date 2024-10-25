// import
import { useState } from "react";

// component
const Home = () => {
    // 상태 관리: 현재 배너의 인덱스
    const [currentIndex, setCurrentIndex] = useState(0);

    // 배너 데이터 (예시)
    const banners = [
        ["https://placehold.co/400x200", "배너 1"],
        ["https://placehold.co/400x200", "배너 2"],
        ["https://placehold.co/400x200", "배너 3"],
        ["https://placehold.co/400x200", "배너 4"],
        ["https://placehold.co/400x200", "배너 5"],
        ["https://placehold.co/400x200", "배너 6"],
        ["https://placehold.co/400x200", "배너 7"],
        ["https://placehold.co/400x200", "배너 8"],
        ["https://placehold.co/400x200", "배너 9"],
        ["https://placehold.co/400x200", "배너 10"],
        ["https://placehold.co/400x200", "배너 11"],
        ["https://placehold.co/400x200", "배너 12"],
        ["https://placehold.co/400x200", "배너 13"],
        ["https://placehold.co/400x200", "배너 14"],
        ["https://placehold.co/400x200", "배너 15"],
        ["https://placehold.co/400x200", "배너 16"],
        ["https://placehold.co/400x200", "배너 17"],
        ["https://placehold.co/400x200", "배너 18"],
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
                                        <img src={banner[0]} className="d-block w-100" alt={banner[1]} style={{ width: '500px' , height: '300px', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" onClick={prevBanner}  style={{ left: '-80px', position: 'absolute', zIndex: '1' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" onClick={nextBanner}  style={{ right: '-80px', position: 'absolute', zIndex: '1' }}>
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
