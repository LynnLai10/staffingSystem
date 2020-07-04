import "@babel/polyfill/noConflict";
import server from "./graphqlServer";
import multer from "multer";
const fs = require("fs");
const path = require("path");
const imgPath = (category) =>
  path.join(
    __dirname,
    `../client/public/img/checkout${category && `/${category}`}`
  );
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../client/public/img/checkout/" + req.params.category)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
});

const renameImg = (req, res) => {
  const oldPath = path.join(imgPath(req.params.category), req.file.filename);
  const newPath = path.join(imgPath(req.params.category), `${req.body.id}.jpg`);
  fs.rename(oldPath, newPath, (err) => {
    if (err) throw err;
  });
  res.send();
};

server.express.post(
  "/checkout/:category",
  upload.single("checkout"),
  async (req, res) => {
    renameImg(req, res);
  }
);

server.express.delete("/checkout/delete/:category/:id", async (req, res) => {
  fs.unlink(
    path.join(imgPath(req.params.category), `${req.params.id}.jpg`),
    (err) => {
      if (err) throw err;
    }
  );
  res.send();
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("The server is up.");
});
