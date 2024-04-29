import React from 'react';
import logo from '../assets/GlobalConnect.png';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Topnav.css'; 

export default function MainNav() {
  return (
    <Navbar collapseOnSelect expand="lg" className="topnavbg ">
      <Navbar.Brand href="/">
        <img src={logo} alt="Global Connect Logo" className="mainLogo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNavAltMarkup" />
      <Navbar.Collapse id="navbarNavAltMarkup">
        <Nav className="navbar-nav ms-auto ">
          <Link className="nav-item nav-link " to="/" id='linkID' >
            HOME
          </Link>
          
          <Link className="nav-item nav-link " to="/products" id='linkID'>
            PRODUCT
          </Link>
          <Link className="nav-item nav-link " to="/Blogs" id='linkID'>
            BLOG
          </Link>
          <Link className="nav-item nav-link " to="/FaQs" id='linkID'>
            FAQ
          </Link>
          <Link className="nav-item nav-link " to="/registers" id='linkID'>
           USER SIGNUP
          </Link>
          <Link className="nav-item nav-link " to="/login" id='linkID'>
            SIGNIN
          </Link>
    
          <Link className="nav-item nav-link " to="/feedbacks" id='linkID' style={{marginRight:"4rem"}}>
            FEEDBACK
          </Link>
      
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
