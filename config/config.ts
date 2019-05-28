export default {
    PORT: process.env["PORT"] || "3000",
    rootServiceUrl: "http://localhost:3000",
    jwtSecret: "moneywhereappsupersecret",
    oAuth: {
        facebook: {
            appId: process.env["facebookAppId"],
            secret: process.env["facebookAppSecret"],
        },
        google: {
            appId:process.env["googleAppId"],
            secret: process.env["googleAppId"]
        }
    }

};
