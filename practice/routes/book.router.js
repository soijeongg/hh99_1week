import  express  from "express";
const  router = express.Router()
import book from "../schemas/schemma.js"; //객체를 가져오겠다 

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
router.post("/", async (req, res)=> {
    //res.send("<h1> 등록하는 페이지 입니다</h1>")
   let {ProductName, content, author, password} = req.body;
  let  newbook = new book({
    ProductName, 
    content, 
    author, 
    password
   })
newbook.save().then((data) => {
    console.log('성공');
    res.send(newbook)
})
});

//상세조회
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    let booklist = await book.findById(id); // 비동기적으로 책을 조회합니다.
    if (!booklist) {
    return res.status(404).send("상품조회에 실패했습니다");
    }
    res.send(booklist);
});

//상세조회 후 삭제 
router.patch("/:id", async(req, res)=> {
     let { id } = req.params;
     let booklist = await book.findById(id);
     if (!booklist) {
       res.status(404).send("상품조회에 실패했습니다");
     }
     let {ProductName,content, status, password } = req.body
    if (booklist.password !== password) {
      res.status(404).send("비밀번호가 맞지 않습니다");
    }
     booklist.ProductName = ProductName;
     booklist.content = content;
     booklist.password = password;
     if (status == "SOLD_OUT" || status =="FOR_SALE" ){
      booklist.status = status}
      booklist.save().then((data)=> {
        res.send(booklist);
        console.log("수정완료")
      });
    })
    

//상세조회 후 삭제 
router.delete("/:id", async(req, res)=> {
    let { id } = req.params;
    let booklist = await book.findById(id);
    if (!booklist) {
    res.status(404).send("상품조회에 실패했습니다");
}
let {password} = req.body;
if(booklist.password !==password){
    res.status(404).send("비밀번호가 맞지 않습니다")
}
let deleteone  = await booklist.deleteOne({_id: id})
res.send(deleteone)
    
})

export default router;