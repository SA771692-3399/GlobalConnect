import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/GlobalConnect.png";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import "./mainCss.css";

import axios from "axios";

import Footer from "./Footer";

import Topnav from "./Topnav";

import MainNav from "./MainNav";

function Register2() {

const nav = useNavigate();

const [username, setUsername] = useState("");

const [email, setEmail] = useState("");

const [password, setPassword] = useState("");

const [confirmPassword, setConfirmPassword] = useState("");

const [Role, setRole] = useState("User"); // Default Role is set to User

const notifySuccess = (message) => toast.success(message);

const notifyError = (message) => toast.error(message);

const validateForm = () => {

let isValid = true;

if (!username.trim()) {

notifyError("Username is required");

isValid = false;

}

if (!email.trim()) {

notifyError("Email is required");

isValid = false;

}

if (!password.trim()) {

notifyError("Password is required");

isValid = false;

} else if (password.length < 6) {

notifyError("Password must be at least 6 characters");

isValid = false;

}

if (confirmPassword !== password) {

notifyError("Passwords do not match");

isValid = false;

}

return isValid;

};

const handleSubmit = async (e) => {

e.preventDefault();

if (validateForm()) {

try {

const res = await axios.post("http://localhost:8000/signup", {

UserName: username,

Email: email,

Password: password,

Role: Role,

});

notifySuccess("Registration successful. You can now login.");

nav("/login", { replace: true });

} catch (error) {

console.error("Error during registration:", error);

notifyError("Failed to register. Please try again later.");

}

}

};

return (

<>

<Topnav />

<MainNav />

<div className="registration-form" style={{ backgroundImage: 'url("./p3.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>

<ToastContainer />

<form onSubmit={handleSubmit} className="mt-5">

<div className="register-logo" style={{width:'100%' , background:"#7e5888", display:"flex", justifyContent:"center"}}>

<img src={logo} alt="Company Logo" style={{widows:'10rem', height:"8rem"}}/>

</div>

<div className="form-group" >

<span class="label label-default ml-1 mt-5">Role</span>

<select

id="Role"

className="form-control item"

value={Role}

onChange={(e) => setRole(e.target.value)}

>

<option value="User">User</option>

</select>

</div>

<div className="form-group">

<span class="label label-default ml-1">Username</span>

<input

type="text"

className="form-control item"

value={username}

onChange={(e) => setUsername(e.target.value)}

placeholder="Enter Your Username"

required

/>

</div>

<div className="form-group">

<span class="label label-default ml-1">Email</span>

<input

type="email"

className="form-control item"

placeholder="Enter Your Email"

value={email}

onChange={(e) => setEmail(e.target.value)}

required

/>

</div>

<div className="form-group">

<span class="label label-default ml-1">Password</span>

<input

type="password"

placeholder="Enter Password"

className="form-control item"

value={password}

onChange={(e) => setPassword(e.target.value)}

required

/>

</div>

<div className="form-group">

<span class="label label-default ml-1">Confirm Password</span>

<input

type="password"

className="form-control item"

placeholder="Enter Confirm Password"

value={confirmPassword}

onChange={(e) => setConfirmPassword(e.target.value)}

required

/>

</div>

<div className="form-group">

<button type="submit" className="btn btn-block create-account" style={{ background: "#7e5888" }}>

Create Account

</button>

</div>

<div className="login-link">

Already have an account? <Link to="/login">Login</Link>

</div>

</form>

</div>

<Footer/>

</>

);

}

export default Register2;