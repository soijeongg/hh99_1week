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

//스키마 만들기 fastapi처럼 먼저 어떨게 스키마가 들어갈지 정해놔야 한다
let newProduct = new mongoose.Schema({
  productName: { type: String, required: true }, //require 해당 필드가 반드시 있어야함
  content: { type: String, required: true },
  author: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"], // 상태가 FOR_SALE 또는 SOLD_OUT 중 하나여야 함
    default: "FOR_SALE", // 기본 상태는 FOR_SALE
  },
  createdAt: { type: Date, default: Date.now }, //타입날짜 기본값 지금 , 근데 이건거의 안쓰니까
});
//  정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일 이렇게 해야한다고 함
let Product = mongoose.model("Product", newProduct);

export default Product;
export { db }; //밖에서 쓸수있게 내보내기
