const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyAiwCBF6OwtjRaepZSZPEtnnMlOq7mjWdE",
        authDomain: "add-student-ba434.firebaseapp.com",
        projectId: "add-student-ba434",
        storageBucket: "add-student-ba434.appspot.com",
        messagingSenderId: "497941045186",
        appId: "1:497941045186:web:df26a69f6016fb6580005b",
        measurementId: "G-EW2WVE4QPW"
    });

// Initialize Firebase
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

console.log();


//////   log in page ////////

const logIn = document.getElementById("login");

logIn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            // Signed in 
            alert("Your successfully log In")
            window.location.href = "./dashbord/dashbord.html";
            // ...
        })
        .catch((error) => {
            alert("error try again")
            console.log(error.code);
            console.log(error.message);
        });
});