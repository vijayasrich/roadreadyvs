import React, { useState } from 'react';
import PasswordResetService from '../services/PasswordResetService';
import './PasswordResetList.css';

const PasswordResetList = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('email'); // email or reset
  const [message, setMessage] = useState('');

  const handleSendResetEmail = async () => {
    try {
      await PasswordResetService.sendResetEmail(email);
      setMessage('Password reset email sent! Check your inbox.');
      setStep('reset');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await PasswordResetService.resetPassword(resetToken, newPassword);
      setMessage('Password has been reset successfully!');
      setStep('done');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="password-reset-container">
      {step === 'email' && (
        <div className="email-step">
          <h2>Reset Password</h2>
          <p>Enter your email address to receive the reset link.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendResetEmail}>Send Reset Email</button>
        </div>
      )}

      {step === 'reset' && (
        <div className="reset-step">
          <h2>Enter New Password</h2>
          <p>Check your email for the reset token.</p>
          <input
            type="text"
            placeholder="Reset Token"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}

      {step === 'done' && (
        <div className="done-step">
          <h2>Success!</h2>
          <p>{message}</p>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default PasswordResetList;
