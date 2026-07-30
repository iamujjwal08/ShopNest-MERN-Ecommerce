import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { verifyOtpRequest, resendOtpRequest } from '../services/authService';
import '../styles/auth.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [, setOtpExpired] = useState(false);

  // If a user lands here directly without completing step 1, send them back
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    // Only allow digits, max 6 characters
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
    if (error) setError('');
  };

  const validateOtp = () => {
    if (!otp || otp.trim() === '') {
      setError('OTP is required');
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be exactly 6 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateOtp()) return;

    setLoading(true);
    try {
      const res = await verifyOtpRequest(email, otp);
      const data = res.data;

      setSuccessMsg('Login Successful');
      login(data);
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 410) {
        setError(message || 'OTP Expired. Please request a new OTP.');
        setOtpExpired(true);
      } else if (status === 400) {
        setError(message || 'Wrong OTP');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setOtp(''); // clear only the OTP field
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccessMsg('');
    setResending(true);
    try {
      await resendOtpRequest(email);
      setOtp('');
      setOtpExpired(false);
      setSuccessMsg('A new OTP has been sent to your email');
    } catch (err) {
      setError('Could not resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to {email}</p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          disabled={loading}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <p>
          Didn't get the code, or it expired?{' '}
          <button
            type="button"
            className="link-btn"
            onClick={handleResend}
            disabled={resending || loading}
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </p>
        <p><Link to="/login">Back to Login</Link></p>
      </form>
    </div>
  );
};

export default VerifyOtp;
