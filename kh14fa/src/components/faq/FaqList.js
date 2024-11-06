import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FaqList = () => {
    useEffect(() => {
        window.scrollTo(0, 0); // 페이지가 로드되면 스크롤을 맨 위로 이동
    }, []);
    // FAQ 내용 (HTML 형식)
    const faqContent = [
        `개인정보 : 개인정보를 사고파는 행위와 면허증, 허가증, 등록증 등을 위, 변조하는 행위는 형법에 따라 처벌받을 수 있습니다.

예시) 주민등록증, 여권, 학생증, 수험표, 운전면허증, 대포통장, 듀얼폰, 듀얼넘버 등 

 

온라인 개인 계정 : 개인 계정 및 인증번호를 통해 각종 피해가 발생되고 있어 번개장터 운영정책에 따라 제재 됩니다.
예시) 카톡계정, 인스타 계정, 페이스북 계정, 네이버 계정, 카카오톡, 네이버, 페이스북 인증번호 등



불법현금융통 : 정보통신망 이용촉진 및 정보보호등의 관한 법률 제 72조 통신과금을 이용해 매입하는 행위는 불법현금융통으로 제재 됩니다. 
예시) 불법 현금융통을 목적으로 한 모든 상품 (불법대출, 돈구해요, 개인돈빌려요, 리니지M등)
         
사행성 : 불법 도박 및 사행성 상품은 번개장터 운영정책에 따라 제재 됩니다.
예시) 토토, 카지노, 바카라, 화투, 포커, 한게임, 섯다, 바둑이, 홀덤, 세븐등 머니쿠폰, 전용장비, 라이브스코어인증 등


성인용품 : 방송통신심의위원회의 정보통신에 관한 심의 규정에 따라 음란물로 구분되는 상품은 인터넷으로 유통이 불가하며, 성인 전용 상품 판매 시 운영정책에 따라 제재 됩니다.
예시) 각종 성인용품, 특수콘돔 등 

청소년유해상품 : 청소년유해 매체물/약품/물건은 청소년 보호법에 따라 제재 됩니다.
예시) 청소년불가 등급 및 선정적 매체 (잡지, DVD, 음반, 서적, 영화 티켓 등), 레이져포인터, 캠핑용 나이프, 눈알젤리, 가스건, 공업용/산업용 강력접착제(본드) 등

 
반려동물/야생동물 : 반려동물 및 야생동물은 번개장터 운영정책에 따라 제재 됩니다.
예시) 반려동물 판매/구매, 반려동물 무료나눔, 유/무료 분양, 박제품, 야생동물 수렵품(이빨, 뼈 등)

 

 비인도적 거래(장난글 포함) : 타인의 명예를 훼손하는 사람거래 관련 게시글은 아동복지법 및 정신통신망법(명예훼손)에 따라 제재 됩니다.

예시) 친구팔아요, 가족(아들, 딸 등) 팔아요 등 

       
주류 : 주세법에 따라 주류소매업 및 의제주류판매업 면허를 받은 자는 허가된 장소에서만 주류를 판매하여야 하고, 통신판매는 할 수 없도록 규정되어 있습니다.
예시) 양주, 맥주, 소주, 와인, 사케, 막걸리, 위스키, 보드카, 무알콜 맥주, 무알콜 칵테일 등`
    ];
    const faqContent2 = [
        `안전결제란 Once Upon a Time의 결제 시스템을 말합니다. 

구매자가 결제를 하는 시점부터 판매자에게 정산이 되기 까지,

결제대행사에서 판매 대금을 안전하게 보관하고 있으며, 거래가 완료된 후 판매자에게 정산이 진행됩니다. 

중고거래의 가장 큰 문제점인 사기의 위험에서 벗어나, 편리하고 빠른 중고거래를 경험해 보세요!

안전결제의 장점 세가지를 알려드릴게요. 

첫 째, 대화 없이, 편하게 결제할 수 있습니다. 
서로 계좌번호나 개인정보를 주고 받을 필요 없이, 안전결제만으로 쉽게 거래를 시작할 수 있어요. 

둘 째, 다양한 결제 수단을 사용할 수 있습니다. 
Once Upon a Time에서는 카드, 무통장 입금, 카카오페이, 네이버페이, 휴대폰 결제 등 다양한 결제 방법을 지원해 드리고 있어요. 

셋 째, 사기 피해를 예방할 수 있습니다. 
안전결제로 거래한 주문은 Once Upon a Time의 결제 대행사에서 안전하게 판매대금을 보관하고 있다가 거래가 완료되면 정산합니다. Once Upon a Time에서 거래를 보호하고 있기 때문에 내 돈을 지킬 수 있어요.

중고거래 다양한 문제점들을 보완한 안전결제로 스트레스 없는 중고거래가 가능해집니다.

단, 아래의 경우 안전결제를 이용할 수 없으니 참고해 주세요. 

상품 금액이 500원 미만인 경우

1일 이용 가능한 횟수 (10회)를 초과한 경우

앞으로 안전결제를 통해 보다 만족스러운 거래 경험을 제공해 드릴 것을 약속드릴게요. 

판매자는 신뢰받고 구매자가 안심할 수 있는 안전한 중고거래 문화를 만들어가는 Once Upon a Time이 되겠습니다.`
    ];
    const faqContent3 = [
        `반품 신청 불가  

정품 인증 시 즉시 판매자에게 정산이 되므로, 원칙적으로 반품은 불가능합니다.  

단, 판매자가 통신판매업자인 경우, 구매자의 반품 요청시 협의를 진행해주셔야하니 상호간 원만한 협의를 부탁드립니다. `
    ];
    const faqContent4 = [
        `Once Upon a Time의 모든 상품은 개인간 현금거래 (직접 계좌이체) 대신 안전결제로만 구매할 수 있으며, 
구매자는 안전결제 수수료 없이 무료로 이용하실 수 있습니다. 

이제 안전결제 수수료 부담에서 벗어나, 편하게 이용해 주시기 바랍니다. 

안전결제를 사용하면 좋은 점 세가지를 알려드릴게요. 

첫 째, 대화 없이, 편하게 결제할 수 있습니다.

서로 계좌번호나 개인정보를 주고 받을 필요 없이, 안전결제만으로 쉽게 거래를 시작할 수 있어요. 



둘 째, 다양한 결제 수단을 사용할 수 있습니다. 
Once Upon a Time에서는 카드, 무통장 입금, 카카오페이, 네이버페이, 휴대폰 결제 등 다양한 결제 방법을 지원해 드리고 있어요. 



셋 째, 사기 피해를 예방할 수 있습니다.
안전결제로 거래한 주문은 Once Upon a Time의 결제대행사에서 안전하게 판매대금을 보관하고 있다가 거래가 완료되면 정산합니다. 
Once Upon a Time에서 거래를 보호하고 있기 때문에 소중한 내 돈을 지킬 수 있어요. 



중고거래 다양한 문제점들을 보완한 안전결제로 스트레스 없는 중고거래가 가능해집니다. 

앞으로 안전결제를 통해 보다 만족스러운 거래 경험을 제공해 드릴 것을 약속드릴게요. 

판매자는 신뢰받고 구매자가 안심할 수 있는 안전한 중고거래 문화를 만들어가는 Once Upon a Time이 되겠습니다.`
    ]

    const faqContent5 = [
        `구매확정된 이후에는 구매확정 취소가 불가합니다.

번개장터에서는 구매확정을 하는 즉시, 상품 판매 대금이 판매자에게 정산돼요.

상품 판매 대금이 판매자에게 정산되고 난 후에는 구매확정을 취소 및 반품 요청을 할 수 없어요.

 

혹시 판매자가 배송 전 구매확정을 요청했나요? 

배송완료 이전에 판매자가 구매확정을 요청하는 거래는 사기 발생 위험이 매우 높아요.

따라서 번개장터에서는 배송 전 구매확정을 요청하는 것을 운영 정책 상 금지하고 있어요.

이런 행위를 하는 판매자를 만났다면 아래 신고 경로를 통해 신고를 접수해 주세요.

► 상품 페이지 → 신고하기 
► 상점 상세 → 신고하기 
► 번개톡 대화방 → 우측 상단 설정 → 신고하기 
► 번개톡 대화방 → 주의 안내 시스템 메시지 하단 [번개장터에 알려주기] → 1:1 문의하기 → 안전결제/거래신고

사기 피해 방지를 위해서 반드시 상품을 수령한 후 상품 상태를 확인한 후에 구매확정을 해주세요.  

 

번개장터에서는 안전한 거래 환경 정착을 위해 끊임없이 노력하고 있습니다. 

앞으로 안전결제를 통해 보다 만족스러운 거래 경험을 제공해 드릴 것을 약속드릴게요. 

판매자는 신뢰받고 구매자가 안심할 수 있는 안전한 중고거래 문화를 만들어가는 번개장터가 되겠습니다.`
    ]

    const faqContent6 = [
        `회원탈퇴 후에는 동일 상점으로 재가입은 불가하며, 새로운 상점으로 가입이 가능합니다.(탈퇴 상점 복구 불가)

단, 탈퇴 후 재가입은 7일 동안 제한됩니다.`
    ]

    const faqContent7 = [
        `1. 개인정보 이용내역이 무엇인가요?

“개인정보 보호법 제20조의2(개인정보 이용 제공 내역의 통지)”에 따라 번개장터에서 개인정보가 

어떤 목적으로 이용되고 있는지 안내해 드리기 위해 연 1회 정기적으로 발송되는 메시지입니다.



2. 저는 탈퇴 했는데, 왜 개인정보 이용내역 메시지가 왜 발송 된거죠? 

 12/1일을 기준으로 번개장터의 가입자를 대상으로 발송하였습니다.

 12/1일 이후 탈퇴를 하신 경우 메시지를 받으실 수 있습니다.. 



3. 번개장터를 이용한 적이 없는데 메시지를 받았어요. 

  가입 시 등록하신 휴대폰번호를 기준으로 개인정보 이용내역을 통지하고 있습니다.

  휴대폰번호 변경 후 메시지를 수신한 경우 고객센터(1670-2910)으로 문의 부탁드립니다. 



4. 이벤트 및 혜택 알림 동의를 거부를 하였는데, 왜 메시지가 오나요?

   본 메시지는 마케팅 수신 동의 여부와 관계없이 법률상 발송되는 개인정보 이용내역 통지 메시지 입니다. 



5. 회원 탈퇴를 하고 싶어요.

   MY> 설정 > 계정 설정 > [회원탈퇴] 경로를 통해 직접 탈퇴가 가능합니다. 

   다만, 거래가 진행중인 경우 또는 계정 차단 상태에서는 탈퇴가 불가함을 안내드립니다.`
    ]

    const faqContent8 = [
        `거래사기로 제재된 상점의 경우 탈퇴 후 재가입을 하더라도 서비스 이용이 제한됩니다.

단, 상대방 상점과 문제가 해결된 경우 이용 가능합니다`
    ]

    const faqContent9 = [
        `구매 전, 판매자에게 안내 받지 못한 상품 하자가 발견되었으나 판매자 연락이 안되는 경우 1:1문의로 접수해 주세요.

확인 후 운영정책에 따라 제재 조치 됩니다.`
    ]

    const faqContent10 = [
        `중고상품은 개인간의 거래이므로 전자상거래법, 소비자보호법 등이 적용되지 않습니다.

물품을 받으신 후 단순변심 또는 안내 받지 못한 하자가 확인되어 교환/반품을 원하실 경우, 판매자와 협의를 통해 진행해 주시기 바랍니다.

단순변심 환불로 판매자와 협의된 경우 배송비는 구매자 부담이 될 수 있습니다.`
    ]

    const faqContent11 = [
        `거래금지품목에 따라 기간제 차단 또는 영구 차단 

 

거래금지품목에 따라 제재 수위는 상이하며 기간제 차단 또는 영구 차단으로 진행 됩니다.

※ 나의 제재 내역은 'MY > 고객센터 > 내상점 제재내역'을 통해 확인이 가능 합니다.

 `
    ]

    const faqContent12 = [
        `Once Upon a Time의 모든 상품은 개인간 현금거래 (직접 계좌이체) 대신 안전결제로만 구매가 가능합니다. 

안전결제는 사기 피해로부터 구매자와 판매자 모두를 보호받을 수 있고, 안심하고 편리하게 거래할 수 있는 방법입니다. 

 

아래 행위는 모두 안전결제를 거부하는 것으로 간주하고 있어요.

현금거래(직접 계좌이체) 및 타 사이트로 결제를 유도하는 경우

안전결제 시 추가 금액을 요청하는 경우

배송완료 전 구매확정을 요청하는 경우


정당한 사유 없이 판매 거부하는 경우
 

혹시 판매자가 안전결제를 거부했나요?

판매자로 인해 불편을 겪게 한 것에 대해 번개장터가 대신 먼저 사과 드릴게요.

안전한 거래 환경 정착을 위해서, 아래 경로로 신고해 주세요. 

상품 페이지 → 신고하기

상점 상세 → 신고하기

번개톡 대화방 → 우측 상단 설정 → 신고하기 

번개톡 대화방 → 주의 안내 시스템 메시지 하단 [번개장터에 알려주기] → 1:1 문의하기 → 안전결제/거래신고

 

신고를 해주시면 모니터링을 통해 순차적으로 처리를 하고 있어요.

신고까지 시간이 소요될 수 있으니, 조금만 시간 양해 부탁드릴게요. 

 

앞으로 안전결제를 통해 늘 만족스러운 거래 경험을 제공해 드릴 것을 약속드릴게요. `
    ]

    const faqContent13 = [
        `결제 영수증을 지참하고 결제를 했던 편의점을 방문해야 합니다. 

 

환불이 가능한 경우, 거래건에 대해 환불을 받기 위해서는 결제 영수증을 지참하여 결제했던 편의점으로 방문해 주셔야 해요.

따라서, 거래가 완료되기 전까지는 결제 영수증을 꼭 보관해 주시기 바랍니다. 

 

편의점 결제의 경우, 환불시기에 따라 환불 방법이 달라져요.

아래 환불 방법을 확인해 주세요.

결제완료일로부터 60일 이내 환불하는 경우 : 결제 영수증을 지참하여 결제했던 편의점 점포 방문하여 환불

결제완료일로부터 60일 경과 후 환불하는 경우 : 계정에 등록된 환불 계좌로 자동 환불

거래 상태가 ‘환불 대기’일 때에만 환불 가능한 점 참고해 주시기 바랍니다. 

 

혹시 편의점을 방문했는데, 점원이 환불 방법을 모르는 상황인가요?

아래 방법 환불 방법을 안내해 드리니, 참고하여 점원과 소통해 주세요.

POS기기에서 ‘반품 업무’선택

안전결제 주문서 → 바코드를 보여준 후 스캔 요청 (혹은 수납번호 입력)

환불 완료

 

혹시 편의점결제를 하려는데, 점원이 결제 방법을 모르는 상황인가요?

아래 편의점결제 방법도 안내해 드릴게요. 아래 내용을 참고하여 점원과 소통해 주세요.

POS기기에서 하단 편의점 결제 메뉴 선택 

GS25 : 서비스 판매 > 편의점 결제

CU : 서비스 > 공공요금/쇼핑몰 수납 > 편의점 결제

이마트24 : 서비스업무 > 편의점 캐시

세븐일레븐 : 기타 결제

안전결제 주문서 → 바코드를 보여준 후 스캔 요청 (혹은 수납번호 입력) 

결제 완료`
    ]

    const faqContent14 = [
        `상품 페이지 OR 개인톡을 통해 신고 가능

상품 페이지 또는 개인톡을 통해서 신고가 가능하며, 아래의 내용을 참고 부탁드립니다.

► 상품신고 경로 : 상품 페이지 > 상품정보 > 신고하기 버튼 클릭

► 상점신고 경로 : 개인톡 대화방 > 설정 버튼 클릭 > 신고 버튼 클릭

※ 신고가 접수되면 모니터링을 통해 순차적으로 처리 됩니다.`
    ]

    const faqContent15 = [
        `안타깝게도 이미 결제가 완료된 후에 할부 개월 수를 변경할 수 없습니다. 

 

신용카드 결제가 완료된 후, 할부 개월 수 변경하는 기능은 제공해 드리지 않아요. 

결제할 때 원하는 할부 개월 수를 정확하게 선택할 수 있도록 신중하게 결제해 주시기 바랍니다. 

단, 결제 후 아직 판매자가 배송 준비를 시작하지 않았다면, 거래 취소 후 다시 결제를 해주시기 바랍니다. 

판매자가 배송 준비를 시작한 단계부터 즉시 취소가 어려우니, 판매자와 협의가 필요해요.



거래 상태 별 취소 가능 여부가 궁금하다면 아래의 경로를 확인해 주시기 바랍니다. 
구매한 상품을 결제취소 하고 싶어요

 

일부 카드사에서는 결제 후 할부 개월 수 변경이 가능한 경우가 있어요.

혹시 카드사에서 변경이 가능할지 모르니, 카드사로 문의해 주시기 바랍니다. `
    ]

    return (
        <>
            <div className="row mt-4">
            <div className="col-8 offset-2">
                <h2 className="text-center" style={{ paddingBottom: "20px", fontWeight: "bold" }}>
                    자주 묻는 질문
                </h2>
                <Accordion defaultActiveKey={null}>
                    {/* 첫 번째 질문 */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            거래를 하면 안되는 것들이 어떤게 있나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent[0] }} />
                    </Accordion.Item>

                    {/* 두 번째 질문 */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>
                            안전결제란 무엇인가요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent2[0] }} />
                    </Accordion.Item>

                    {/* 세 번째 질문 */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            구매한 상품의 반품이 가능한가요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent3[0] }} />
                    </Accordion.Item>

                    {/* 네 번째 질문 */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>
                            구매할 때 안전결제 수수료는 어떻게 되나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px",  whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent4[0] }} />
                    </Accordion.Item>

                    {/* 다섯 번째 질문 */}
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>
                            실수로 배송완료 전에 구매확정을 먼저 눌렀어요.
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent5[0] }} />
                    </Accordion.Item>

                    {/* 여섯 번째 질문 */}
                    <Accordion.Item eventKey="5">
                        <Accordion.Header>
                            회원탈퇴 후 재가입을 할 수 있나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent6[0] }} />
                    </Accordion.Item>

                    {/* 일곱 번째 질문 */}
                    <Accordion.Item eventKey="6">
                        <Accordion.Header>
                            수신한 개인정보 이용내역 메시지가 궁금해요.
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent7[0] }} />
                    </Accordion.Item>

                    {/* 여덟 번째 질문 */}
                    <Accordion.Item eventKey="7">
                        <Accordion.Header>
                            거래사기로 제재된 상점이 다시 번개장터를 이용 할 수 있나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent8[0] }} />
                    </Accordion.Item>

                    {/* 아홉 번째 질문 */}
                    <Accordion.Item eventKey="8">
                        <Accordion.Header>
                            상품 하자가 발견됐는데, 판매자 연락이 안돼요.
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent9[0] }} />
                    </Accordion.Item>

                    {/* 열 번째 질문 */}
                    <Accordion.Item eventKey="9">
                        <Accordion.Header>
                            단순변심 교환이나 환불은 어떻게 하나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent10[0] }} />
                    </Accordion.Item>

                    {/* 열 한 번째 질문 */}
                    <Accordion.Item eventKey="10">
                        <Accordion.Header>
                        거래금지품목을 거래한 경우 어떻게 제재되나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent11[0] }} />
                    </Accordion.Item>

                    {/* 열 두 번째 질문 */}
                    <Accordion.Item eventKey="11">
                        <Accordion.Header>
                        판매자가 안전결제를 받아주지 않는다면 어떻게 해야 하나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent12[0] }} />
                    </Accordion.Item>

                    {/* 열 세 번째 질문 */}
                    <Accordion.Item eventKey="12">
                        <Accordion.Header>
                        편의점 결제를 했는데, 환불은 어떻게 하나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent13[0] }} />
                    </Accordion.Item>

                    {/* 열 네 번째 질문 */}
                    <Accordion.Item eventKey="13">
                        <Accordion.Header>
                        운영정책을 위반한 상점 신고는 어떻게 하나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent14[0] }} />
                    </Accordion.Item>

                    {/* 열 다섯 번째 질문 */}
                    <Accordion.Item eventKey="14">
                        <Accordion.Header>
                        신용카드 결제 후 할부개월 수를 변경할 수 있나요?
                        </Accordion.Header>
                        <Accordion.Body style={{
                            fontSize: "16px", padding: "20px", whiteSpace: "pre-wrap", wordWrap: "break-word", maxHeight: "300px", overflowY: "auto"
                        }}
                            dangerouslySetInnerHTML={{ __html: faqContent15[0] }} />
                    </Accordion.Item>
                </Accordion>
            </div>
            </div>
        </>
    );
};

export default FaqList;
