import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Sell.css";
export default function SellerP({PID}) {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("No token found");
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get(
          `http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/user/sel/${PID}`
        );
        setUserData(response.data.userData); // Set user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
        <p style={{marginLeft:"1rem"}}>Seller Information Card</p>
      {userData ? (
        
          <div >
            <div className="row d-flex ">
              <div className="col-md-7">
                <div className="card p-3 py-4">
                  <div className="text-center">
                    <img
                      src="data:image/png;base64,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"
                      width="5rem"
                      className="rounded-circle"
                      style={{ width: "5rem", height: "5rem" }}
                      alt=""
                    />
                  </div>

                  <div className="text-center mt-3">
                    <h5 className="mt-2 mb-0">{userData.UserName}</h5>
                    <p>{userData.Role}</p>
                    <p style={{fontSize:"12px"}}>Address: {userData.Address}</p>
                    <div className="buttons">
                      <button className="btn btn-outline-primary px-4">
                        <a href={`mailto:${userData.Email}`} style={{color:"black", textDecoration:"none"}}>Email</a>
                      </button>

                      <button className="btn btn-primary px-4 ms-3">
                        <a href={`tel:${userData.PhoneNumber}`} style={{color:"white", textDecoration:"none"}}>Contact</a>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
     
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
