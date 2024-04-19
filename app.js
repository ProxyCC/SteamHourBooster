// Requirements for steamAPI.
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");

// Application function requirements.
const { logIntoAccounts } = require("./connections/accountLogin");
const { authenticateLogin } = require("./connections/authenticateLogin");

// Application settings.
const accounts = require("./settings/accounts.json");
const config = require("./settings/gamelist.json");

// Main application function.
async function main() {
    console.log(
      "© HourBoost.cloud\n\n" +
      "! Custom made version by ProxyCC\n" +
      "! Version 0.1 | DEV BUILD.\n"
    );

    if (accounts.length === 0) {
        console.log(
          "> No accounts have been found in settings/accounts.json.\n" +
          "> Make sure to add accounts to the json in the correct format."
        );
        return;
    }

    for (const account of accounts) {
        let successCount = 0;
        let failureCount = 0;

        const isSuccess = await authenticateLogin(account, config);
        if (isSuccess) {
            successCount++;
        } else {
            failureCount++;
        }
        console.log(`\nSuccessfully started boosting ${successCount} accounts.`);
        console.log(`Failed to boost ${failureCount} accounts.`);
    }
}
main();
