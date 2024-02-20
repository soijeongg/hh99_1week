import express from "express";
const router = express.Router();
import Product from "../schemas/index.js";
import { db } from "../schemas/index.js";
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//상품목록조회
router.get("/", async (req, res) => {
  try {
    // 상품 목록을 조회하고 작성 날짜를 기준으로 내림차순으로 정렬
    const productList = await Product.find()
      .sort({ createdAt: -1 })
      .select("productName author status createdAt");

    // 조회된 상품 목록을 응답으로 반환
    res.send(productList);
  } catch (error) {
    // 오류가 발생한 경우 오류 메시지를 응답으로 반환
    res.status(500).json({ message: error.message });
  }
});
/* 시퀀스 증가 함수
const getNextSequenceValue = async (sequenceName) => {
  const sequenceDoc = await connect
    .collection("sequences")
    .findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: "after" }
    );
  return sequenceDoc.sequence_value;
}; */

//상품 작성
router.post("/", (req, res) => {
  const { productName, content, author, password } = req.body;
 
  const newProduct = new Product({
    productName,
    content,
    author,
    password
    
  });

  newProduct
    .save() // 프로미스를 반환하므로 then/catch를 사용하여 처리
    .then((data) => {
      console.log("Saved!");
      res.send(data); // 저장된 데이터를 JSON으로 반환
    })
    .catch((err) => {
      // 변수 이름을 err로 수정
      console.error(err); // 에러를 콘솔에 출력
      res.status(500).json({ error: "Internal server error" }); // 500 에러를 클라이언트에 반환
    });
});


//상품상세조회
router.get("/:id", async (req, res) => {
  // 상품 목록을 조회하고 작성 날짜를 기준으로 내림차순으로 정렬
  let { id } = req.params;
  const product = await Product.findOne({ _id: id }).select(
    "productName content author status createdAt"
  );

  if (!product) {
    // 상품이 존재하지 않는 경우 404 상태 코드로 응답
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  res.send(product);
});


//상품수정 api
router.patch("/:id", async (req, res) => {
  let { id } = req.params;
  const { productName, content, status, password } = req.body;
  let product = await Product.findById(id);
  if (!product) {
    // 상품이 없는 경우 -> 위와 같음
    return res.status(404).json({ message: "상품 조회에 실패했습니다." });
  } //위의 if는 나왔지만 비밀번호가 없는 안맞는 경우
  if (product.password !== password) {
    console.log(product.password);
    return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  product.productName = productName;
  product.content = content;
  if (product.status !== "FOR_SALE" || product.status !== "SOLD_OUT") {
    product.status = "FOR_SALE";
  };
  product.save();
  res.send({ message: "수정완료" });
});

//상품삭제 api
router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  const { password } = req.body;
  let product = await Product.findById(id);
  if (!product) {
    // 상품이 없는 경우 -> 위와 같음
    return res.status(404).json({ message: "상품 조회에 실패했습니다." });
  }
 if (product.password !== password) {
   console.log(product.password);
   return res.status(403).json({ message: "비밀번호가 일치하지 않습니다." });
 }
  const deletedProduct = await Product.deleteOne({ _id: id });
  if (deletedProduct.deletedCount === 0) {
    return res.status(404).json({ message: "상품 삭제에 실패했습니다." });
  }
  res.send({message: "상품이 성공적으로 삭제 되었습니다"})
});


export default router;
