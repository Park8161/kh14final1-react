import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router";
import { throttle } from "lodash";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { memberIdState, productColumnState, productKeywordState } from "../../utils/recoil";
import moment from 'moment-timezone';

const ProductList = () => {
	// navigate
	const navigate = useNavigate();

	// recoil
	const productColumn = useRecoilValue(productColumnState);
	const productKeyword = useRecoilValue(productKeywordState);
	const memberId = useRecoilValue(memberIdState);

	// state
	const [productList, setProductList] = useState([]);
	const [input, setInput] = useState({
		column: "",
		keyword: "",
		beginRow: "",
		endRow: ""
	});
	const [page, setPage] = useState(null);
	const [size, setSize] = useState(10);
	const [result, setResult] = useState({
		count: 0,
		last: true,
		productList: []
	});
	//임시 state 
	const [temp, setTemp] = useState({});
	//좋아요 관련 state 
	const [productNo, setProductNo] = useState({});//누를때 쓸 productNo
	const [like, setLike] = useState({}); // 좋아요 여부
	const [likes, setLikes] = useState({}); // 좋아요 개수
	const [currentProduct, setCurrentProduct] = useState(""); //좋아요 누를때 현재 상품 비교용

	//effect
	useEffect(() => {
		loadProductList();
	}, []);

	useEffect(() => {
		setInput({
			...input,
			beginRow: page * size - (size - 1),
			endRow: page * size
		});
	}, [page, size]);

	useEffect(() => {
		// console.log(input.beginRow,input.endRow);
		if (page === null) setFirstPage(); // 초기상태
		if (page <= 1) {
			loadProductList();
		}
		else if (page >= 2) {
			loadMoreProductList();
		}
	}, [input.beginRow, input.endRow]);

	// 스크롤 관련된 처리
	useEffect(() => {
		if (page === null) return; // 결과를 검색하지 않았을 때
		if (result.last === true) return; // 더 볼게 없을 때

		// 리사이즈에 사용할 함수
		const resizeHandler = throttle(() => {
			const percent = getScrollPercent();
			if (percent >= 70 && loading.current === false) {
				setPage(page + 1);
			}
		}, 300);

		// 윈도우에 resize 이벤트를 설정
		window.addEventListener("scroll", resizeHandler);

		return () => {
			// 윈도우에 설정된 resize 이벤트를 해제
			window.removeEventListener("scroll", resizeHandler);
		};
	});

	//목록
	const loadProductList = useCallback(async () => {
		loading.current = true;
		const response = await axios.post("/product/list", input);
		// setProductList(response.data.productList);
		// console.log(response.data.productList);
		// Log productDate for each product
		
		setResult(response.data);
		loading.current = false;

		//const productListVO = response.data.productList;
	}, [input, productColumn, productKeyword]);

	const loadMoreProductList = useCallback(async () => {
		loading.current = true;
		const response = await axios.post("/product/list", input);
		// console.log(response.data.productList);
		setResult({
			...result,
			last: response.data.last,
			productList: [...result.productList, ...response.data.productList]
		});
		loading.current = false;
	}, [input.beginRow, input.endRow]);

	const setFirstPage = useCallback(() => {
		setPage(prev => null);
		setTimeout(() => {
			setPage(prev => 1);
		}, 1); // 이 코드는 1ms 뒤에 실행해라
	}, [page]);

	// - 스크롤의 현재 위치를 퍼센트로 계산하는 함수(Feat.ChatGPT)
	const getScrollPercent = useCallback(() => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrollPercent = (scrollTop / documentHeight) * 100;
		return scrollPercent;
	}, []);

	// ref - 로딩중에 추가로딩이 불가능하게 처리
	const loading = useRef(false);

	// callback
	const changeInput = useCallback(e => {
		setInput({
			...input,
			[e.target.name]: e.target.value
		});
	}, [input]);

	const clearInput = useCallback(() => {
		setInput({
			column: "",
			keyword: "",
			beginRow: "",
			endRow: ""
		});
		setFirstPage();
	}, [input]);

	const checkColumnKeyword = useMemo(() => {
		if (productColumn !== null && productKeyword !== null) {
			setInput({
				...input,
				column: productColumn,
				keyword: productKeyword
			});
			setFirstPage();
		}
	}, [productColumn, productKeyword]);

	// GPT 이용해서 만든 숫자에 콤마 찍기 함수
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('ko-KR').format(amount);
	};

	//시간 계산 함수 (매개변수)
	const timeCalculate = (productTime) => {
		const date = moment.utc(productTime).tz('Asia/Seoul'); // 한국 시간으로 변환
    	const nowDate = moment().tz('Asia/Seoul'); // 현재 시간을 한국 시간으로 설정
		const milliSeconds = nowDate.diff(date); //상품 등록 시간을 밀리초로 변경

		const seconds = milliSeconds / 1000; 
		const minutes = seconds / 60;
		const hours = minutes / 60;
		const days = hours / 24;
		const months = days / 30;
		const years = months / 12;


		if (seconds < 60) {
			return "방금 전";
		} else if (minutes < 60) {
			return `${Math.floor(minutes)}분 전`;
		} else if (hours < 24) {
			return `${Math.floor(hours)}시간 전`;
		} else if (days < 30) {
			return `${Math.floor(days)}일 전`;
		} else if (months < 12) {
			return `${Math.floor(months)}달 전`;
		} else {
			return `${Math.floor(years)}년 전`;
		}
	};

	// 좋아요 기능
	const pushLike = useCallback(async (productNo) => {
		const response = await axios.get("/product/like/" + productNo);

		//좋아요가 상세에서는 한번에 관리되므로 목록에서는 따로 관리 해줌
		setLike(prev => ({
			...prev,
			[productNo]: response.data.checked
		}));

		setLikes(response.data.count);
		checkLikes(productNo);
	}, [setLike, setLikes])

	// 좋아요 했는지 확인
	const checkLikes = useCallback(async (productNo) => {
		if (memberId === "") return;
		const response = await axios.get("/product/check/" + productNo);
		if (response.data.checked) {
			setLike(true);
		}
		else {
			setLike(false);
		}
		setLikes(response.data.count);
	}, [like, likes]);

	//좋아아요 아이콘 변경
	const handleHeart = () => {
		setLike(!like);
	}

	return (<>

		{/* 광고 */}

		<div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
			<div className="carousel-inner">
				<div className="carousel-item active">
					<img src="https://placehold.co/400x200" className="d-block w-100" alt="..." />
				</div>
				<div className="carousel-item">
					<img src="https://placehold.co/400x200" className="d-block w-100" alt="..." />
				</div>
				<div className="carousel-item">
					<img src="https://placehold.co/400x200" className="d-block w-100" alt="..." />
				</div>
			</div>
			<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
				<span className="carousel-control-prev-icon" aria-hidden="true"></span>
				<span className="visually-hidden">Previous</span>
			</button>
			<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
				<span className="carousel-control-next-icon" aria-hidden="true"></span>
				<span className="visually-hidden">Next</span>
			</button>
		</div>




		{/* <div classNameName="col-sm-4 col-md-4 col-lg-3 mt-3">
  <div classNameName="Carousel">
      <Carousel.Item>
        <img src="https://placehold.co/800x600" text="First slide" />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://placehold.co/800x600" text="Second slide" />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src="https://placehold.co/800x600" text="Third slide" />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </div>
    </div> */}

		{/* 검색창 */}
		{/* <div className="row mt-4">
			<div className="col-6 offset-3">
				<div className="input-group w-auto">
					<select type="search" className="form-select bg-white" 
							name="column" value={input.column} onChange={changeInput}>
						<option value="">선택</option>
						<option value="product_name">상품명</option>
						<option value="product_member">판매자</option>
					</select>
					<input type="search" className="form-control w-auto bg-white" 
							name="keyword" value={input.keyword} onChange={changeInput}/>
					<button type="button" className="btn btn-dark d-flex justify-content-center align-items-center" onClick={loadProductList}>
						<FaMagnifyingGlass />
						검색
					</button>
				</div>
			</div>
		</div> */}


		{/* 상품 목록 */}
		<div className="row mt-4">
			{result.productList.map((product) => (
				<div className="col-sm-5 col-md-5 col-lg-2 mt-3" key={product.productNo}
					onClick={e => { navigate("/product/detail/" + product.productNo); }}>
					<div className="card">
						<img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`}
							className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />

						<div className="card-body">
							<h5 className="card-title justify-content-start align-items-center"
								style={{
									width: "100%",
									overflow: "hidden",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									display: "block"
								}}>
								{/* 상품 이름 */}
								{product.productName}
							</h5>
							<div className="card-text mt-3">
								{/* {product.productDetail} */}
								<h5>
									<div className="text-start" style={{ fontWeight: "600" }}>
										{formatCurrency(product.productPrice)}원
									</div>
								</h5>
								<div className="text-muted mt-1">
									{timeCalculate(product.productDate)}
								</div>
								<div className="text-end mt-1"
									style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
									onClick={e => { e.stopPropagation(); pushLike(product.productNo); }}>
									{/* 상품 상태 */}
									{product.productState === "판매중" && (
										<span className='badge bg-primary me-2' >
											{product.productState}
										</span>
									)}
									{product.productState === "판매보류" && (
										<span className='badge bg-danger me-2'>
											{product.productState}
										</span>
									)}
									{product.productState === "판매완료" && (
										<span className='badge bg-success me-2'>
											{product.productState}
										</span>
									)}
									{like[product.productNo] ? (
										<FaHeart className="text-danger" size="30" />
									) : (
										<FaRegHeart className="text-danger" size="30" />
									)}
									{/* {product.productLikes} 좋아요 수는 안보여줘도 될듯*/}

								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>








	</>);
};
export default ProductList;