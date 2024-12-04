import axios from 'axios';

// Define the base URL for API calls
const API_BASE_URL = 'https://localhost:7020';

const PasswordResetService = {
  // Send reset email
  sendResetEmail: async (email) => {
    console.log("Sending reset email for:", email);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/PasswordReset/send-reset-email`, null, {
        params: { email },
      });
      console.log("Reset email sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in sendResetEmail:", error.message);
      throw new Error(error.response?.data || "Failed to send reset email.");
    }
  },
  

  // Reset password
  resetPassword : async (resetToken, newPassword) => {
    try {
      const response = await axios.post(`/api/PasswordReset/reset-password`, null, {
        params: {
          resetToken: resetToken,
          newPassword: newPassword,
        },
      });
      console.log("Password reset successfully:", response.data);
    } catch (error) {
      console.error("Error in resetting password:", error.response?.data || error.message);
    }
  }
};

export default PasswordResetService;
