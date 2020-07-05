import "@babel/polyfill/noConflict";
import server from "./graphqlServer";
import multer from "multer";
import sharp from "sharp";
const fs = require("fs");
const path = require("path");
const imgPath = (category) =>
  path.join(__dirname, `../client/public/img/checkout/${category}`);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
});

server.express.post(
  "/checkout/:category",
  upload.single("checkout"),
  async (req, res) => {
    sharp(req.file.buffer)
      .resize({ width: 200 })
      .toFile(path.join(imgPath(req.params.category), `${req.body.id}.png`));
    res.send();
  }
);

server.express.delete("/checkout/delete/:category/:id", async (req, res) => {
  fs.unlink(
    path.join(imgPath(req.params.category), `${req.params.id}.png`),
    (err) => {
      if (err) throw err;
    }
  );
  res.send();
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up.");
});
