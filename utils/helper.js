// const formatDate = function (dateString) {
//     const date = new Date(dateString);
//     const day = date.getDate()-1;
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };
// export default formatDate;
const formatDate = function (dateString) {
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2); // Thêm số 0 nếu cần và lấy 2 chữ số cuối
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Thêm số 0 nếu cần và lấy 2 chữ số cuối
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2); // Thêm số 0 nếu cần và lấy 2 chữ số cuối
  const minutes = ("0" + date.getMinutes()).slice(-2); // Thêm số 0 nếu cần và lấy 2 chữ số cuối
  const seconds = ("0" + date.getSeconds()).slice(-2); // Thêm số 0 nếu cần và lấy 2 chữ số cuối

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
export default formatDate;
