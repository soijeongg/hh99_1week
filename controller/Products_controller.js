import express from 'express'
import Product from '../models/products.schema.js'
import { body, check, validationResult } from "express-validator";// 유효성 검사

export const getallProduct = async(req, res, next)=> {
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
};

export const createProduct = async(req, res, next)=> {
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


export const getid_product = async(req, res, next)=> {
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
}

export const update_product = async(req, res, next)=> {
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


  export const deleteProdct  = async(req, res, next)=> {
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
  }