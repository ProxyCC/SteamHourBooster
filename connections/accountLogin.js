const { authenticateLogin } = require("./authenticateLogin");

async function logIntoAccounts(account, config) {
  try {
    await authenticateLogin(account, config);
    // Additional logic after successful authentication
  } catch (error) {
    // Handle authentication errors
    console.error("Authentication failed:", error);
  }
}

module.exports = { logIntoAccounts };