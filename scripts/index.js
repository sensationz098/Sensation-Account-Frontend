
document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById('contact').value;
    const password = document.getElementById('password').value;

    let profile = JSON.parse(localStorage.getItem('Data'))
    console.log(profile)

    const spinner = document.createElement("div");
    spinner.innerHTML = '<div class="spinner-grow text-dark" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(spinner);

    // Make a POST request to your backend
    const response = await fetch("https://final-backend-mark1.onrender.com/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contact: usernameOrEmail,
            password: password,
        }),
    });

    const data = await response.json();

    if (response.ok) {
        // Store the token in local storage
        localStorage.setItem('Data', JSON.stringify(data));

        if (data.role === "user") {
            window.location.href = "./userDashboard.html";
        } else if (data.role === "admin") {
            window.location.href = "./home.html";
        }

        // Clear input fields
        document.getElementById('contact').value = "";
        document.getElementById('password').value = "";
    } else {
        // Handle login failure (e.g., display an error message)
        console.error(data.msg);
        alert('Incorrect Credentials!!')

        // Clear input fields
        document.getElementById('contact').value = "";
        document.getElementById('password').value = "";
    }

    // Remove the spinner
    document.body.removeChild(spinner);
});









