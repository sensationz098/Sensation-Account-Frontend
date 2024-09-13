let profile = JSON.parse(localStorage.getItem('Data'))
const token = profile.token

document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://final-backend-mark1.onrender.com/user/allusers";
    const usersContainer = document.getElementById("usersContainer");
    let currentUserId = null;

 

    if(!profile || !token || isTokenExpired(token)){
        alert('Token has expired! Please log in again. ');
        window.location.href = './index.html';
        return;
    }

    const addUserForm = document.getElementById("addUserForm");

    const addUserModal = new bootstrap.Modal(
      document.getElementById("addUserModal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );

    

    addUserForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const newUsername = document.getElementById("newUsername2").value;
      const newEmail = document.getElementById("newEmail2").value;
      const newPassword = document.getElementById("newPassword").value;
      const newContact = document.getElementById("newContact2").value;
      const newRole = document.getElementById("newRole").value;

      console.log("newUsername:", newUsername);
      console.log("newEmail:", newEmail);
      console.log("newContact:", newContact);
      console.log("newRole:", newRole);

      const newUserData = {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        contact: newContact,
        role: newRole,
      };

      console.log("New User Data:", newUserData);

      // Perform a fetch request to add a new user
      fetch("https://final-backend-mark1.onrender.com/auth/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(newUserData),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("User Added Successfully")
          window.location.reload()
          console.log("User added successfully:", data);
          // Optionally, update the UI or perform additional actions after adding a user
        })
        .catch((error) => console.error("Error adding user:", error));

      // Close the modal after form submission
      addUserModal.hide();
    });


    const username = document.getElementById("username");
    username.textContent = `Hey ${profile.username}`;

    fetch(apiUrl,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then((response) => response.json())
      .then((users) => {
        // Iterate through each user and create a Bootstrap card
        users.forEach((user) => {
          const card = document.createElement("div");
          card.classList.add("card", "mb-3", "mx-3");
          card.style.width = "18rem";
          card.innerHTML = `
                        <img style="gap: 5px" src="./photos/userpic.png" class="card-img-top" alt="User Image">
                        <div class="card-body">
                            <h5 class="card-title">${user.username}</h5>
                            <p class="card-text">Email: ${user.email}</p>
                            <p class="card-text">Contact: ${user.contact}</p>
                            <p class="card-text">Role: ${user.role}</p>
                            <p class="card-text">Id: ${user._id}</p>
                            <button class="btn btn-primary" onclick="editProfile('${user._id}')">Edit Profile</button>
                            <button id="changePassword" style="margin-top: 2%" class="btn btn-primary" onclick="changePass('${user._id}')">Change Password</button>
                        </div>
                        
                    `;
          usersContainer.appendChild(card);
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  });



  function isTokenExpired(token) {
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Date.now() >= expiry * 1000;
}


  function changePass(userId) {
const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'), {
    backdrop: 'static',
    keyboard: false
});

// Show the modal
changePasswordModal.show();

// Form submission logic for changing password
const changePasswordForm = document.getElementById('changePasswordForm');
changePasswordForm.addEventListener('submit', function (event) {
    event.preventDefault();

    

    const newPassword = document.getElementById('newPassword2').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    console.log(newPassword, confirmNewPassword)
    // Check if passwords match
    if (newPassword !== confirmNewPassword) {
        console.error("Passwords do not match");
        return;
    }

    // Perform a fetch request to change the password
    fetch(`https://final-backend-mark1.onrender.com/user/changePassword/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
            password: newPassword,
            confirmPassword: confirmNewPassword
        }),
    })
    .then(res => res.json())
    .then(data => {

      alert("Password changed successfully!!")
      window.location.reload()
        console.log('Password changed successfully:', data);
        // Optionally, update the UI or perform additional actions after changing the password
    })
    .catch(error => console.error('Error changing password:', error));

    // Close the modal after form submission
    changePasswordModal.hide();
});
}


  function editProfile(userId) {

    currentUserId = userId;

    // Set up the modal with the appropriate user ID
    const editProfileModal = new bootstrap.Modal(
      document.getElementById("editProfileModal"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );

    // Fetch user details using the global variable currentUserId
    if (currentUserId) {
      fetch(`https://final-backend-mark1.onrender.com/user/allusers?id=${currentUserId}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
        .then((response) => response.json())
        .then((userData) => {
          console.log(userData);
          // Populate form fields with user data
          document.getElementById("newUsername").value =
            userData[0].username;
          document.getElementById("newEmail").value = userData[0].email;
          document.getElementById("newContact").value = userData[0].contact;
          // Populate other form fields as needed
        })
        .catch((error) =>
          console.error("Error fetching user details:", error)
        );
    }

    editProfileModal.show();

    const editProfileForm = document.getElementById("editProfileForm");
    editProfileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      // Handle form submission logic (e.g., update user data on the server)
      const newUsername = document.getElementById("newUsername").value;
      const newEmail = document.getElementById("newEmail").value;
      const newContact = document.getElementById("newContact").value;
      // Once done, you can close the modal

      const updateUserData = {
        username: newUsername,
        email: newEmail,
        contact: newContact,
      };

      fetch(`https://final-backend-mark1.onrender.com/user/profile/update/${currentUserId}`, {
        method: "PUT",
        headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
        body: JSON.stringify(updateUserData),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Update Successfull !!")
          window.location.reload()
          console.log("Update Successfull:", data);
        })
        .catch((error) => console.log(error));
      editProfileModal.hide();
    });
  }


