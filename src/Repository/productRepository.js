
//find, save, delete   
import product from '../models/products.schema.js'

//전부조회하는 함수 
export const getalluesers  =  async() =>{
  return await product
    .find()
    .sort({ createdAt: -1 }) //몽고에서 -1은 내림차순으로 생각
    .select("ProductName author status createdAt"); //그 필드에 있는 애들중 이 애들만 가져옴;
}

//특정아이디만을 조회하는 함수
export const getuserOne = async(id)=>{
    return await product
      .findById(id)
      .select("ProductName content author status createdAt");
}
 //아이디 까지 비밀번호까지 조회
 export const updeUser = async (id) => {
   return await product
     .findById(id)
     
 };
//저장하는 함수 
export const postSaveUser = async(data) =>{
    const newone = new product(data);
    return await newone.save()
}

//딜리트 하는 함수
export const deleteProduct = async(id)=>{
    return await product.deleteOne({ _id: id });
}