import express from "express";
import Product from "../models/products.schema.js";
import {
  getalluesers,
  getuserOne, //이거 조회때만 쓰는거 
  postSaveUser,
  deleteProduct,
  updeUser,//삭제 수정때 쓰는거
} from "../Repository/productRepository.js";

// 전부 찾는 함수
export const getallProduct = async () => {
try {
    // 상품 목록을 조회하고 작성 날짜를 기준으로 내림차순으로 정렬
    const productList = await  getalluesers()
    // 조회된 상품 목록을 응답으로 반환
   return productList;
} catch (error) {
    //없으면 에러 미들웨어로
    throw error;
}
};
//생성하는 함수
export const createProduct = async (ProductDTO) => {
  try {
    let newProduct = await postSaveUser(ProductDTO);
    return newProduct; // 저장된 데이터를 send해서 반환 -> 저장확인 위해
  } catch (error) {
    throw error; // 오류
  }
};

//아이디를 조회하는 함수
export const getid_product = async (req, res, next) => {
try {
    let { id } = req.params; //파람에서 아이디값 가져옴
    const product = await getuserOne(id)
    //findOne -> _id값을 검색한다 findOne은 이유는 하나만 가져오는 거라 아이디는 중복되지 않으니까
    if (!product) {
      return  res.status(404).json({message:"상품 조회에 실패했습니다."});
      // 상품이 존재하지 않는 경우 404 상태 코드로 응답  return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    } //존재하지 않는다 product==false-> 그러면 강제로 오류 메세지를 반환
    return product; //있으면 조회
} catch (error) {
throw error;
}
};

//물건을 업데이트 하는 함수
export const update_product = async (productDTO,id) => {
  try {
    let product = await updeUser(id); //_id를 찾음
    if (!product) {
      // 상품이 없는 경우 -> 위와 같음
   return res.status(404).json({ message: "상품 조회에 실패했습니다." });
    } //위의 if는 나왔지만 비밀번호가 없는 안맞는 경우
    if (product.password !== productDTO.password) {
      return res.status(404).json({message:"비밀번호가 일치하지 않습니다."});
    } //아는 오류가 404밖에 없어서...
    if (productDTO.status == "FOR_SALE" || productDTO.status == "SOLD_OUT") {
      Product.status = ProductDTO.status;
    }
    product.ProductName = productDTO.ProductName;
    product.content = productDTO.content;
    let updateone = await product.save();
    if (!updateone) {
    return res.status(404).json({message:"업데이트 실패"});
    }
    return updateone;
  } catch (error) {
    throw error;
  }
};

//물건을 지우는 함수
export const deleteProdct = async (productDTO, id) => {
  try {
    let product = await updeUser(id);
    if (!product) {
      // 상품이 없는 경우 -> 위와 같음
    return res.status(404).json({ message: "상품 조회에 실패했습니다." });
    }
    if (product.password !== productDTO.password) {
      
      return res.status(404).json({ message: "비밀번호가 일치하지 않습니다." });;
    }
    //위와 거의 비슷. 그냥 deleteOne으로 삭제 -> (여러개 삭제 시 deleteMany )
    const deletedProduct = await deleteProduct(id);
    if (deletedProduct.deletedCount === 0) {
      //deletedProduct.deletedCount 몽고디비에서 삭제된 문서의 수를 나타냄
     return res.status(404).json({message:"삭제에 실패했습니다"}); //한개도 안되서 안됐다고 리턴
    } //if문 안빠지고 밖에 있다 -> 삭제된게 0 초과 -> 삭제 성공
    return {message:"정상적으로 삭제되었습니다"};
  } catch (error) {
    throw error;
  }
};
