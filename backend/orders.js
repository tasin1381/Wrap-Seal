const mongoose = require("mongoose");


const orderSchema =
    new mongoose.Schema(

        {

            orderId: {
                type: String,
                required: true,
                unique: true
            },


            customer: {

                name: String,

                phone: String,

                email: String,

                address: String

            },


            area: String,

            items: [

                {

                    id: String,

                    name: String,

                    price: Number,

                    quantity: Number

                }

            ],


            subtotal: Number,

            deliveryCharge: Number,

            total: Number,


            paymentMethod: String,

            notes: String,


            status: {

                type: String,

                default: "Pending"

            }

        },

        {

            timestamps: true

        }

    );


module.exports =
    mongoose.model(
        "Order",
        orderSchema
    );
