const productsRow = document.querySelector(".products-row");
const searchInput = document.querySelector(".search");
let input = document.querySelector("input");
let productsNumber = document.querySelector(".products-number span");
const pagination = document.querySelector(".pagination");
const categoriesSelect = document.querySelector(".categories-select");

let category = localStorage.getItem(CATEGORY) || "all";
let search = "";
let limit = 10;
let page = 1;

function getProductCard({
  id,
  name,
  category,
  description,
  price,
  rating,
  discount,
  image,
}) {
  let checkFavourite=favouriteProducts.find((el)=>el.id === id)
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
     <div class="card product-card">
       <img style="height:200px" src="${image}" class="w-100 object-fit-cover card-img-top" alt="${name}">
       <div class="card-body">
       <span class="badge text-bg-warning">${category}  </span>
       <span class="badge text-bg-danger">${discount} %</span>
         <h5 class="card-title">${name} -- ${price}$  </h5>
         <p class="card-text">Rating -- ${getRating(rating)}</p>
         <p class="card-text">${description}</p>
         <div class="d-flex justify-content-between">
           <a href="#" class="btn btn-primary">Add to cart ${id}</a>
            <button onclick="addToFavourite(${id})" class="btn ${checkFavourite ? "btn-danger" : "btn-outline-danger"}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16">
            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
            </svg>
             </button>
         </div>
       </div>
     </div>
   </div>
  `;
}

function getProducts() {
  let searchProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(search);
  });

  //filtering
  if (category !== "all") {
    searchProducts = searchProducts.filter((pr) => {
      return pr.category === category;
    });
  }

  // pagination start and end
  let start = (page - 1) * limit;
  let end = page * limit;

  productsRow.innerHTML = "";
  searchProducts.slice(start, end).forEach((product) => {
    productsRow.innerHTML += getProductCard(product);
  });

  productsNumber.textContent = searchProducts.length;

  //Paginition

  let pages = Math.ceil(searchProducts.length / limit);
  if (pages > 1) {
    pagination.innerHTML = `
     <li class="page-item ${page === 1 ? "disabled" : ""}">
        <span onclick="getPage('-')" class="page-link">Previous</span>
      </li>
     `;
    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `
      <li class="page-item ${
        page === i ? "active" : ""
      }"><span onclick="getPage(${i})" class="page-link">${i}</span></li>
      `;
    }

    pagination.innerHTML += `
     <li class="page-item ${page === pages ? "disabled" : ""}">
       <span onclick="getPage('+')" class="page-link" href="#">Next</span>
     </li>
  `;
  } else {
    pagination.innerHTML = "";
  }
}
function getPage(p) {
  if (p === "+") {
    page++;
  } else if (page === "-") {
    if (page > 1) {
      page--;
    }
  } else {
    page = p;
  }
  getProducts();
}
getProducts();

searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  search = input.value.trim().toLowerCase();
  page = 1;
  getProducts();
});

//categories mapping
function getCategories() {
  categoriesSelect.innerHTML = `<option value="all">All</option>`;

  categories.forEach(({ name }) => {
    if (category === name) {
      categoriesSelect.innerHTML += `<option selected value=${name}>${name}</option>`;
    }
  });
}
getCategories();

categoriesSelect.addEventListener("change", function () {
  category = this.value;
  localStorage.setItem(CATEGORY, category);
  getProducts();
});


//add to favourite
function addToFavourite(id){
  let checkFavourite= favouriteProducts.find((el)=>el.id ===id)
  let product=products.find((el)=>el.id===id);
  if(checkFavourite){
   favouriteProducts=favouriteProducts.filter((el)=>el.id !== id);
  }else{
    favouriteProducts.push(product);
  }
  localStorage.setItem(FAVOURITE,JSON.stringify(favouriteProducts));
  getProducts();
  getFavouriteNumber();
}