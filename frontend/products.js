const PRODUCTS = [

    {
        id: "WS001",
        name: "Classic Product",
        price: 850,
        category: "Featured",
        image: "assets/product-1.jpg"
    },

    {
        id: "WS002",
        name: "Premium Product",
        price: 1200,
        category: "Featured",
        image: "assets/product-2.jpg"
    },

    {
        id: "WS003",
        name: "Essential Product",
        price: 650,
        category: "Featured",
        image: "assets/product-3.jpg"
    },

    {
        id: "WS004",
        name: "Signature Product",
        price: 1500,
        category: "Featured",
        image: "assets/product-4.jpg"
    }

];


function renderProducts() {

    const container =
        document.getElementById("products-grid");

    if (!container) return;

    container.innerHTML = "";

    PRODUCTS.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    ${APP_CONFIG.CURRENCY}${product.price}
                </p>

                <button
                    class="add-cart-btn"
                    onclick="addToCart('${product.id}')"
                >
                    Add to Cart
                </button>

            </div>

        `;

        container.appendChild(card);

    });
}


function getProductById(id) {

    return PRODUCTS.find(
        product => product.id === id
    );
}
