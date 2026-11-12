document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderProducts();

        renderCart();

        updateCartCount();


        document.getElementById(
            "store-phone"
        ).textContent =
            STORE.phone;


        document.getElementById(
            "store-email"
        ).textContent =
            STORE.email;


        document.getElementById(
            "store-address"
        ).textContent =
            STORE.address;

    }
);
