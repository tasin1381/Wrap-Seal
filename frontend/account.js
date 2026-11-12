// ========================================
// WRAP & SEAL — FIREBASE ACCOUNT SYSTEM
// ========================================

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJx8A6rJExtGxL5xuZqR-nCC3eXsRMEJg",
    authDomain: "tasin-40c58.firebaseapp.com",
    projectId: "tasin-40c58",
    storageBucket: "tasin-40c58.firebasestorage.app",
    messagingSenderId: "1089282991754",
    appId: "1:1089282991754:web:fcc35d27d8d5d515eb2f73",
    measurementId: "G-L1HT9YRPE4"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ========================================
// OPEN / CLOSE ACCOUNT
// ========================================

function openAccount() {

    document
        .getElementById("account-modal")
        .classList.add("active");

}


function closeAccount() {

    document
        .getElementById("account-modal")
        .classList.remove("active");

}


// ========================================
// LOGIN / SIGNUP SWITCH
// ========================================

function showLogin() {

    document.getElementById(
        "login-section"
    ).style.display = "block";

    document.getElementById(
        "signup-section"
    ).style.display = "none";

    clearAuthMessage();

}


function showSignup() {

    document.getElementById(
        "login-section"
    ).style.display = "none";

    document.getElementById(
        "signup-section"
    ).style.display = "block";

    clearAuthMessage();

}


// ========================================
// MESSAGE
// ========================================

function showAuthMessage(message, success = false) {

    const element =
        document.getElementById("auth-message");

    if (!element) return;

    element.textContent = message;

    element.className =
        success
            ? "auth-success"
            : "auth-error";

}


function clearAuthMessage() {

    const element =
        document.getElementById("auth-message");

    if (element) {

        element.textContent = "";

        element.className = "";

    }

}


// ========================================
// FIREBASE ERROR MESSAGE
// ========================================

function getFirebaseError(error) {

    const errors = {

        "auth/email-already-in-use":
            "This email is already registered.",

        "auth/invalid-email":
            "Please enter a valid email address.",

        "auth/weak-password":
            "Password should contain at least 6 characters.",

        "auth/user-not-found":
            "No account found with this email.",

        "auth/wrong-password":
            "Incorrect email or password.",

        "auth/invalid-credential":
            "Incorrect email or password.",

        "auth/too-many-requests":
            "Too many attempts. Please try again later."

    };


    return errors[error.code] ||
        "Something went wrong. Please try again.";

}


// ========================================
// CREATE ACCOUNT
// ========================================

async function createAccount(event) {

    event.preventDefault();

    clearAuthMessage();


    const name =
        document
            .getElementById("signup-name")
            .value
            .trim();


    const email =
        document
            .getElementById("signup-email")
            .value
            .trim();


    const password =
        document
            .getElementById("signup-password")
            .value;


    if (password.length < 6) {

        showAuthMessage(
            "Password must contain at least 6 characters."
        );

        return;

    }


    try {

        showAuthMessage(
            "Creating your account...",
            true
        );


        const result =
            await auth.createUserWithEmailAndPassword(
                email,
                password
            );


        const user =
            result.user;


        // Save customer's display name
        await user.updateProfile({

            displayName: name

        });


        // Save additional customer information
        await db
            .collection("users")
            .doc(user.uid)
            .set({

                name: name,

                email: email,

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });


        showAuthMessage(
            "Account created successfully!",
            true
        );


        document
            .getElementById("signup-form")
            .reset();


        setTimeout(() => {

            updateAccountUI(user);

        }, 800);


    } catch (error) {

        console.error(error);

        showAuthMessage(
            getFirebaseError(error)
        );

    }

}


// ========================================
// LOGIN
// ========================================

async function loginAccount(event) {

    event.preventDefault();

    clearAuthMessage();


    const email =
        document
            .getElementById("login-email")
            .value
            .trim();


    const password =
        document
            .getElementById("login-password")
            .value;


    try {

        showAuthMessage(
            "Signing in...",
            true
        );


        await auth.signInWithEmailAndPassword(
            email,
            password
        );


    } catch (error) {

        console.error(error);

        showAuthMessage(
            getFirebaseError(error)
        );

    }

}


// ========================================
// LOGOUT
// ========================================

async function logoutAccount() {

    try {

        await auth.signOut();

        showLogin();

    } catch (error) {

        console.error(error);

    }

}


// ========================================
// FORGOT PASSWORD
// ========================================

async function resetPassword() {

    const email =
        document
            .getElementById("login-email")
            .value
            .trim();


    if (!email) {

        showAuthMessage(
            "Enter your email address first."
        );

        return;

    }


    try {

        await auth.sendPasswordResetEmail(
            email
        );


        showAuthMessage(
            "Password reset email has been sent.",
            true
        );


    } catch (error) {

        console.error(error);

        showAuthMessage(
            getFirebaseError(error)
        );

    }

}


// ========================================
// ACCOUNT UI
// ========================================

function updateAccountUI(user) {

    const loggedOut =
        document.getElementById(
            "account-logged-out"
        );


    const loggedIn =
        document.getElementById(
            "account-logged-in"
        );


    if (!user) {

        if (loggedOut)
            loggedOut.style.display = "block";

        if (loggedIn)
            loggedIn.style.display = "none";

        return;

    }


    if (loggedOut)
        loggedOut.style.display = "none";


    if (loggedIn)
        loggedIn.style.display = "block";


    const nameElement =
        document.getElementById(
            "account-user-name"
        );


    const emailElement =
        document.getElementById(
            "account-user-email"
        );


    if (nameElement) {

        nameElement.textContent =
            user.displayName ||
            "Wrap & Seal Customer";

    }


    if (emailElement) {

        emailElement.textContent =
            user.email || "";

    }

}


// ========================================
// AUTH STATE
// ========================================

auth.onAuthStateChanged(
    function(user) {

        updateAccountUI(user);

    }
);
