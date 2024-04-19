const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");

function authenticateLogin(account, config) {
  return new Promise((resolve, reject) => {
    const client = new SteamUser();
    let isSuccess = false;

    client.logOn({
      accountName: account.user.username,
      password: account.user.password,
    });

    client.on("steamGuard", (domain, callback) => {
      console.log(`SteamGuard required for account ${account.user.username}`);
      if (!domain && account.steamguard) {
        const code = SteamTotp.getAuthCode(account.steamguard.shared_secret);
        console.log(`Auto-entering code ${code} (mobile authenticator) for account ${account.user.username}`);
        callback(code);
      } else {
        console.log(`Enter code for account ${account.user.username} at ${domain}`);
        const readline = require("readline").createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        readline.question("Code: ", (code) => {
          readline.close();
          callback(code);
        });
      }
    });

    client.on("loggedOn", async () => {
      console.log(`Logged in as ${account.user.username}`);
      await client.setPersona(SteamUser.EPersonaState.Online);
      await client.gamesPlayed(config.games);
      console.log(`Hourboosting started successfully for account ${account.user.username}`);
      isSuccess = true;
      resolve(isSuccess);
    });

    client.on("error", async (err) => {
      console.error(`Error on account ${account.user.username}: ${err.message}`);
      if (err.message.includes("RateLimitExceeded")) {
        console.log(`Rate limit exceeded for account ${account.user.username}. Skipping to the next account.`);
      } else {
        console.error(`Failed to log in to account ${account.user.username}: ${err.message}`);
      }
      resolve(isSuccess);
    });

    client.on("disconnected", () => {
      console.log(`Disconnected from account ${account.user.username}`);
    });
  });
}

module.exports = { authenticateLogin };