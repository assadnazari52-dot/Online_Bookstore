const books=[
{id:1,title:"Travel memories of America",author:"Dr. Amanullah Nazari",category:"History",price:24.99,old:32.99,rating:4.9,img:"images/book1.jpg"},
{id:2,title:"C++ & Object-Oriented Programming",author:"Robert Smith",category:"Programming",price:29.99,old:39.99,rating:4.8,img:"images/book2.jpg"},
{id:3,title:"The Business Mindset",author:"AsadUllah Nazari",category:"Business",price:19.99,old:25.99,rating:4.7,img:"images/book3.jpg"},
{id:4,title:"Introduction to Science",author:"Daniel Green",category:"Science",price:22.50,old:null,rating:4.6,img:"images/book4.jpg"},

];

let cart=JSON.parse(localStorage.getItem("bookhubCart")||"[]");
const grid=document.getElementById("bookGrid"), searchInput=document.getElementById("searchInput"), sortSelect=document.getElementById("sortSelect");

function renderBooks(list=books){
  grid.innerHTML="";
  document.getElementById("noResults").hidden=list.length!==0;
  list.forEach(b=>{
    const card=document.createElement("article"); card.className="book";
    card.innerHTML=`<img class="cover" src="${b.img}" alt="${b.title} cover">
      <div class="book-info"><span class="category">${b.category}</span><h3>${b.title}</h3>
      <p class="author">by ${b.author}</p><div class="rating">★★★★★ <small>${b.rating}</small></div>
      <span class="price">$${b.price.toFixed(2)}</span>${b.old?`<span class="old">$${b.old.toFixed(2)}</span>`:""}
      <div class="book-actions"><button class="add" onclick="addToCart(${b.id})">Add to Cart</button><button class="wish" onclick="toggleWish(${b.id})">♡</button></div></div>`;
    grid.appendChild(card);
  });
}
function applyFilters(){
  const q=searchInput.value.toLowerCase().trim(); let list=books.filter(b=>(b.title+" "+b.author+" "+b.category).toLowerCase().includes(q));
  const s=sortSelect.value;
  if(s==="low")list.sort((a,b)=>a.price-b.price); if(s==="high")list.sort((a,b)=>b.price-a.price); if(s==="rating")list.sort((a,b)=>b.rating-a.rating);
  renderBooks(list);
}
function addToCart(id){const item=cart.find(x=>x.id===id); if(item)item.qty++; else cart.push({id,qty:1}); saveCart(); openCart();}
function saveCart(){localStorage.setItem("bookhubCart",JSON.stringify(cart)); updateCart();}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
  const box=document.getElementById("cartItems"); box.innerHTML=""; let total=0;
  if(!cart.length){box.innerHTML='<p style="padding:30px 0;color:#777;text-align:center">Your cart is empty.</p>'}
  cart.forEach(item=>{const b=books.find(x=>x.id===item.id);total+=b.price*item.qty;
    const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<img src="${b.img}" alt=""><div><b>${b.title}</b><small style="display:block;color:#777">$${b.price.toFixed(2)}</small><div class="qty"><button onclick="changeQty(${b.id},-1)">−</button> ${item.qty} <button onclick="changeQty(${b.id},1)">+</button></div></div><button class="wish" onclick="removeCart(${b.id})">✕</button>`;box.appendChild(row)});
  document.getElementById("subtotal").textContent="$"+total.toFixed(2);
}
function changeQty(id,n){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=n;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();updateCart();}
function removeCart(id){cart=cart.filter(x=>x.id!==id);saveCart();}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.remove("hidden");}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.add("hidden");}
function showModal(content){document.getElementById("modalContent").innerHTML=content;document.getElementById("modal").classList.remove("hidden")}
function toggleWish(id){const b=books.find(x=>x.id===id);showModal(`<h2>♡ Added to Wishlist</h2><p><b>${b.title}</b> has been added to your wishlist.</p>`)}
document.querySelectorAll(".categories button").forEach(btn=>btn.onclick=()=>{searchInput.value="";sortSelect.value="featured";renderBooks(books.filter(b=>b.category===btn.dataset.category));location.hash="books"});
searchInput.addEventListener("input",applyFilters);document.getElementById("searchBtn").onclick=applyFilters;sortSelect.onchange=applyFilters;
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("loginBtn").onclick=()=>showModal(`<h2>My Account</h2><form onsubmit="event.preventDefault();showModal('<h2>Welcome!</h2><p>You are signed in for this demo.</p>')"><input required placeholder="Email"><input required type="password" placeholder="Password"><button class="primary">Sign In</button></form>`);
document.getElementById("wishlistBtn").onclick=()=>showModal("<h2>♡ Wishlist</h2><p>Your wishlist is empty. Click ♡ on a book to add it.</p>");
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length){showModal("<h2>Your cart is empty</h2><p>Add a book before checkout.</p>");return}showModal(`<h2>Checkout</h2><form onsubmit="event.preventDefault();cart=[];saveCart();document.getElementById('modal').classList.add('hidden');closeCart();alert('Order placed successfully! This is a demo checkout.')"><input required placeholder="Full name"><input required placeholder="Phone number"><input required placeholder="Delivery address"><button class="primary">Place Order</button></form>`)};
document.getElementById("contactForm").onsubmit=e=>{e.preventDefault();e.target.reset();alert("Thank you! Your message has been received.");};
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.add("hidden")});
renderBooks();updateCart();
