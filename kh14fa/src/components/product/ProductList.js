import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaRegHeart } from "react-icons/fa";
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from "react-router";


const ProductList = () => {
  // navigate
  const navigate = useNavigate();

  //state
  const [productList, setProductList] = useState([]);
  //임시 state 
  const [temp, setTemp] = useState({});
  
  //effect
  useEffect(()=>{
    loadListProduct();
  },[]);

  //목록
  const loadListProduct = useCallback(async()=>{
    const resp = await axios.post("/product/list", temp)
    setProductList(resp.data.productList);
    // console.log(resp.data.productList);
  },[temp]);

  // GPT 이용해서 만든 숫자에 콤마 찍기 함수
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };
  
  return (<>

  {/* 광고 */}
  
  <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src="https://placehold.co/400x200" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="https://placehold.co/400x200" className="d-block w-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="https://placehold.co/400x200" className="d-block w-100" alt="..."/>
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


    {/* 상품 목록 */}
 
    <div className="row mt-4">
      {productList.map((product)=>(
      <div className="col-sm-4 col-md-4 col-lg-3 mt-3" key={product.productNo} onClick={e=>navigate("/product/detail/"+product.productNo)}>
        <div className="card">
          <img src={`${process.env.REACT_APP_BASE_URL}/attach/download/${product.attachment}`} className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title">{product.productName}</h5>
            <div className="card-text">
               {product.productDetail}
              <div className="text-end">
              {formatCurrency(product.productPrice)}원
                <div className="btn btn-link"><FaRegHeart /></div>
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