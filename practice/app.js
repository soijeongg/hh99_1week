import express from "express";
import bookrouter from "./routes/book.router.js" //이름 맘대로
import connect from "../practice/schemas/index.js"
import dotenv from "dotenv";
import errorHandlerware from "./middlewares/error-handlerware.js";

dotenv.config();
const { PORT} = process.env;
const port = PORT || 8000
connect();


let app = express();
app.use(express.json({ extended: true }));


app.use("/api/book", bookrouter);
app.use(errorHandlerware)

app.get("/",  (req, res) => {
  res.send("<h1> 다시 한번 더 </h1>");
});

app.listen(port, () => {
  console.log(`${port}서버연결이 완료되었습니다`);
});
