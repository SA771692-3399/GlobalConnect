import React from 'react';

export default function Footer() {
  return (
    <>

      <div className="bottom-0 " >
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#ba81ad' }}>
          <section className="d-flex justify-content-between p-4" style={{ backgroundColor: '#ba81ad' }}>
          
            <div>
              <a href="/" className="text-white me-4"><i className="fab fa-facebook-f"></i></a>
              <a href="/" className="text-white me-4"><i className="fab fa-twitter"></i></a>
              <a href="/" className="text-white me-4"><i className="fab fa-google"></i></a>
              <a href="/" className="text-white me-4"><i className="fab fa-instagram"></i></a>
              <a href="/" className="text-white me-4"><i className="fab fa-linkedin"></i></a>
              <a href="/" className="text-white me-4"><i className="fab fa-github"></i></a>
            </div>
          </section>
          <section className="">
            <div className="container text-center text-md-start mt-5">
              <div className="row mt-3">
                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">Global Connect</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <div style={{textAlign:"justify"}}>
                  Welcome to Global Connect's Services page, where we offer a range of tailored solutions designed to bring the vibrant essence of Indian culture directly to your doorstep.
                  </div>
                </div>
                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">WEBMAP</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p><a href="http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/Blogs" className="text-white">Blog's</a></p>
                  <p><a href="http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/FaQs" className="text-white">FAQs</a></p>
                  <p><a href="http://ec2-52-14-66-37.us-east-2.compute.amazonaws.com:8000/products" className="text-white">Products</a></p>
               
                </div>
                
                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                  <h6 className="text-uppercase fw-bold">Contact</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <p><i className="fas fa-home mr-3"></i> New York, NY 10012, US</p>
                  <p><i className="fas fa-envelope mr-3"></i> globalconnect@example.com</p>
                  <p><i className="fas fa-phone mr-3"></i> + 01 234 567 88</p>
                  <p><i className="fas fa-print mr-3"></i> + 01 234 567 89</p>
                </div>
                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold">Subscribe Newsletter</h6>
                  <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                  <div style={{textAlign:"justify"}}>
                  News listeners play a crucial role in staying updated and informed about current events, trends, and developments across various domains.
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            © 2024 Copyright :
            <a className="text-white" href="/"> globalconnect.com</a>
          </div>
        </footer>
      </div>
    </>
  );
}
