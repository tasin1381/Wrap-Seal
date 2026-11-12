require("dotenv").config();


const express =
    require("express");


const cors =
    require("cors");


const connectDatabase =
    require("./db");


const Order =
    require("./orders");


const sendOrderNotifications =
    require("./notify");


const app =
    express();


/* =========================
   DATABASE
========================= */

connectDatabase();


/* =========================
   MIDDLEWARE
========================= */

app.use(
    cors({
        origin: true
    })
);


app.use(
    express.json()
);


/* =========================
   HEALTH CHECK
========================= */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Wrap & Seal API is running."

        });

    }
);


/* =========================
   CREATE ORDER
========================= */

app.post(
    "/api/orders",
    async (req, res) => {

        try {

            const data =
                req.body;


            if (
                !data.customer ||
                !data.customer.name ||
                !data.customer.phone ||
                !data.customer.email
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Customer information is required."

                });

            }


            if (
                !Array.isArray(data.items) ||
                data.items.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Cart is empty."

                });

            }


            const orderId =

                "WS-" +

                Date.now();


            const order =

                new Order({

                    orderId,

                    customer:
                        data.customer,

                    area:
                        data.area,

                    items:
                        data.items,

                    subtotal:
                        data.subtotal,

                    deliveryCharge:
                        data.deliveryCharge,

                    total:
                        data.total,

                    paymentMethod:
                        data.paymentMethod ||
                        "Cash on Delivery",

                    notes:
                        data.notes || "",

                    status:
                        "Pending"

                });


            await order.save();


            /*
                IMPORTANT:

                Order is saved FIRST.

                Even if email/Telegram
                fails, the order remains
                in MongoDB.
            */

            await sendOrderNotifications(
                order
            );


            return res.status(201).json({

                success: true,

                message:
                    "Order created successfully.",

                orderId:
                    order.orderId

            });


        } catch (error) {

            console.error(error);


            return res.status(500).json({

                success: false,

                message:
                    "Unable to create order."

            });

        }

    }
);


/* =========================
   START SERVER
========================= */

const PORT =
    process.env.PORT || 5000;


app.listen(

    PORT,

    () => {

        console.log(
            `Wrap & Seal API running on port ${PORT}`
        );

    }

);
