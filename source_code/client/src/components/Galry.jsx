import React, { useEffect, useState } from "react";
import http from "axios";

import './Galry.css';

export default function Galry({
    handleBackToProducts,
    selectedProduct,
    addToCart,
}) {
    const [data, setData] = useState({});
    const [datas, setDatas] = useState([]);
    const [selectedImg, setSelectedImg] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token found");
            return;
        }
        http.defaults.headers.common["Authorization"] = "Bearer " + token;

        const fetchAllData = async () => {
            try {
                const res = await http.get(`http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/getallproductimgs/${selectedProduct._id}`);
               
                setDatas(res.data.productImages || []);
                console.log(res.data.productImages);
            } catch (error) {
                setError("Error fetching data");
            }
        };
        fetchAllData();
    }, [selectedProduct._id]);

    return (
        <>
            <div className="container mb-5"  style={{border:"none", boxShadow:"none"}}>
       
        <div className="row justify-content-center text-center" style={{border:"none", boxShadow:"none"}}>
          <div className="col-12 col-lg-12 mt-2 col-md-12 col-sm-12 " style={{border:"none", boxShadow:"none"}}>
            <div className="card" id="cds" style={{border:"none", boxShadow:"none", borderRadius:"none"}} >
             

              <img
                className=" "
                id="cardi-img"
                style={{border:"none", boxShadow:"none", borderRadius:"none"}}
                src={
                  selectedImg === undefined
                    ? "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/" + selectedProduct.image
                    : selectedImg
                }
                alt=""
              />

             
              <div className="card-body">
                
              </div>
              <div className="imgContainer mb-2" id="imgContainer-resp" style={{display:"flex", justifyContent:"center"}}>
                {datas.map((img, index) => (
                  <img
                    src={"http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/" + img.image}
                    style={{
                      border:
                        selectedImg ===
                        "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/" + img.image
                          ? "4px solid skyblue"
                          : "",
                          width:"5rem",
                          height:"5rem",
                          margin:"5px"
                    }}
                    key={index++}
                    alt=""
                    onClick={() =>
                      setSelectedImg(
                        "http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/" + img.image
                      )
                    }
                    className="smallImg m-1"
                    id="smallImg-resp"
                   
                  ></img>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
    );
}
