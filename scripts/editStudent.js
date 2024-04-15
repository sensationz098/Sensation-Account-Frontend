let studentData = JSON.parse(localStorage.getItem('StudentData'));
let tokenData = JSON.parse(localStorage.getItem('Data'))
let token = tokenData.token



document.addEventListener('DOMContentLoaded', async function() {
document.getElementById('editName').value = studentData.name || '';
document.getElementById('editEmail').value = studentData.email || '';
document.getElementById('editContact').value = studentData.contact || '';
document.getElementById('editCourse').value = studentData.course || '';
// document.getElementById('editBatch').value = studentData.batch || '';
document.getElementById('editTiming').value = studentData.timing || '';
document.getElementById('editCourseStartDate').value = formatDate(studentData.courseStartDate) || '';
document.getElementById('editCourseEndDate').value = formatDate(studentData.courseEndDate) || '';
document.getElementById('editDateOfPayment').value = formatDate(studentData.date_of_payment) || '';
document.getElementById('editState').value = studentData.state || '';
document.getElementById('editFee').value = studentData.fee || '';
document.getElementById('editCourseDuration').value = studentData.CourseDuration || '';

// Fetch courses from the API
try {
    const response = await fetch(`http://localhost:9090/courses`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`);
    }
    const courses = await response.json();
    console.log(courses); // Log courses array to console to check if it's fetched correctly

    // Populate options
    const editCourseSelect = document.getElementById('editCourse'); // Get reference to the select element
    editCourseSelect.innerHTML = ''; // Clear existing options

    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.coursename; // Assuming 'coursename' is the property containing course name
        option.textContent = course.coursename;
        editCourseSelect.appendChild(option); // Add option to select element
    });

    // If studentData already has a selected course, set it as selected
    if (studentData.course) {
        editCourseSelect.value = studentData.course;
    }

} catch (error) {
    console.error('Error fetching courses:', error);
}



// Populate assigned users dropdown
const assignedUserSelect = document.getElementById('editAssignedUser');
const assignedUserId = studentData.assignedUserId || '';

// Fetch assigned users from the API
try {
  const response = await fetch(`http://localhost:9090/user/allusers`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token
      }
  });
  const users = await response.json();

  // Populate options
  let assignedUserOption;

  users.forEach(user => {
      if (user.role === 'user') {
          const option = document.createElement('option');
          option.value = user._id;
          option.textContent = user.username;
          if (user._id === assignedUserId) {
              assignedUserOption = option; // Save assigned user option separately
          } else {
              assignedUserSelect.appendChild(option); // Add normally
          }
      }
  });

  // Add assigned user option to the top
  if (assignedUserOption) {
      assignedUserOption.selected = true; // Select the assigned user option
      assignedUserSelect.insertBefore(assignedUserOption, assignedUserSelect.firstChild);
  }

} catch (error) {
  console.error('Error fetching assigned users:', error);
}

// Submit event listener
document.getElementById('modalForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  
  const studentId = studentData._id; // Replace with the actual student ID

  const requestBody = {
      name: document.getElementById('editName').value,
      email: document.getElementById('editEmail').value,
      contact: document.getElementById('editContact').value,
      course: document.getElementById('editCourse').value,
      assignedUserId: document.getElementById('editAssignedUser').value, // Change key to assignedUserId
      timing: document.getElementById('editTiming').value,
      date_of_payment: document.getElementById('editDateOfPayment').value,
      state: document.getElementById('editState').value,
      courseStartDate: document.getElementById('editCourseStartDate').value,
      courseEndDate: document.getElementById('editCourseEndDate').value,
      fee: document.getElementById('editFee').value,
      CourseDuration: document.getElementById('editCourseDuration').value
  };

  try {
      const response = await fetch(`http://localhost:9090/user/student/edit/${studentId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify(requestBody)
      });

      if (response.ok) {
          alert('Student details updated successfully.');
          location.reload(); // Reload the page after successful update
      } else {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
      }
  } catch (error) {
      console.error('Error updating student details:', error);
      alert('Failed to update student details. Please try again.');
  }
});
});



function formatDate(inputDate) {
const date = new Date(inputDate);

if (isNaN(date.getTime())) {
  // Invalid date, return an empty string or handle it as needed
  return '';
}

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
return `${year}-${month}-${day}`;
}

