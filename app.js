import express from "express"; //익스프레스를 가져온다 파이썬이랑 같아서 행복함
const app = express(); //익스프레스 객체를 만든다
import connect from "./schemas/index.js";
import dotenv from "dotenv"; //환경변수를 가져오겠다
import errorHandlerware from "./middlewares/error-handlerware.js";//에러처리미들웨어
import goodsRouter from "./src/routes/products.router.js"; //라우터를 이 이름으로 가져오겠다


dotenv.config();
const { PORT } = process.env;//포트를 가져온다
const port = PORT || 3000; //포트는 환경변수에서 가져오는데 없으면 3000

connect()//연결
app.use("/api/products", goodsRouter); //이 라우터를 쓰겠다
app.use(errorHandlerware); //에러처리 미들웨어

app.get("/", (req, res) => {
  res.send("<h1>장터페이지 입나다</h1>");
});
//그냥 만들어본 첫 페이지

app.listen(port, () => {
  console.log(port, "포트가 열렸습니다~");
});
//포트 열고 콜백으로 연거 확인하기
