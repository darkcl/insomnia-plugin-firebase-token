const http = require("https");

module.exports.templateTags = [
  {
    name: "firebase",
    displayName: "Firebase token",
    description: "Generate firebase token",
    args: [
      {
        displayName: "Email",
        type: "string",
        defaultValue: "",
      },
      {
        displayName: "Password",
        type: "string",
        defaultValue: "",
      },
      {
        displayName: "Firebase API Key",
        type: "string",
        defaultValue: "",
      },
      {
        displayName: "Origin",
        type: "string",
        defaultValue: "",
      },
    ],
    async run(_, email, password, firebaseKey, origin) {
      if (email && password && firebaseKey) {
        return await generateToken(
          email,
          password,
          firebaseKey,
          origin && origin.length !== 0 ? origin : "http://localhost:8080"
        );
      } else {
        return "waiting values...";
      }
    },
  },
];

function generateToken(
  email,
  password,
  firebaseKey,
  origin = "http://localhost:8080"
) {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      hostname: "identitytoolkit.googleapis.com",
      port: null,
      path: `/v1/accounts:signInWithPassword?key=${firebaseKey}`,
      headers: {
        authority: "identitytoolkit.googleapis.com",
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7",
        "content-type": "application/json",
        origin,
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
      },
    };

    const req = http.request(options, function (res) {
      const chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const { idToken } = JSON.parse(body.toString());
        resolve(idToken);
      });
    });

    req.write(
      JSON.stringify({
        returnSecureToken: true,
        email,
        password,
      })
    );
    req.end();
  });
}
