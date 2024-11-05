// import
import { SiNaver } from "react-icons/si";
import { FaFacebookSquare,FaYoutube,FaTwitter,FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GiSouthKorea } from "react-icons/gi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Footer = ()=>{
    // navigate
    const navigate = useNavigate();

    return (
        <>
            <div className="row py-4 mx-0 bg-light border-top">
                <div className="col">

                    <div className="row text-start">
                        <div className="col-3 offset-1 font-12px">
                            <h5>Once Upon a Time</h5>
                            <div>사업자 정보 안내</div>
                            <div>대표자 : 권민철</div>
                            <div>사업자 등록번호 : 012-34-56789</div>
                            <div>통신판매신고번호 : 제OOO-서울당산-OOOO호</div>
                            <div>주소 : 서울특별시 영등포구 당산동 이레빌딩 19층 C강의실</div>
                            <div>대표번호 : 0000-0000</div>
                        </div>
                        <div className="col-7 text-end">
                            <div className="row">
                                <div className="col-6 text-start">
                                    <div className="row">
                                        <div className="col">
                                            <h6 className="d-flex justify-content-start align-items-center mb-0">고객센터<MdKeyboardArrowRight/></h6>
                                            <h5 className="my-0">0000-0000</h5>
                                            <small className="mt-0 font-12px text-muted">운영시간 9시 - 18시 (주말/공휴일 휴무, 점심시간 12시 - 13시)</small>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <small className="mt-0 font-12px text-muted me-2 cursor-pointer text-decoration-underline" onClick={e=>navigate("/notice/list")}>공지사항</small>
                                            <small className="mt-0 font-12px text-muted me-2 cursor-pointer text-decoration-underline" onClick={e=>navigate("/qna/list")}>1:1 문의하기</small>
                                            <small className="mt-0 font-12px text-muted me-2 cursor-pointer text-decoration-underline" onClick={e=>navigate("/faq/list")}>자주 묻는 질문</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <big><GiSouthKorea className="ms-3 cursor-pointer" /></big>
                                    <SiNaver className="ms-3 cursor-pointer" />
                                    <big><FaFacebookSquare className="ms-3 cursor-pointer" /></big>
                                    <big><FaYoutube className="ms-3 cursor-pointer" /></big>
                                    <big><FaTwitter className="ms-3 cursor-pointer" /></big>
                                    <big><FaXTwitter className="ms-3 cursor-pointer" /></big>
                                    <big><FaInstagram className="ms-3 cursor-pointer" /></big>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-7 offset-5 text-muted font-12px">
                                    <small>"Once Upon a Time" 상점의 판매상품을 제외한 모든 상품들에 대하여, 해당 사이트는 통신판매중개자로서 거래 당사자가 아니며 판매 회원과 구매 회원 간의 상품거래 정보 및 거래에 관여하지 않고, 어떠한 의무와 책임도 부담하지 않습니다.</small>
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