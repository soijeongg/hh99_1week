//몽고디비와 연결하는 부분 빼놓기
import mongoose from "mongoose";
//몽고디비와 커넥트 {데이터베이스 이름: node_lv1}
mongoose.connect(
  "mongodb+srv://010127js:ninosoi2001!@cluster0.kwny3d1.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "node_lv1" }
);
var db = mongoose.connection;
//db라는 이름으로 커넥션을 하겠다
// 연결된지 확인
db.on("error", console.error.bind(console, "MongoDB 연결 오류:"));
db.once("open", function () {
  console.log("MongoDB에 연결되었습니다.");
});

export { db }; //밖에서 쓸수있게 내보내기
