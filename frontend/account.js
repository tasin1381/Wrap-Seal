function openAccount() {

    document
        .getElementById("account-modal")
        .classList.add("active");

    loadAccountInfo();
}


function closeAccount() {

    document
        .getElementById("account-modal")
        .classList.remove("active");
}


function loadAccountInfo() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "wrap_seal_customer"
            )
        );


    if (!saved) return;


    document.getElementById(
        "account-name"
    ).value = saved.name || "";


    document.getElementById(
        "account-email"
    ).value = saved.email || "";


    document.getElementById(
        "account-phone"
    ).value = saved.phone || "";
}


document
    .getElementById("account-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const customer = {

                name:
                    document.getElementById(
                        "account-name"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "account-email"
                    ).value.trim(),

                phone:
                    document.getElementById(
                        "account-phone"
                    ).value.trim()

            };


            localStorage.setItem(

                "wrap_seal_customer",

                JSON.stringify(customer)

            );


            alert(
                "Customer information saved."
            );

        }
    );
