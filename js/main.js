const favouriteNumber=document.querySelector(".favourite .badge");

let favouriteProductsJson=localStorage.getItem(FAVOURITE);
let favouriteProducts=JSON.parse(favouriteProductsJson) || [];

function getFavouriteNumber(){
  favouriteNumber.textContent=favouriteProducts.length;
}
getFavouriteNumber();