function openCheckout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    closeCart();

    document
        .getElementById("checkout-modal")
        .classList.add("active");
}


function closeCheckout() {

    document
        .getElementById("checkout-modal")
        .classList.remove("active");
}


function getDeliveryCharge() {

    const area =
        document.getElementById(
            "checkout-area"
        ).value;

    if (area === "outside") {

        return APP_CONFIG
            .DELIVERY_OUTSIDE_DHAKA;
    }

    return APP_CONFIG
        .DELIVERY_INSIDE_DHAKA;
}


async function submitOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    const button =
        event.target.querySelector(
            "button[type='submit']"
        );


    const message =
        document.getElementById(
            "checkout-message"
        );


    button.disabled = true;

    button.textContent =
        "Processing...";


    try {

        // ==========================================
        // 1. GET LOGGED-IN FIREBASE USER
        // ==========================================

        const user = firebase.auth().currentUser;


        if (!user) {

            throw new Error(
                "Please login to your account before placing an order."
            );
        }


        // ==========================================
        // 2. GET CHECKOUT INFORMATION
        // ==========================================

        const name =
            document.getElementById(
                "checkout-name"
            ).value.trim();


        const phone =
            document.getElementById(
                "checkout-phone"
            ).value.trim();


        const email =
            document.getElementById(
                "checkout-email"
            ).value.trim();


        const address =
            document.getElementById(
                "checkout-address"
            ).value.trim();


        const area =
            document.getElementById(
                "checkout-area"
            ).value;


        const notes =
            document.getElementById(
                "checkout-notes"
            ).value.trim();


        // ==========================================
        // 3. CALCULATE ORDER TOTAL
        // ==========================================

        const subtotal =
            getCartSubtotal();


        const deliveryCharge =
            getDeliveryCharge();


        const total =
            subtotal + deliveryCharge;


        // ==========================================
        // 4. CREATE ORDER DATA
        // ==========================================

        const orderData = {

            // Firebase user ID
            userId: user.uid,

            customer: {

                name,

                phone,

                email,

                address

            },

            area,

            notes,

            items: cart,

            subtotal,

            deliveryCharge,

            total,

            paymentMethod:
                "Cash on Delivery"

        };


        // ==========================================
        // 5. SEND ORDER TO BACKEND
        // ==========================================

        const response =
            await fetch(
                `${APP_CONFIG.API_BASE_URL}/orders`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(orderData)

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Order failed."
            );
        }


        // ==========================================
        // 6. SAVE ORDER HISTORY TO FIRESTORE
        // ==========================================

        await db
            .collection("orders")
            .doc(result.orderId)
            .set({

                orderId:
                    result.orderId,

                userId:
                    user.uid,

                customer: {

                    name,

                    phone,

                    email,

                    address

                },

                area,

                notes,

                items: cart,

                subtotal,

                deliveryCharge,

                total,

                paymentMethod:
                    "Cash on Delivery",

                status:
                    "Pending",

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });


        // ==========================================
        // 7. SHOW SUCCESS MESSAGE
        // ==========================================

        message.innerHTML = `

            <div class="order-success">

                <h3>
                    Order Confirmed ✓
                </h3>

                <p>
                    Your order has been received.
                </p>

                <p>
                    <strong>
                        Order ID:
                    </strong>

                    ${result.orderId}
                </p>

                <p>
                    <strong>
                        Total:
                    </strong>

                    ${APP_CONFIG.CURRENCY}${total}
                </p>

            </div>

        `;


        // ==========================================
        // 8. CLEAR CART
        // ==========================================

        clearCart();


        document
            .getElementById(
                "checkout-form"
            )
            .reset();


        // Refresh My Orders
        if (typeof loadMyOrders === "function") {

            loadMyOrders();

        }


    } catch (error) {

        console.error(error);


        message.innerHTML = `

            <div class="order-error">

                ${error.message}

            </div>

        `;

    } finally {

        button.disabled = false;

        button.textContent =
            "Place Order";
    }
}


document
    .getElementById("checkout-form")
    .addEventListener(
        "submit",
        submitOrder
    );
