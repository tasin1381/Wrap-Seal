let cart =
    JSON.parse(
        localStorage.getItem("wrap_seal_cart")
    ) || [];


function saveCart() {

    localStorage.setItem(
        "wrap_seal_cart",
        JSON.stringify(cart)
    );
}


function addToCart(productId) {

    const product =
        getProductById(productId);

    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    updateCartCount();

    alert("Product added to cart.");
}


function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    renderCart();

    updateCartCount();
}


function changeQuantity(productId, change) {

    const item =
        cart.find(
            item => item.id === productId
        );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(productId);

        return;
    }


    saveCart();

    renderCart();

    updateCartCount();
}


function getCartSubtotal() {

    return cart.reduce(

        (total, item) => {

            return total +
                (item.price * item.quantity);

        },

        0
    );
}


function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const element =
        document.getElementById("cart-count");


    if (element) {

        element.textContent = count;
    }
}


function renderCart() {

    const container =
        document.getElementById("cart-items");

    const totalElement =
        document.getElementById("cart-total");


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty.</p>";

        if (totalElement) {

            totalElement.textContent =
                APP_CONFIG.CURRENCY + "0";
        }

        return;
    }


    container.innerHTML = "";


    cart.forEach(item => {

        const element =
            document.createElement("div");

        element.className = "cart-item";


        element.innerHTML = `

            <div>

                <strong>
                    ${item.name}
                </strong>

                <p>
                    ${APP_CONFIG.CURRENCY}${item.price}
                </p>

            </div>


            <div>

                <button
                    onclick="changeQuantity('${item.id}', -1)"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity('${item.id}', 1)"
                >
                    +
                </button>

                <button
                    onclick="removeFromCart('${item.id}')"
                >
                    Remove
                </button>

            </div>

        `;


        container.appendChild(element);

    });


    if (totalElement) {

        totalElement.textContent =
            APP_CONFIG.CURRENCY +
            getCartSubtotal();
    }
}


function clearCart() {

    cart = [];

    saveCart();

    renderCart();

    updateCartCount();
}


function openCart() {

    renderCart();

    document
        .getElementById("cart-modal")
        .classList.add("active");
}


function closeCart() {

    document
        .getElementById("cart-modal")
        .classList.remove("active");
}
