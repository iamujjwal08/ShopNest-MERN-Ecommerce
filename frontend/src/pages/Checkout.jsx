import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import API_URL from "../config";
const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // ---------------- COD ----------------
  const placeCODOrder = async () => {
    try {
      console.log("User:", user);
      console.log("Token:", user?.token);
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item._id || item.productId,
            qty: item.qty,
            price: item.price,
          })),
          totalAmount: totalPrice,
          address,
          paymentMethod: "COD",
          paymentId: "",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order Placed Successfully!");

        dispatch(clearCart());

        navigate("/ordersuccess");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- Razorpay ----------------
  const handlePayment = async () => {
    try {
      const orderRes = await fetch(
        `${API_URL}/api/payment/order`,  
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );

      const orderData = await orderRes.json();
      console.log(orderData);

      if (!orderRes.ok) {
        alert(orderData.message);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay Test Key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopNest",
        description: "Order Payment",
        order_id: orderData.id,

        handler: async function (response) {
          const verifyRes = await fetch(
            `${API_URL}/api/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          const verifyData = await verifyRes.json();

            console.log("Verify Response:", verifyData);

            if (!verifyRes.ok) {
            alert(verifyData.message);
            return;
          }   

          const saveOrderRes = await fetch(
            `${API_URL}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                items: cartItems.map((item) => ({
                  productId: item._id || item.productId,
                  qty: item.qty,
                  price: item.price,
                })),

                totalAmount: totalPrice,

                address,

                paymentMethod: "Razorpay",

                paymentId: response.razorpay_payment_id,
              }),
            }
          );

          const saveData = await saveOrderRes.json();

          console.log("Order Response:", saveData);

          if (saveOrderRes.ok) {
            dispatch(clearCart());
            navigate("/ordersuccess");
          } 
          else {
            alert(saveData.message);
          }     
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: "9999999999",
        },

        theme: {
          color: "#f97316",
        },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed",function(response){
        console.log(response.error);
        alert(response.error.description);
      });

      razor.open();
    } 
    catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // ---------------- Submit ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    if (paymentMethod === "COD") {
      placeCODOrder();
    } else {
      handlePayment();
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>

          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) =>
              setAddress({ ...address, fullName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Street"
            required
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) =>
              setAddress({ ...address, city: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) =>
              setAddress({
                ...address,
                postalCode: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) =>
              setAddress({
                ...address,
                country: e.target.value,
              })
            }
          />

          <h3 style={{ marginTop: "20px" }}>Payment Method</h3>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "20px" }}>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {" "}Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                value="Razorpay"
                checked={paymentMethod === "Razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {" "}Online Payment (Razorpay)
            </label>
          </div>

          <div className="checkout-summary">
            <h3>Total: ₹{totalPrice.toFixed(2)}</h3>

            <button type="submit" className="btn">
              {paymentMethod === "COD"
                ? "Place Order"
                : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;