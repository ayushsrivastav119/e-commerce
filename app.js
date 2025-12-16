
/********************************
 * ADOBE DATA LAYER – STANDARD TEMPLATE (REUSABLE)
 ********************************/
// Global initialization is in <head> of HTML files
window.adobeDataLayer = window.adobeDataLayer || [];
console.log('Data layer initialized:', window.adobeDataLayer);

// 2️⃣ Common objects (used in EVERY event)
// Customer Object (guest by default)
var custData = {
  custId: "",                // logged-in user id
  emailID_plain: "",         // email if available
  mobileNo_plain: "",        // mobile number
  loginStatus: "guest",      // guest | logged_in
  loginMethod: ""            // email | google | otp etc.
};


/* ---------- PAGE DATA LAYER ---------- */
function setPageDL() {
  const page = document.body.dataset.page;

  const pageMap = {
    home: {
      name: "Home Page",
      type: "home"
    },
    plp: {
      name: "Product Listing",
      type: "plp"
    },
    pdp: {
      name: "Product Detail",
      type: "pdp"
    },
    cart: {
      name: "Cart",
      type: "cart"
    },
    checkout: {
      name: "Checkout",
      type: "checkout"
    },
    "payment-method": {
      name: "Payment Method",
      type: "payment_method"
    },
    payment: {
      name: "Payment",
      type: "payment"
    },
    processing: {
      name: "Processing",
      type: "processing"
    },
    thankyou: {
      name: "Thank You",
      type: "thankyou"
    }
  };

  const pageData = pageMap[page] || {};

  // 3️⃣ Page View Event (ALL pages)
  window.adobeDataLayer.push({
    event: "pageView",
    custData: custData,
    page: {
      name: pageData.name,
      type: pageData.type,
      url: window.location.href,
      referrer: document.referrer || ""
    }
  });
}

/* ---------- PRODUCT DATA LAYER (PDP) ---------- */
function setProductDL(prod) {
  if (!prod) return;

  // 5️⃣ Product Detail View (PDP)
  window.adobeDataLayer.push({
    event: "productDetail",
    custData: custData,
    product: [{
      productId: prod.id,
      name: prod.title,
      brand: "MyBrand",  // Assuming a default brand, can be updated
      category: "General",  // Can be updated based on product
      price: prod.price,
      color: "",  // Add if available
      size: ""    // Add if available
    }]
  });
}

/* ---------- CART DATA LAYER ---------- */
function setCartDL(cart) {
  const page = document.body.dataset.page;

  const cartItems = cart.map(i => ({
    productId: i.id,
    name: i.title,
    price: i.price,
    quantity: i.qty
  }));

  const totalQuantity = cart.reduce((s, i) => s + i.qty, 0);
  const totalValue = cart.reduce((s, i) => s + i.qty * i.price, 0);

  if (page === "cart") {
    // 8️⃣ Cart View (scView)
    window.adobeDataLayer.push({
      event: "scView",
      custData: custData,
      cart: {
        items: cartItems,
        totalQuantity: totalQuantity,
        totalValue: totalValue,
        currency: "INR"
      }
    });
  } else if (page === "checkout") {
    // 9️⃣ Checkout (scCheckout)
    window.adobeDataLayer.push({
      event: "scCheckout",
      custData: custData,
      cart: {
        items: cartItems,
        totalQuantity: totalQuantity,
        totalValue: totalValue,
        currency: "INR"
      }
    });
  }
}

/* ---------- PRODUCT CLICK EVENT ---------- */
function fireProductClick(prodId, position) {
  const prod = PRODUCTS.find(p => p.id === prodId);
  if (!prod) return;

  // 6️⃣ Product Click (PLP → PDP)
  window.adobeDataLayer.push({
    event: "productClick",
    custData: custData,
    eventInfo: {
      eventName: "productClick",
      component: "plp_tile"
    },
    product: [{
      productId: prod.id,
      name: prod.title,
      price: prod.price,
      position: position,
      list: "PLP"
    }]
  });
}
function fireAddToCart(prod, qty) {
  // 7️⃣ Add to Cart (scAdd)
  window.adobeDataLayer.push({
    event: "scAdd",
    custData: custData,
    product: [{
      productId: prod.id,
      name: prod.title,
      price: prod.price,
      quantity: qty
    }],
    cart: {
      items: [{
        productId: prod.id,
        name: prod.title,
        price: prod.price,
        quantity: qty
      }],
      totalQuantity: qty,  // For simplicity, assuming this is the only item, but can be updated
      totalValue: prod.price * qty,
      currency: "INR"
    }
  });

  if (window._satellite) {
    _satellite.track("addToCart");
  }
}

/* ---------- PURCHASE EVENT ---------- */
function firePurchase(order) {
  // 🔟 Purchase (Thank You Page)
  window.adobeDataLayer.push({
    event: "purchase",
    custData: custData,
    order: {
      orderId: order.id,
      currency: "INR",
      revenue: order.total,
      tax: 0,
      shipping: 0,
      discount: 0
    },
    cart: {
      items: order.items.map(i => ({
        productId: i.id,
        name: i.title,
        price: i.price,
        quantity: i.qty
      })),
      totalQuantity: order.items.reduce((s, i) => s + i.qty, 0),
      totalValue: order.total,
      currency: "INR"
    },
    shipping: {
      firstName: "",  // Add if available
      lastName: "",
      city: "",
      state: "",
      country: "India"
    }
  });

  if (window._satellite) {
    _satellite.track("purchase");
  }
}


































/* app.js - shared by all pages
   Single source of truth: PRODUCTS list + cart & order functions.
   Pages detect their role by body[data-page].
*/
// window.digitalData = window.digitalData || [];
const PRODUCTS = [
  { uid:'UID-001', id:'p-101', title:'Classic White Tee', price:299, img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', sku:'WT-001', desc:"Soft cotton t-shirt, comfortable fit. Upgrade your everyday essentials with Nobero’s premium 180 GSM T-Shirts, crafted from 100% combed cotton and treated with bio-wash and pre-shrunk technology for long-lasting comfort and durability. Designed with a classic crew neck and short sleeves, these tees are lightweight, breathable, and built for all-day wear "},

  { uid:'UID-002', id:'p-102', title:'Blue Denim Jeans', price:1499, img:'https://wrogn.com/cdn/shop/files/1_6b8140c5-6f1f-4483-9452-2c5fa2f45e09.jpg?v=1749210688', sku:'DJ-002', desc:'Slim fit denim with stretch.'},

  { uid:'UID-003', id:'p-103', title:'Running Sneakers', price:3499, img:'https://images.puma.com/image/upload/f_auto,q_auto,w_600,b_rgb:FAFAFA/global/310088/14/fnd/ZAF/fmt/png', sku:'SN-003', desc:'Lightweight running shoes.'},

  { uid:'UID-004', id:'p-104', title:'Leather Wallet', price:799, img:'https://urbanforest.co.in/cdn/shop/files/A7402041.jpg?v=1733571068', sku:'WL-004', desc:'Genuine leather, multiple slots.'},

  { uid:'UID-005', id:'p-105', title:'Smartwatch', price:8999, img:'https://gourban.in/cdn/shop/files/Pulse.jpg?v=1749553994&width=2048', sku:'SW-005', desc:'Activity tracking and notifications.'},

  { uid:'UID-006', id:'p-106', title:'Black Hoodie', price:1199, img:'https://nobero.com/cdn/shop/files/believe_in_yourself_83856a14-fcf8-49fe-b285-348391d538f6.jpg?v=1760173339', sku:'BH-006', desc:'Warm fleece hoodie with pockets.'},

  { uid:'UID-007', id:'p-107', title:'Sports Cap', price:399, img:'https://invincible.in/cdn/shop/products/InvincibleUnisexQuickDryLightWeightSportsCaps-3_2048x2048.jpg?v=1656311645', sku:'CP-007', desc:'Breathable cotton sports cap.'},

  { uid:'UID-008', id:'p-108', title:'Wireless Earbuds', price:2499, img:'https://elver.in/cdn/shop/files/Elver_Buds_X_True_Wireless_Earbuds.png?v=1755252622', sku:'EB-008', desc:'Noise-cancelling wireless earbuds.'},

  { uid:'UID-009', id:'p-109', title:'Travel Backpack', price:1999, img:'https://icon.in/cdn/shop/files/1_50b8664b-0c2b-477a-9d86-ed6fce060859.jpg?v=1756985540', sku:'BP-009', desc:'Durable backpack with spacious compartments.'},

  { uid:'UID-010', id:'p-110', title:'Analog Wrist Watch', price:1599, img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30', sku:'AW-010', desc:'Stylish analog watch with leather strap.'},

  { uid:'UID-011', id:'p-111', title:'Sunglasses', price:899, img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083', sku:'SG-011', desc:'UV-protected polarized sunglasses.'},

  { uid:'UID-012', id:'p-112', title:'Casual Sneakers', price:2799, img:'https://admin.mochishoes.com/product/71-264/660/71-264-16-40-1.JPG', sku:'CS-012', desc:'Comfortable sneakers for daily use.'},

  { uid:'UID-013', id:'p-113', title:'Formal Shirt', price:999, img:'https://images.meesho.com/images/products/398396769/lorj9_512.webp?width=512', sku:'FS-013', desc:'Slim-fit formal shirt for office wear.'},

  { uid:'UID-014', id:'p-114', title:'Laptop Sleeve', price:599, img:'https://www.thepostbox.in/cdn/shop/files/04_12434f64-cf19-4041-b119-f50c2bf20c8f_1800x1800.jpg?v=1736317493', sku:'LS-014', desc:'Protective sleeve for laptops up to 15 inches.'},

  { uid:'UID-015', id:'p-115', title:'Fitness Band', price:1999, img:'https://5.imimg.com/data5/SELLER/Default/2021/1/YP/LY/FV/78305368/m4-fitness-band.png', sku:'FB-015', desc:'Tracks heart rate, steps, and sleep.'},

  { uid:'UID-016', id:'p-116', title:'Perfume Spray', price:1299, img:'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2024/7/6/326a22c5-9bc6-4b4d-a5f4-67e445060f93_perfume_PZKFD3J0K2_MN.png', sku:'PF-016', desc:'Long-lasting refreshing fragrance.'}
];


const CART_KEY = 'mini_cart_v2';
const ORDER_KEY = 'mini_last_order_v2';

function getCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return []} }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); srtCartDl(c); }
function clearCart(){ localStorage.removeItem(CART_KEY); updateCartCount(); }

function updateCartCount(){
  const c = getCart().reduce((s,i)=>s+i.qty,0);
  const els = document.querySelectorAll('#cartCount');
  els.forEach(e=>e.textContent = c);
}

/* utility to read query param from url */
function qParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/* PAGE: PLP */
function renderPLP(){
  const root = document.getElementById('productsGrid');
  if(!root) return;
  root.innerHTML = '';
  PRODUCTS.forEach((p, index)=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div class="muted">${p.sku}</div>
      <div class="price">₹${p.price.toLocaleString()}</div>
      <div style="margin-top:8px;">
        <a class="btn " href="pdp.html?id=${encodeURIComponent(p.id)}" onclick="fireProductClick('${p.id}', ${index + 1})">View</a>
        <button class="btn-ghost " onclick="quickAdd('${p.id}')">Add</button>
      </div>
    `;
    root.appendChild(card);
  });

  // 4️⃣ Product Impression (PLP)
  const products = PRODUCTS.map((p, index) => ({
    productId: p.id,
    name: p.title,
    brand: "MyBrand",
    category: "General",
    price: p.price,
    position: index + 1,
    list: "PLP"
  }));

  window.adobeDataLayer.push({
    event: "productImpression",
    custData: custData,
    page: {
      name: "Product Listing",
      type: "plp"
    },
    products: products
  });
}

function quickAdd(id){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;

  const cart = getCart();
  const found = cart.find(i=>i.id===id);

  if(found) found.qty += 1; 
  else cart.push({id:prod.id, title:prod.title, price:prod.price, img:prod.img, qty:1});

  saveCart(cart);

  // /* 🔥 ADOBE ADD TO CART EVENT */
   fireAddToCart(prod, 1);

  alert('Added to cart');
}


/* PAGE: PDP */
function renderPDP(){
  const id = qParam('id');
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) {
    // fallback to products page if invalid id
    window.location = 'plp.html';
    return;
  }
  document.getElementById('pdpImage').src = prod.img;
  document.getElementById('pdpTitle').textContent = prod.title;
  document.getElementById('pdpSku').textContent = prod.sku;
  document.getElementById('pdpPrice').textContent = '₹' + prod.price.toLocaleString();
  document.getElementById('pdpDesc').textContent = prod.desc;
  const qtyInput = document.getElementById('pdpQty');

  document.getElementById('incQty').onclick = ()=>{ qtyInput.value = Math.max(1, Number(qtyInput.value||1)+1); };
  document.getElementById('decQty').onclick = ()=>{ qtyInput.value = Math.max(1, Number(qtyInput.value||1)-1); };

  document.getElementById('addToCartBtn').onclick = ()=>{
  const qty = Math.max(1, Number(qtyInput.value||1));
  const cart = getCart();
  const found = cart.find(i=>i.id===prod.id);

  if(found) found.qty += qty; 
  else cart.push({ id:prod.id, title:prod.title, price:prod.price, img:prod.img, qty });

  saveCart(cart);

  /* 🔥 ADOBE ADD TO CART EVENT */
  fireAddToCart(prod, qty);

  window.location = 'cart.html';
};

}

/* PAGE: CART */
function renderCart(){
  const root = document.getElementById('cartList');
  if(!root) return;
  const cart = getCart();
  root.innerHTML = '';
  if(cart.length===0){
    root.innerHTML = '<div class="card muted">Your cart is empty.</div>';
    document.getElementById('cartFooter').style.display = 'none';
    return;
  }
  document.getElementById('cartFooter').style.display = 'flex';
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${item.img}" style="width:80px;height:60px;object-fit:cover;border-radius:6px">
        <div>
          <strong>${item.title}</strong><div class="muted">₹${item.price} × ${item.qty}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <div class="qty-control">
          <button onclick="changeItemQty('${item.id}', -1)">−</button>
          <div style="padding:8px 12px">${item.qty}</div>
          <button onclick="changeItemQty('${item.id}', 1)">+</button>
        </div>
        <button class="btn-ghost" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    `;
    root.appendChild(row);
  });
  const total = cart.reduce((s,i)=>s + i.qty * i.price,0);
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();
}

function changeItemQty(id, delta){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCart();
}
function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
  renderCart();
}

/* cart page handlers */
document.addEventListener('DOMContentLoaded', ()=>{
  // wire clear & proceed buttons if present
  const clearBtn = document.getElementById('clearCart');
  if(clearBtn) clearBtn.onclick = ()=>{ if(confirm('Clear cart?')){ clearCart(); renderCart(); } };

  const proceedBtn = document.getElementById('proceedCheckout');
  if(proceedBtn) proceedBtn.onclick = ()=> {
    const cart = getCart();
    if(cart.length===0){ alert('Cart is empty'); return; }
    window.location = 'checkout.html';
  };
});

/* PAGE: CHECKOUT */
function handleCheckout(){
  const form = document.getElementById('checkoutForm');
  if(!form) return;
  form.onsubmit = (ev)=>{
    ev.preventDefault();
    // build order
    const cart = getCart();
    if(cart.length===0){ alert('Cart empty'); return; }
    const formData = new FormData(form);
    const order = {
      id: 'ORD-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*900+100),
      date: new Date().toISOString(),
      name: formData.get('name'),
      email: formData.get('email'),
      address: formData.get('address'),
      items: cart,
      total: cart.reduce((s,i)=>s + i.price * i.qty, 0)
    };
    // store order to session so payment pages can read
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    // go to payment method selector
    window.location = 'payment-method.html';
  };
}

/* PAGE: PAYMENT METHOD */
function wirePaymentOptions(){
  const buttons = document.querySelectorAll('.pay-option');
  buttons.forEach(b=>{
    b.onclick = ()=>{
      const method = b.dataset.method;
      // store chosen method
      const orderStr = sessionStorage.getItem(ORDER_KEY);
      if(!orderStr){ alert('No order found. Go to checkout.'); window.location='checkout.html'; return; }
      const order = JSON.parse(orderStr);
      order.method = method;
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
      // go to payment page. We'll pass order id in query for clarity
      window.location = `payment.html?orderid=${encodeURIComponent(order.id)}`;
    };
  });
}

/* PAGE: PAYMENT (show product image and product id) */
function renderPaymentPage(){
  const paramsOrderId = qParam('orderid');
  const order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
  if(!order || order.id !== paramsOrderId){ alert('Problem with order. Redirecting to checkout.'); window.location='checkout.html'; return; }
  // show first product's image and id (as requested)
  const first = order.items[0];
  const product = PRODUCTS.find(p=>p.id === first.id) || first;
  const imgWrap = document.getElementById('payThumb');
  if(imgWrap) imgWrap.innerHTML = `<img src="${product.img}" alt="${product.title}" style="width:120px;height:90px;object-fit:cover;border-radius:6px">`;
  document.getElementById('payProductId').textContent = first.id;
  document.getElementById('payAmount').textContent = '₹' + order.total.toLocaleString();
  document.getElementById('payMethod').textContent = 'Method: ' + (order.method ? order.method.toUpperCase() : '—');

  document.getElementById('confirmPay').onclick = ()=>{
    // simulate payment: go to processing + finalize
    window.location = `processing.html?orderid=${encodeURIComponent(order.id)}`;
    // actual processing: handled in processing page loader
  };
}

/* PAGE: PROCESSING (simulate then go to thankyou) */
function renderProcessing(){
  const orderid = qParam('orderid');
  const order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
  if(!order || order.id !== orderid){ window.location = 'checkout.html'; return; }
  // simulate a 1.5s processing then finalize
  setTimeout(()=>{
    // clear cart
    clearCart();
    // keep order id in session for thankyou display (optional)
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    window.location = `thankyou.html?orderid=${encodeURIComponent(order.id)}`;
  }, 1500);
}

/* PAGE: THANKYOU */
function renderThankyou(){
  const orderid = qParam('orderid');
  const order = JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
  if(!order || order.id !== orderid){
    // still try to show id if present in param
    const el = document.getElementById('thankOrderId');
    if(el) el.textContent = orderid || '—';
    return;
  }
  const el = document.getElementById('thankOrderId');
  if(el) el.textContent = order.id;
  const summary = document.getElementById('thankSummary');
  if(summary) summary.textContent = `Order total: ₹${order.total.toLocaleString()}. A confirmation has been sent to ${order.email || 'your email'}.`;
  // remove last order from session if you want persistence cleared:
  sessionStorage.removeItem(ORDER_KEY);
}

/* On load: detect page and run renderers */
(function init(){
  updateCartCount();
  const page = document.body.dataset.page;
  if(page === 'plp') renderPLP();
  else if(page === 'pdp') renderPDP();
  else if(page === 'cart') renderCart();
  else if(page === 'checkout') handleCheckout();
  else if(page === 'payment-method') wirePaymentOptions();
  else if(page === 'payment') renderPaymentPage();
  else if(page === 'processing') renderProcessing();
  else if(page === 'thankyou') renderThankyou();
})();



let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const slidesContainer = document.querySelector(".slides");

if (slidesContainer) {
  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlide = index;
    slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[currentSlide].classList.add("active");
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4000);

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => showSlide(idx));
  });
}





/********************************
 * CALL DATA LAYER AT RIGHT TIME
 ********************************/

document.addEventListener("DOMContentLoaded", function () {

  /* 1️⃣ PAGE DATA LAYER (ALL PAGES) */
  setPageDL();

  const page = document.body.dataset.page;

  /* 2️⃣ PDP – PRODUCT DATA */
  if (page === "pdp") {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (PRODUCTS && id) {
      const prod = PRODUCTS.find(p => p.id === id);
      if (prod) {
        setProductDL(prod);
      }
    }
  }

  /* 3️⃣ CART PAGE – CART DATA */
  if (page === "cart") {
    const cart = JSON.parse(localStorage.getItem("mini_cart_v2") || "[]");
    setCartDL(cart);
  }

  /* 3.5️⃣ CHECKOUT PAGE – CART DATA */
  if (page === "checkout") {
    const cart = JSON.parse(localStorage.getItem("mini_cart_v2") || "[]");
    setCartDL(cart);
  }

  /* 4️⃣ THANK YOU PAGE – PURCHASE EVENT */
  if (page === "thankyou") {
    const order = JSON.parse(sessionStorage.getItem("mini_last_order_v2") || "null");
    const fired = sessionStorage.getItem("purchase_fired");

    /* 🔥 FIX 4: Prevent duplicate purchase */
    if (order && !fired) {
      firePurchase(order);
      sessionStorage.setItem("purchase_fired", "yes");
    }
  }

});




