export default {
    PORT: process.env["PORT"] || "3000",
    rootSericeUrl: "http://localhost:3000",
    jwtSecret: "moneywhereappsupersecret",
    oAuth: {
        facebook: {
            appId: "419813812194601",
            secret: "05f1c36d88060bfa35de6c452fd92dfb",
        },
        google: {
            appId: "506966885004-0cgval2i0icnrbtl5tuf40qr0e1f5quf.apps.googleusercontent.com",
            secret: "I18IFPw9_GnbngjIjsFfSOad",
        }
    }

};