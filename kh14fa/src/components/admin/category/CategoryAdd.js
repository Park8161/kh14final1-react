import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import Jumbotron from "../../Jumbotron";

const CategoryAdd = () => {
    const navigate = useNavigate();

    // State Variables
    const [category, setCategory] = useState([]);
    const [group1, setGroup1] = useState();
    const [group2, setGroup2] = useState();
    const [group3, setGroup3] = useState();
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [input, setInput] = useState({
        productName: "",
        productCategory: "",
        productPrice: 0,
        productDetail: "",
        productQty: 0,
    });

    // 카테고리 리스트 가져오기
    const loadCategory = useCallback(async () => {
        const response = await axios.get("/admin/category/listP"); // 주소 listP 맞음
        setCategory(response.data);
    }, []);

    // 카테고리 경로 표시 (상위 카테고리들)
    const loadRoot = useMemo(() => {
        const name = {
            group1Name: category.filter(category => category.categoryNo === group1)[0]?.categoryName || "",
            group2Name: category.filter(category => category.categoryNo === group2)[0]?.categoryName || "",
            group3Name: category.filter(category => category.categoryNo === group3)[0]?.categoryName || ""
        };
        setCategoryName(name.group3Name);
        setInput({
            ...input,
            productCategory: group3
        });
        return name;
    }, [category, group1, group2, group3]);

    // 카테고리 찾기
    const findCategory = useCallback(() => {
        const findCat = category.filter(category => category.categoryName === categoryName)[0] || "";
        if (findCat === "" && categoryName.length > 0) {
            setMessage("없는 카테고리 번호");
            setInput({
                ...input,
                productCategory: ""
            });
            return;
        }
        setInput({
            ...input,
            productCategory: findCat.categoryNo
        });
        setGroup3(findCat.categoryNo);
        setGroup2(findCat.categoryUpper);
        setGroup1(findCat.categoryGroup);
        setMessage("");
    }, [categoryName, input, category]);

    // 카테고리 선택
    const changeInput = useCallback(e => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    // 카테고리 등록 기능
    const addCategory = async () => {
        if (!categoryName.trim()) {
            toast.error("카테고리 이름을 입력해 주세요");
            return;
        }

        const newCategory = {
            categoryName,
            categoryGroup: group1,
            categoryUpper: group2,
            categoryDepth: 1, // 기본적으로 1로 설정
        };

        try {
            await axios.post("/admin/category/insert", newCategory);
            toast.success("카테고리 추가 완료");
            navigate("/admin/category/list");
        } catch (error) {
            toast.error("카테고리 추가 실패");
            console.error(error);
        }
    };

    useEffect(() => {
        loadCategory();
    }, [loadCategory]);

    return (
        <>
            <Jumbotron title="카테고리 추가 페이지" />

            <div className="row mt-4">
                <div className="col">
                    <label>
                        카테고리
                        <span className="text-danger ms-1">{message}</span>
                    </label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onBlur={findCategory} // 카테고리 찾기
                        />
                        <input
                            type="number"
                            name="productCategory"
                            value={categoryName.length > 0 ? input.productCategory : ""}
                            className="form-control"
                            onChange={changeInput}
                            disabled
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-2">
                <div className="col">
                    {loadRoot.group1Name} {loadRoot.group1Name.length > 0 && (<FaChevronRight />)}
                    {loadRoot.group2Name} {loadRoot.group2Name.length > 0 && (<FaChevronRight />)}
                    {loadRoot.group3Name}
                </div>
            </div>

            {/* 카테고리 선택 */}
            <div className="row mt-2">
                <div className="col-3">
                    {category.filter(category => category.categoryDepth === 1).map((cat) => (
                        <ul className="list-group" key={cat.categoryNo}>
                            <li
                                className={`list-group-item list-group-item-action ${group1 === cat.categoryNo && "bg-secondary text-light"}`}
                                onClick={() => { setGroup1(cat.categoryNo); setGroup2(0); }}
                                value={cat.categoryNo}
                            >
                                {cat.categoryName}
                            </li>
                        </ul>
                    ))}
                </div>
                <div className="col-3">
                    {category.filter(category => category.categoryDepth === 2 && category.categoryGroup === group1).map((cat) => (
                        <ul className="list-group" key={cat.categoryNo}>
                            <li
                                className={`list-group-item list-group-item-action ${group2 === cat.categoryNo && "bg-secondary text-light"}`}
                                onClick={() => { setGroup2(cat.categoryNo); setGroup3(0); }}
                                value={cat.categoryNo}
                            >
                                {cat.categoryName}
                            </li>
                        </ul>
                    ))}
                </div>
                <div className="col-3">
                    {category.filter(category => category.categoryDepth === 3 && category.categoryGroup === group1 && category.categoryUpper === group2).map((cat) => (
                        <ul className="list-group" key={cat.categoryNo}>
                            <li
                                className={`list-group-item list-group-item-action ${group3 === cat.categoryNo && "bg-secondary text-light"}`}
                                onClick={() => setGroup3(cat.categoryNo)}
                                value={cat.categoryNo}
                            >
                                {cat.categoryName}
                            </li>
                        </ul>
                    ))}
                </div>
            </div>

            {/* 카테고리 추가 버튼 */}
            <div className="row mt-4">
                <div className="col">
                    <button className="btn btn-primary" onClick={addCategory}>카테고리 추가</button>
                </div>
            </div>
        </>
    );
};

export default CategoryAdd;
