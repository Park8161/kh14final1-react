// import
import { SiNaver } from "react-icons/si";
import { FaFacebookSquare,FaYoutube,FaTwitter,FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GiSouthKorea } from "react-icons/gi";

const Footer = ()=>{

    return (
        <>

            <div className="row py-4 mx-0 flex-box flex-core bg-light border-top">
                <div className="col">

                    <div className="row text-start">
                        <div className="col-5 offset-1">
                            <h5>Once Upon a Time</h5>
                            <div>사업자 정보 안내</div>
                            <div>대표자 : 권민철</div>
                            <div>사업자 등록번호 : 012-34-56789</div>
                            <div>통신판매신고번호 : 제OOO-서울당산-OOOO호</div>
                            <div>주소 : 서울특별시 영등포구 당산동 이레빌딩 19층 C강의실</div>
                            <div>대표번호 : 0000-0000</div>
                        </div>
                        <div className="col-5 text-end">
                            <div className="row">
                                <div className="col">
                                    <big><GiSouthKorea className="ms-3 cursor-pointer" /></big>
                                    <SiNaver className="ms-3 cursor-pointer" />
                                    <big><FaFacebookSquare className="ms-3 cursor-pointer" /></big>
                                    <big><FaYoutube className="ms-3 cursor-pointer" /></big>
                                    <big><FaTwitter className="ms-3 cursor-pointer" /></big>
                                    <big><FaXTwitter className="ms-3 cursor-pointer" /></big>
                                    <big><FaInstagram className="ms-3 cursor-pointer" /></big>
                                </div>
                            </div>
                            <div className="row marginT">
                                <div className="col text-muted">
                                    <small>“중고나라” 상점의 판매상품을 제외한 모든 상품들에 대하여, (주)중고나라는 통신판매중개자로서 거래 당사자가 아니며 판매 회원과 구매 회원 간의 상품거래 정보 및 거래에 관여하지 않고, 어떠한 의무와 책임도 부담하지 않습니다.</small>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Footer;