import express from 'express'
//import Product from "../models/products.schema.js";
import {
  getallProduct,
  createProduct,
  getid_product,
  update_product,
  deleteProdct,
} from "../Services/ProdctService.js";

//dto를 가져온다 dto 데이터를 전송하기 위한 객체
import ProductDTO from "../dtos/productDTO.js";


// 전부 찾는 함수
export const getAllProductsController = async (req, res, next) => {
  try {
    const productList = await getallProduct(req, res, next); // 상품 목록 조회
    return res.status(200).send(productList); // 클라이언트에게 응답 반환
  } catch (error) {
    next(error); // 에러 발생 시 다음 미들웨어에 전달
  }
};

//생성하는 함수
export const createProductController = async(req, res, next)=> {
    try {
    const { ProductName, content, author, password } = req.body;
    const productDTO = new ProductDTO(ProductName, content, author, password);
      const productList = await createProduct(productDTO);
     return res.send(productList);
    
    } catch (error) {
      next(error); // 오류
    }
  }

//아이디를 조회하는 함수
export const getid_productController = async(req, res, next)=> {
 try{
  let product = await getid_product(req, res, next); ;
  return res.send(product)
}catch(error){
next(error)
}
}
//물건을 업데이트 하는 함수
export const update_productController = async(req, res, next)=> {
    try {
      let { id } = req.params; //파람에서 가져옴
      const { ProductName, content, status, password, author } = req.body; //바디에서 가져옴
      const productDTO = new ProductDTO(
        ProductName,
        content,
        author,
        password,
        status
      );
      let update_prodctlist = await update_product(productDTO, id);
      return res.send(update_prodctlist);
    } catch (error) {
      next(error);
    }
  }

//물건을 지우는 함수
  export const deleteProdctController  = async(req, res, next)=> {
   try{
    let { id } = req.params;
    const { password } = req.body;
   const productDTO = new ProductDTO(
     undefined,
     undefined,
     undefined,
     password,
     undefined
   );
    let deleletone = await deleteProdct(productDTO, id);
    return res.send(deleletone)
   }catch(error){
    next(error)
   }
  }