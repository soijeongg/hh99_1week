import express from "express";
const app = express();
const PORT = 3000;

import goodsRouter from "./routes/products.router.js";

app.use("/api/products", [goodsRouter]);


app.get("/", (req, res) => {
  res.send("<h1>장터페이지 입나다</h1>");
});



app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
