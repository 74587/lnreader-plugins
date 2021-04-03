const express = require("express");
const extensions = require("./src/extensions");

const app = express();

app.use(
    express.json({
        extended: false,
    })
);

app.get("/", (req, res) =>
    res.json({
        Author: "@rajarsheechatterjee",
        Version: "1.0.0",
        Github: "https://github.com/rajarsheechatterjee/lnreader-extensions",
    })
);

app.get("/api/", (req, res) => res.json(extensions));
app.use("/api/1/", require("./src/en/boxnovel/boxnovel"));
app.use("/api/2/", require("./src/en/readlightnovel/readlightnovel"));
app.use("/api/3/", require("./src/en/fastnovel/fastnovel"));
app.use("/api/4/", require("./src/en/readnovelfull/readnovelfull"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
