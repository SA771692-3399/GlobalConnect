import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function AddFqa() {
  const nav = useNavigate();
  const [que, setQue] = useState("");
  const [ans, setAns] = useState("");

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const validateForm = () => {
    let isValid = true;

    if (!que.trim()) {
      notifyError("Question is required");
      isValid = false;
    }

    if (!ans.trim()) {
      notifyError("Answer is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        axios.defaults.headers.common["Authorization"] = "Bearer " + token;

        const res = await axios.post("http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/admin-seller/addFaq", {
          que: que,
          ans: ans,
        });
        notifySuccess("Successfully Inserted");
       
      } catch (error) {
        console.error("Error during registration:", error);
        notifyError("Fails to insert");
      }
    }
  };

  return (
    <>
      <div className="registration-form">
        <form onSubmit={handleSubmit} className="mt-5">
          <div style={{ display: "flex", justifyContent: "center" }}>ADD FQAs</div>

          <div className="form-group">
            <span className="label label-default ml-1">Question</span>
            <input
              type="text"
              className="form-control item"
              value={que}
              onChange={(e) => setQue(e.target.value)}
              placeholder="Enter Question"
              required
            />
          </div>
          <div className="form-group">
            <span className="label label-default ml-1">Answer</span>
            <input
              type="text"
              className="form-control item"
              placeholder="Enter Answer"
              value={ans}
              onChange={(e) => setAns(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block create-account"
              style={{ background: "#7e5888" }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddFqa;
