export default function (err, req, res, next) {
  console.error(err);
//이게 유형성 오류면 
  if (err.name === "ValidationError") {
    return res.status(400).json({ errorMessage: err.message });
  }

  // 그 외의 에러가 발생하면, 서버 에러로 처리합니다.
  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생하였습니다." });
}
