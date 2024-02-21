import express from "express";
import bookrouter from "./routes/book.router.js" //이름 맘대로
import connect from "../prac/schemas/index.js";
connect();
let app = express();
app.use(express.json({ extended: true }));


app.use("/api/book", bookrouter);


app.get("/",  (req, res) => {
  res.send("<h1> 다시 한번 더 </h1>");
});

app.listen(8000, () => {
  console.log("서버연결이 완료되었습니다");
});
