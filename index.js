// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuX8vKygL4iM71IoAE3CiYMjUqPQtTS9o",
  authDomain: "simplecart-19702.firebaseapp.com",
  projectId: "simplecart-19702",
  storageBucket: "simplecart-19702.firebasestorage.app",
  messagingSenderId: "996681238237",
  appId: "1:996681238237:web:e63ccf22faaeb01aba7d34",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");

async function loadProducts() {
  const querySnapshot = await getDocs(collection(db, "products"));
  // productList.innerHTML = "";
  $("#product-list").empty();
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
  <h3>${product.name}</h3>
  <p>Price: $${product.price}</p>
  <button class="add-to-cart" data-id="${doc.id}">Add to Cart</button>
`;
    $("#product-list").append(card);
  });

  $(".add-to-cart")
    .off("click")
    .on("click", function () {
      const productId = $(this).data("id");
      addToCart(productId);
    });
}

async function addToCart(productId) {
  const productRef = doc(db, "products", productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const product = productSnap.data();

    await addDoc(collection(db, "cart"), {
      productId,
      name: product.name || "No name",
      price: product.price || 0,
    });

    loadCart();
  } else {
    console.error("❌ No such product found with ID:", productId);
  }
}

async function loadCart() {
  const querySnapshot = await getDocs(collection(db, "cart"));
  $("#cart-list").empty();

  for (const cartDoc of querySnapshot.docs) {
    const cartItem = cartDoc.data();

    const productRef = doc(db, "products", cartItem.productId);
    const productSnap = await getDoc(productRef);

    let name = "Unknown";
    let price = "N/A";

    if (productSnap.exists()) {
      const product = productSnap.data();
      name = product.name;
      price = product.price;
    }

    const card = $(`
      <div class="card">
        <h3>${name}</h3>
        <p>Price: $${price}</p>
      </div>
    `);
    $("#cart-list").append(card);
  }
}

$(document).ready(function () {
  loadProducts();
  loadCart();
});
