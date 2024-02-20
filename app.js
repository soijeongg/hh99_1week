import express from "express"; //익스프레스를 가져온다 파이썬이랑 같아서 행복함
const app = express(); //익스프레스 객체를 만든다
const PORT = 3000; //포트번호를 3000으로 설정

import goodsRouter from "./routes/products.router.js"; //라우터를 이 이름으로 가져오겠다

app.use("/api/products", [goodsRouter]); //이 라우터를 쓰겠다

app.get("/", (req, res) => {
  res.send("<h1>장터페이지 입나다</h1>");
});
//그냥 만들어본 첫 페이지

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
//포트 열고 콜백으로 연거 확인하기
