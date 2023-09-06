import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import api from "./api/instance";

import { TbArrowRampLeft3 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function Busket() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(100);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const handlePageChange = (event, newPage) => {
    setSkip(limit * newPage - limit);
    setCurrentPage(newPage);
  };

  function getProducts() {
    if (JSON.parse(localStorage.getItem("buyProducts"))) {
      setProducts(JSON.parse(localStorage.getItem("buyProducts")));
    }
  }

  useEffect(() => getProducts(), [skip]);
  useEffect(() => setTotal(products.length), [products]);

  return (
    <section>
      <header>
        <h1>Dummy Rest API</h1>
        <button className="btn btn-dark" onClick={() => navigate("/")}>
          <TbArrowRampLeft3 />
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
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
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
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        count={Math.ceil(total / limit)}
        page={currentPage}
        onChange={handlePageChange}
      />
    </section>
  );
}
