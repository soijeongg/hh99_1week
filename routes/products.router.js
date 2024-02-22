import express from "express";
const router = express.Router(); //익스프레스 라우터 
import Product from "../schemas/products.schema.js";//스키마로 만든 모델을 가져오겠다
import { body, check, validationResult } from "express-validator";// 유효성 검사

router.use(express.json());
router.use(express.urlencoded({ extended: false })); //바디에서 가져오겟다 

//상품목록조회
router.get("/", async (req, res, next) => {
  try {
    // 상품 목록을 조회하고 작성 날짜를 기준으로 내림차순으로 정렬
    const productList = await Product.find()
      .sort({ createdAt: -1 }) //몽고에서 -1은 내림차순으로 생각
      .select("ProductName author status createdAt"); //그 필드에 있는 애들중 이 애들만 가져옴

    // 조회된 상품 목록을 응답으로 반환
    res.send(productList);
  } catch (error) { //없으면 에러 미들웨어로 
    next(error)
  }
});

//상품 작성-> 등록이라 포스트
router.post(
  "/",
  [
    body("ProductName")
      .trim()
      .isLength({ min: 2, max: 30 })
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
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send(error);
    }
    try {
      //바디에서 받아오기
      const { ProductName, content, author, password } = req.body;
      //아까 많든 스키마 객체와 new생성자사용해 새 객체를 만듬
      const newProduct = new Product({
        ProductName,
        content,
        author,
        password,
      }); //날짜도 같음
      //지금 상태랑 날짜가 없는데 상태는 지금 장터에 올리는데 다 팔린걸 올린다? 안그럼 그래서 안쓰면 기본값이 올라감
      await newProduct
        .save() // 저장
        .then((data) => {
          console.log("저장완료!");
          res.send(data); // 저장된 데이터를 send해서 반환 -> 저장확인 위해
        });
    } catch (error) {
      next(error); // 오류
    }
  }
);


//상품상세조회 이 아이디는 가변값 어떤값이 오든지 id로 변함
router.get("/:id", async (req, res, next) => {
  // 상품 목록을 조회하고 작성 날짜를 기준으로 내림차순으로 정렬
  try{
  let { id } = req.params; //파람에서 아이디값 가져옴
  const product = await Product.findOne({ _id: id }).select(
    "ProductName content author status createdAt"
  );
  //findOne -> _id값을 검색한다 findOne은 이유는 하나만 가져오는 거라 아이디는 중복되지 않으니까
  if (!product) {
    // 상품이 존재하지 않는 경우 404 상태 코드로 응답
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  } //존재하지 않는다 product==false-> 그러면 강제로 오류 메세지를 반환
  res.send(product); //있으면 조회
}catch(error){
next(error)
}
});

//상품수정 api 수정이라 patch put과 다른 이유는 put은 필드가 전부 있어야 함
router.put(
  "/:id",
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
      if (!error.isEmpty()) {
        res.status(400).send(error);
      }
    try {
      let updateone; //먼저 정의 -> 나중에 if문돌려서 할당하고 확인하기 위해

      let { id } = req.params; //파람에서 가져옴
      const { ProductName, content, status, password } = req.body; //바디에서 가져옴
      let product = await Product.findById(id); //_id를 찾음
      if (!product) {
        // 상품이 없는 경우 -> 위와 같음
        return res.status(404).json({ message: "상품 조회에 실패했습니다." });
      } //위의 if는 나왔지만 비밀번호가 없는 안맞는 경우
      if (product.password !== password) {
        console.log(product.password);
        return res
          .status(404)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      } //아는 오류가 404밖에 없어서...
      if (status == "FOR_SALE" || status == "SOLD_OUT") {
        updateone = await Product.findOneAndUpdate(
          { _id: id },
          { ProductName, content, status },
          { new: true }
        );
      } else {
        updateone = await Product.findOneAndUpdate(
          { _id: id },
          { ProductName, content },
          { new: true }
        );
      }
      if (!updateone) {
        return res.status(404).send("업데이트 실패");
      }
      console.log("수정완료");
      res.send(updateone);
    } catch (error) {
      next(error);
    }
  }
);

//상품삭제 api
router.delete("/:id", async (req, res,next) => {
  let { id } = req.params;
  const { password } = req.body;
  let product = await Product.findById(id);
  if (!product) {
    // 상품이 없는 경우 -> 위와 같음
    return res.status(404).json({ message: "상품 조회에 실패했습니다." });
  }
  if (product.password !== password) {
    console.log(product.password);
    return res.status(404).json({ message: "비밀번호가 일치하지 않습니다." });
  }
  //위와 거의 비슷. 그냥 deleteOne으로 삭제 -> (여러개 삭제 시 deleteMany )
  const deletedProduct = await Product.deleteOne({ _id: id });
  if (deletedProduct.deletedCount === 0) {
    //deletedProduct.deletedCount 몽고디비에서 삭제된 문서의 수를 나타냄
    return res.status(404).json({ message: "상품 삭제에 실패했습니다." }); //한개도 안되서 안됐다고 리턴
  } //if문 안빠지고 밖에 있다 -> 삭제된게 0 초과 -> 삭제 성공
  res.send({ message: "삭제완료!" });
});
//이 라우터를 내보낸다
export default router;
