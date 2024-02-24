import express from "express";
const router = express.Router(); //익스프레스 라우터 
;//스키마로 만든 모델을 가져오겠다
import { body} from "express-validator";// 유효성 검사
import {
  getAllProductsController,
  getid_productController,
  createProductController,
  update_productController,
  deleteProdctController,
} from "../controller/Products_controller.js";


//상품목록조회
router.get("/", getAllProductsController);

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
  createProductController
);


//상품상세조회 이 아이디는 가변값 어떤값이 오든지 id로 변함
router.get("/:id", getid_productController);

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
  update_productController
);

//상품삭제 api
router.delete("/:id", deleteProdctController);
//이 라우터를 내보낸다
export default router;
