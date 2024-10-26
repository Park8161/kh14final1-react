import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaRegHeart } from "react-icons/fa";
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router";
import { throttle } from "lodash";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { productColumnState, productKeywordState } from "../../utils/recoil";

const ProductList = () => {
	// navigate
	const navigate = useNavigate();

	// recoil
	const productColumn = useRecoilValue(productColumnState);
	const productKeyword = useRecoilValue(productKeywordState);

	//state
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
		setResult(response.data);
		loading.current = false;
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
				column: productColumn,
				keyword: productKeyword
			});
		}
	}, [productColumn, productKeyword]);

	// GPT 이용해서 만든 숫자에 콤마 찍기 함수
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('ko-KR').format(amount);
	};

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
		<div className="row">
			<div className="col">
				<div className="input-group">
					<div className="col-3">
						<select className="form-select" name="column" value={input.column} onChange={changeInput}>
							<option value="">선택</option>
							<option value="product_name">상품명</option>
							<option value="product_member">판매자</option>
						</select>
					</div>
					<div className="col-7">
						<input type="search" className="form-control" name="keyword" value={input.keyword} onChange={changeInput} />
					</div>
					<div className="col-2">
						<button type="button" className="btn btn-secondary w-100" onClick={loadProductList}>
							<FaMagnifyingGlass />
							검색
						</button>
					</div>
				</div>
			</div>
		</div>


		{/* 상품 목록 */}
		<div className="row mt-4">
			{result.productList.map((product) => (
            <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e => navigate("/product/detail/" + product.productNo)}>
                <div className="card">

                    <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />

                    <div className="card-body">
                        <h5 className="card-title">{product.productName}</h5>
                        <div className="card-text">
                            {product.productDetail}
                            <div className="text-start">
                                {formatCurrency(product.productPrice)}원
                                {product.productState === "판매중" ? (
                                    <span className='badge bg-primary ms-2'>
                                        {product.productState}
                                    </span>
                                ) : (
                                    <span className='badge bg-danger ms-2'>
                                        {product.productState}
                                    </span>
                                )}
                            </div>
                            <div className="text-end d-flex justify-content-start align-items-center">
                                <FaRegHeart className="text-danger me-2" />
                                {product.productLikes}
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