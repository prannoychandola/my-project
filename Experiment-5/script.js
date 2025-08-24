const clothing = ["T-Shirt", "Jeans", "Hoodie", "Jacket"];
const electronics = ["Headphones", "Smartphone", "TWS", "Earphones"];
const books = ["Novel", "Cookbook", "Biography", "Science Fiction"];

const select = document.getElementById("categorySelect");
const container = document.getElementById("productContainer");

function displayProducts(category) {
    container.innerHTML = "";

    let items = [];
    if (category === "clothing") {
        items = clothing;
    } else if (category === "electronics") {
        items = electronics;
    } else if (category === "books") {
        items = books;
    } else {
        items = [...clothing, ...electronics, ...books];
    }

    items.forEach(item => {
        let div = document.createElement("div");
        div.className = "product";
        div.textContent = item;
        container.appendChild(div);
    });
}

displayProducts("all");

select.addEventListener("change", () => {
    displayProducts(select.value);
});