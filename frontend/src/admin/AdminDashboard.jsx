import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analytics", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        console.log("Analytics:", data);

        if (res.ok) {
          setStats({
            totalOrders: data.totalOrders || 0,
            totalProducts: data.totalProducts || 0,
            totalUsers: data.totalUsers || 0,
            totalRevenue: data.totalRevenue || 0,
          });
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: "25px",
    background: "#18181b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,.35)",
  };

  const numberStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#f97316",
  };


  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Redirecting to login...
      </div>
    );
  }


  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>Admin Dashboard</h1>

      <p>
        Welcome <b>{user?.name || "Admin"}</b>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <div style={numberStyle}>{stats.totalOrders}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Products</h3>
          <div style={numberStyle}>{stats.totalProducts}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <div style={numberStyle}>{stats.totalUsers}</div>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <div style={numberStyle}>
            ₹{Number(stats.totalRevenue).toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "50px",
          padding: "25px",
          background: "#18181b",
          borderRadius: "12px",
        }}
      >
        <h2>Admin Controls</h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <button
            className="btn"
            onClick={() => navigate("/admin/add-product")}
          >
            Add Product
          </button>

          <button
            className="btn"
            onClick={() => navigate("/admin/products")}
          >
            Manage Products
          </button>

          <button
            className="btn"
            onClick={() => navigate("/admin/orders")}
          >
            Manage Orders
          </button>

          <button
            className="btn"
            onClick={() => navigate("/admin/users")}
          >
            Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;