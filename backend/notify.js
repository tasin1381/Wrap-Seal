const nodemailer =
    require("nodemailer");


async function sendEmail(order) {

    const transporter =
        nodemailer.createTransport({

            service: "gmail",

            auth: {

                user:
                    process.env.GMAIL_USER,

                pass:
                    process.env.GMAIL_APP_PASSWORD

            }

        });


    const itemText =
        order.items
            .map(
                item =>
                    `${item.name} × ${item.quantity}`
            )
            .join("\n");


    await transporter.sendMail({

        from:
            `"Wrap & Seal" <${process.env.GMAIL_USER}>`,

        to:
            process.env.ORDER_EMAIL,

        subject:
            `🛒 New Order — ${order.orderId}`,

        text: `

WRAP & SEAL — NEW ORDER

Order ID: ${order.orderId}

Customer:
${order.customer.name}

Phone:
${order.customer.phone}

Email:
${order.customer.email}

Address:
${order.customer.address}

Products:
${itemText}

Subtotal:
৳${order.subtotal}

Delivery:
৳${order.deliveryCharge}

Total:
৳${order.total}

Payment:
${order.paymentMethod}

Notes:
${order.notes || "None"}

Status:
${order.status}

        `

    });

}


async function sendTelegram(order) {

    const text = `

🛒 NEW ORDER — WRAP & SEAL

🆔 Order: ${order.orderId}

👤 Customer:
${order.customer.name}

📱 Phone:
${order.customer.phone}

📧 Email:
${order.customer.email}

📍 Address:
${order.customer.address}

💰 Total:
৳${order.total}

💳 Payment:
${order.paymentMethod}

📦 Status:
${order.status}

    `;


    const url =
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;


    await fetch(url, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify({

            chat_id:
                process.env.TELEGRAM_CHAT_ID,

            text

        })

    });

}


async function sendWhatsApp(order) {

    /*
        WhatsApp Cloud API will be connected
        after Meta Business API setup.

        Do NOT put access token in frontend.
    */

    console.log(
        "WhatsApp notification queued:",
        order.orderId
    );

}


async function sendOrderNotifications(order) {

    const results = {

        email: false,

        telegram: false,

        whatsapp: false

    };


    try {

        await sendEmail(order);

        results.email = true;

    } catch (error) {

        console.error(
            "Email notification failed:",
            error.message
        );

    }


    try {

        await sendTelegram(order);

        results.telegram = true;

    } catch (error) {

        console.error(
            "Telegram notification failed:",
            error.message
        );

    }


    try {

        await sendWhatsApp(order);

        results.whatsapp = true;

    } catch (error) {

        console.error(
            "WhatsApp notification failed:",
            error.message
        );

    }


    return results;
}


module.exports =
    sendOrderNotifications;
