const GoChat = ()=>{

    const [input, setInput] = useState({roomName:""});

    const changeInput = useCallback(e=>{
        //setInput({ roomName : e.target.value});
        setInput({ [e.target.name] : e.target.value });
    }, [input]);

    const saveInput = useCallback(async ()=>{
        const resp = await axios.post("/room/", input);
        loadRoomList();
        setInput({roomName:""});
    }, [input]);

    return(<>
        <h1>
        '채팅하기'로 이동 구현을 위한 테스트 페이지
        </h1>

        {/* 방 생성 화면 */}
        <div className="row mt-4">
            <div className="col">
                <div className="input-group">
                    {/* useParam 을 통해 판매자 아이디 받는 방식으로 처리예정 */}
                    <input type="text" name="roomName" className="form-control"
                                value={input.roomName} onChange={changeInput}/>
                    <button className="btn btn-primary"
                                onClick={saveInput}>
                        등록
                    </button>
                </div>
            </div>
        </div>
    </>);
};

export default GoChat;