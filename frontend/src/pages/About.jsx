import React from "react";

const About = () => {
  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
    background: "#18181b",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    textAlign: "center",
  };

  const socialBtnStyle = {
    display: "inline-block",
    margin: "10px",
    padding: "10px 20px",
    background: "#27272a",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  return (
    <div style={containerStyle}>
      <img
        src="/dp.jpg"
        alt="Ujjwal Kumar"
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          objectFit: "cover",
          border: "4px solid #f97316",
          marginBottom: "20px",
          boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
        }}
      />

      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "10px",
          color: "#fff",
        }}
      >
        About Me
      </h2>

      <h3
        style={{
          fontSize: "1.5rem",
          color: "#f97316",
          marginBottom: "15px",
        }}
      >
        Ujjwal Kumar
      </h3>

      <p
        style={{
          color: "#a1a1aa",
          fontSize: "1.1rem",
          lineHeight: "1.8",
          maxWidth: "700px",
          margin: "0 auto 30px auto",
        }}
      >
        Hi! I'm <strong>Ujjwal Kumar</strong>, a third-year B.Tech student in
        Electronics and Communication Engineering (ECE). I am passionate about
        Full Stack Web Development, Data Structures & Algorithms, and building
        scalable MERN Stack applications. This project, <strong>ShopNest</strong>,
        is a modern e-commerce platform featuring secure authentication, product
        management, shopping cart, order management, Razorpay payment
        integration, and an admin dashboard.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <a
          href="https://github.com/iamujjwal08"
          target="_blank"
          rel="noreferrer"
          style={socialBtnStyle}
        >
          💻 GitHub
        </a>

        <a
          href="hhttps://www.linkedin.com/in/ujjwal-kumar-344390215/"
          target="_blank"
          rel="noreferrer"
          style={{
            ...socialBtnStyle,
            background: "rgba(59,130,246,0.2)",
            borderColor: "#3b82f6",
            color: "#3b82f6",
          }}
        >
          💼 LinkedIn
        </a>

        <a
          href="ujjwalkumar91622408@gmail.com"
          style={{
            ...socialBtnStyle,
            background: "rgba(249,115,22,0.2)",
            borderColor: "#f97316",
            color: "#f97316",
          }}
        >
          📧 Email
        </a>
      </div>
    </div>
  );
};

export default About;