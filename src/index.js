import "@babel/polyfill/noConflict";
import server from "./graphqlServer";
import multer from "multer";
import prisma from "./prisma";
const fs = require("fs");
const path = require("path");

const upload = multer({
  dest: "client/public/img",
  limits: {
    fileSize: 5000000,
  },
});

server.express.post(
  "/checkout/rice",
  upload.single("rice"),
  async (req, res) => {
    const imgPath = path.join(__dirname, "../client/public/img");
    const oldPath = path.join(imgPath, req.file.filename);
    const newPath = path.join(imgPath, `${req.body.id}.${req.file.originalname.split('.')[1]}`);
    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err;
    });
    res.send();
  }
);
server.express.post(
  "/checkout/greens",
  upload.single("greens"),
  async (req, res) => {
    res.send();
  }
);
server.express.post(
  "/checkout/melonFruit",
  upload.single("melonFruit"),
  async (req, res) => {
    res.send();
  }
);
server.express.get("/test/test", async (req, res) => {
  res.send("test");
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up.");
});
