//갑자기 한글이 안쳐지네 그러다가 갑자기 되네 아무튼 여기에 스크마와 객체 컴파일
import mongoose from "mongoose"
 //스키마 만들기 
const bookschema = mongoose.Schema({
  ProductName: { type: String, require: true },
  content: { type: String, require: true },
  author: { type: String, require: true },
  password: { type: String, require: true },
  status: {
    type: String,
    require: true,
    enum: ["SOLD_OUT", "FOR_SALE"],
    default: "FOR_SALE",
  },
  date: { type: Date, default: new Date(Date.now()) },
});
//객체 컴파일
let book = mongoose.model('data', bookschema) //모델 만드는데 북스키마라는 객체를 data라는 컨벤션
//근데 몽고디비는 복수형으로 만드니까 datas라고 저장될것
export default book