
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://010127js:ninosoi2001!@cluster0.kwny3d1.mongodb.net/?retryWrites=true&w=majority"
);
var db = mongoose.connection;

// 연결된지 확인
db.on("error", console.error.bind(console, "MongoDB 연결 오류:"));
db.once("open", function () {
  console.log("MongoDB에 연결되었습니다.");
});




let newProduct = new mongoose.Schema({
  productName: { type: String, required: true },  //require 해당 필드가 반드시 있어야함
  content: { type: String, required: true },
  author: { type: String, required: true },
  password: { type: String, required: true },
  status: {
    type: String,
    enum: ["FOR_SALE", "SOLD_OUT"], // 상태가 FOR_SALE 또는 SOLD_OUT 중 하나여야 함
    default: "FOR_SALE", // 기본 상태는 FOR_SALE
  },
  createdAt: { type: Date, default: Date.now },
});
 // 7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일
 let Product = mongoose.model("Product", newProduct);

export default Product;
export { db };