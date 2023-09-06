import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import api from "./api/instance";

import { TbShoppingCartPlus, TbX } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [buyProducts, setBuyProducts] = useState([]);
  const [total, setTotal] = useState(100);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const handlePageChange = (event, newPage) => {
    setSkip(limit * newPage - limit);
    setCurrentPage(newPage);
  };

  function getProducts() {
    api.get(`/products?limit=${limit}&skip=${skip}`).then(({ data }) => {
      setProducts(data.products);
      setTotal(data.total);
    });
  }

  useEffect(() => getProducts(), [skip]);

  useEffect(() => {
    if (buyProducts && buyProducts.length > 0) {
      localStorage.setItem("buyProducts", JSON.stringify(buyProducts));
    }
  }, [buyProducts]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("buyProducts"))) {
      setBuyProducts(JSON.parse(localStorage.getItem("buyProducts")));
    }
    api.get(`/products?limit=${total}`).then(({ data }) => {
      setAllProducts(data.products);
    });
  }, []);

  const getBuyProductId = (id) => {
    const res = buyProducts.filter((item) => item.id === id);
    return res[0] && res[0].id;
  };

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < allProducts.length; i++) {
      if (
        allProducts[i].title.toUpperCase().startsWith(searchInput.toUpperCase())
      ) {
        arr.push(allProducts[i]);
      }
    }
    setSearchProducts(arr);
  }, [searchInput]);
  return (
    <section>
      <header>
        <h1>Dummy Rest API</h1>
        <input
          type="text"
          className="form-control"
          style={{ width: "50%" }}
          placeholder="Enter the title of the product you are looking for"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn-success" onClick={() => navigate("/busket")}>
          Busket {buyProducts.length > 0 && buyProducts.length}
        </button>
      </header>
      <table className="table text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchInput === ""
            ? products.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img src={item.thumbnail} height={"50px"} />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.rating}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ padding: 0, margin: "0.375em 0.75em" }}
                    >
                      {getBuyProductId(item.id) ? (
                        <TbX
                          style={{ fontSize: "26px" }}
                          onClick={() => {
                            buyProducts.length == 1 && localStorage.setItem("buyProducts", null);
                            setBuyProducts(buyProducts.filter((pro) => pro.id !== item.id));
                          }}
                        />
                      ) : (
                        <TbShoppingCartPlus
                          style={{ fontSize: "26px" }}
                          onClick={() =>
                            setBuyProducts((prev) => [...prev, item])
                          }
                        />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            : searchProducts.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <img src={item.thumbnail} height={"50px"} />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.rating}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>
                    <button
                      className="btn"
                      style={{ padding: 0, margin: "0.375em 0.75em" }}
                    >
                      {getBuyProductId(item.id) ? (
                        <TbX
                          style={{ fontSize: "26px" }}
                          onClick={() => {
                            buyProducts.length == 1 && localStorage.setItem("buyProducts", null);
                            setBuyProducts(buyProducts.filter((pro) => pro.id !== item.id));
                          }}
                        />
                      ) : (
                        <TbShoppingCartPlus
                          style={{ fontSize: "26px" }}
                          onClick={() =>
                            setBuyProducts((prev) => [...prev, item])
                          }
                        />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      {searchInput === "" && (
        <Pagination
          count={Math.ceil(total / limit)}
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </section>
  );
}
