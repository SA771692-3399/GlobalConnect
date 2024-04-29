import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosContacts } from "react-icons/io";
import { IoMdContacts } from "react-icons/io";
import { RiContactsFill } from "react-icons/ri";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
export default function About() {
  return (
    <Container fluid className="d-flex justify-content-center flex-wrap py-4">
      <Row className="justify-content-center align-items-center">
        {achievements.map((achievement, index) => (
          <Col xs="12" sm="6" md="4" lg="3"  key={index}>
          <div style={{display:"flex", justifyContent:"center"}}>
          <div className="p-3 bg-white border rounded-lg shadow text-center " style={{ width: "15rem", }}>
              <a href={achievement.link} style={{color:"#7e5888"}}>
              <div style={{color:"#7e5888"}}>
              {achievement.icon}
              </div>
              </a>
              <div className="mt-3">
                <h5 className="font-weight-bold text-xl">{achievement.count}</h5>
                <p className="text-[1.2rem]">{achievement.label}</p>
              </div>
            </div>
          </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const achievements = [
  { icon: <IoIosContacts  size={60} />, count: "500+", label: "Our Customers", link: "#" },
  { icon: <IoMdContacts   size={60} />, count: "300+", label: "Our Sellers", link: "#" },
  { icon: <RiContactsFill   size={60} />, count: "10+", label: "Our Local Business Owner", link: "#" },
  { icon: <MdOutlineProductionQuantityLimits   size={60} />, count: "1500+", label: "Our Products", link: "#" },
];
