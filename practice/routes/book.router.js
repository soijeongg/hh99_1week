import  express  from "express";
const  router = express.Router()
import book from "../schemas/schemma.js"; //객체를 가져오겠다 
import { body, check, validationResult } from "express-validator";

//책정보를 가져오는 전체 조회 
router.get("/", async (req, res) => {
//res.send("<h1>책 전체 정보 페이지 입니다</h1>")
let booklist = await book
  .find()
  .sort({ date: -1 })
  .select("ProductName author status date");
res.send(booklist)
})

//책정보를 등록하는 리스트 
router.post(
  "/",
  [
    body("ProductName")
      .trim()
      .isLength({ min: 2, max: 10 })
      .notEmpty()
      .withMessage("상품명을 입력해주세요"),
    body("content")
      .trim()
      .isLength({ min: 1, max: 30 })
      .notEmpty()
      .withMessage("30자 이내로 작성해주세요"),
    body("author")
      .trim()
      .isLength({ min: 2, max: 10 })
      .notEmpty()
      .withMessage("10글자이내로 작성해주세요"),
    body("password")
      .isLength({ min: 2 })
      .withMessage("비밀번호는 최소 2자 이상이어야 합니다."),
    
  ],
  async (req, res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
      res.status(400).send(error)
    }
    try {
    let { ProductName, content, author, password } = req.body;
    let newbook = new book({
      ProductName,
      content,
      author,
      password,
    });
    newbook.save().then((data) => {
      console.log("성공");
      res.send(newbook);
    });
  }catch(error){
    next(error)
  }
}
);

//상세조회
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let booklist = await book.findById(id).exec(); // 비동기적으로 책을 조회합니다.
    if (!booklist) {
    return res.status(404).send("상품조회에 실패했습니다");
    }
    res.send(booklist);
});

//상세조회 후 수정
router.put("/:id", async(req, res)=> {
  let updateone;
    let { id } = req.params;
    let booklist = await book.findById(id).exec();
    if (!booklist) {
      return res.status(404).send("상품조회에 실패했습니다");
    }
    let {ProductName,content, status, password } = req.body
    if (booklist.password !== password) {
      return res.status(404).send("비밀번호가 맞지 않습니다");
    }
    if(status =="FOR_SALE" || status == "SOLD_OUT"){
      updateone = await book.findOneAndUpdate(
    { _id: id },
    { ProductName, content ,status}, {new: true}
  )
    }else{ 
      updateone = await book.findOneAndUpdate(
    { _id: id },
    { ProductName, content}, {new: true}
  )
      }
      if (!updateone) {
  return res.status(404).send("업데이트 실패");
}
console.log("수정완료");
res.send(updateone);
});
    

//상세조회 후 삭제 
router.delete("/:id", async(req, res)=> {
    let { id } = req.params;
    let booklist = await book.findById(id).exec();
    if (!booklist) {
    res.status(404).send("상품조회에 실패했습니다");
}
let {password} = req.body;
if(booklist.password !==password){
    res.status(404).send("비밀번호가 맞지 않습니다")
}
let deleteone  = await booklist.deleteOne({_id: id})
if(!deleteone){
  res.status(404).send("삭제에 실패했습니다 다시 시도해주세요")
}
res.send(deleteone)
    
})

export default router;