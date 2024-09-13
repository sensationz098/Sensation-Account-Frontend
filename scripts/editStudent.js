
let studentData = JSON.parse(localStorage.getItem('StudentData'));
let tokenData = JSON.parse(localStorage.getItem('Data'))
let token = tokenData.token



document.addEventListener('DOMContentLoaded', async function() {

  function isEmailAvailable(email) {
        return email ? email : "NA@gmail.com";
    }


    function isCourseAvailable(course, courses) {
        return courses.includes(course) ? course : ""; // If course is available, return the course, else return empty string
    }


document.getElementById('editName').value = studentData.name || '';
document.getElementById('editEmail').value = isEmailAvailable(studentData.email) || '';
document.getElementById('editContact').value = studentData.contact || '';
document.getElementById('editReceipt').value = studentData.receipt || '';
document.getElementById('editCourse').value = studentData.course || '';
// document.getElementById('editTiming').value = studentData.timing || '';
document.getElementById('editCourseStartDate').value = formatDate(studentData.courseStartDate) || '';
document.getElementById('editCourseEndDate').value = formatDate(studentData.courseEndDate) || '';
document.getElementById('editDateOfPayment').value = formatDate(studentData.date_of_payment) || '';
document.getElementById('editState').value = studentData.state || '';
document.getElementById('editFee').value = studentData.fee || '';
document.getElementById('editCourseDuration').value = studentData.CourseDuration || '';
document.getElementById('editTeacherName').value = studentData.Teacher || '';


 // Function to set default option at top
 function setDefaultOption(selectElement, value, text) {
        const defaultOption = document.createElement('option');
        defaultOption.value = value;
        defaultOption.textContent = text;
        defaultOption.selected = true;
        selectElement.insertBefore(defaultOption, selectElement.firstChild);
    }

    // Function to add temporary option
    function addTemporaryOption(selectElement, value, text) {
        const temporaryOption = document.createElement('option');
        temporaryOption.value = value;
        temporaryOption.textContent = text;
        selectElement.insertBefore(temporaryOption, selectElement.firstChild);
    }

    // Fetch courses from the API
    try {
        const response = await fetch(`https://final-backend-mark1.onrender.com/courses`, {
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

        let courseAvailable = false;

        // Iterate through courses and add options
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.coursename;
            option.textContent = course.coursename;
            editCourseSelect.appendChild(option); // Add option to select element
            if (studentData.course && course.coursename === studentData.course) {
                courseAvailable = true;
            }
        });

        // Add temporary option if student's course is not available
        if (!courseAvailable && studentData.course) {
            addTemporaryOption(editCourseSelect, studentData.course, studentData.course);
            setDefaultOption(editCourseSelect, studentData.course, studentData.course);
        }

        // If student's course is available, set it as selected
        if (studentData.course && courseAvailable) {
            const selectedOption = editCourseSelect.querySelector(`option[value="${studentData.course}"]`);
            if (selectedOption) {
                selectedOption.selected = true;
            }
        }


          // Populate timing options
          const editTimingSelect = document.getElementById('editTiming'); // Get reference to the select element
        editTimingSelect.innerHTML = ''; // Clear existing options

        let timingAvailable = false;

        // Timing options array
        const timingOptions = [
            "Not Confirmed",
            "5-6 am (Morning)",
            "6-7 am (Morning)",
            "7-8 am (Morning)",
            "8-9 am (Morning)",
            "9-10 am (Morning)",
            "10-11 am (Morning)",
            "11 am - 12 pm (Morning)",
            "12-1 pm (Afternoon)",
            "1-2 pm (Afternoon)",
            "2-3 pm (Afternoon)",
            "3-4 pm (Afternoon)",
            "4-5 pm (Afternoon)",
            "5-6 pm (Evening)",
            "6-7 pm (Evening)",
            "7-8 pm (Evening)",
            "8-9 pm (Evening)"
        ];

        // Iterate through timing options and add options
        timingOptions.forEach(timing => {
            const option = document.createElement('option');
            option.value = timing;
            option.textContent = timing;
            editTimingSelect.appendChild(option); // Add option to select element
            if (studentData.timing && timing === studentData.timing) {
                timingAvailable = true;
            }
        });

        // Add temporary timing option if student's timing is not available
        if (!timingAvailable && studentData.timing) {
            addTemporaryOption(editTimingSelect, studentData.timing, studentData.timing);
            setDefaultOption(editTimingSelect, studentData.timing, studentData.timing);
        }

        // If student's timing is available, set it as selected
        if (studentData.timing && timingAvailable) {
            const selectedOption = editTimingSelect.querySelector(`option[value="${studentData.timing}"]`);
            if (selectedOption) {
                selectedOption.selected = true;
            }
        }


        // Populate state options
        const editStateSelect = document.getElementById('editState'); // Get reference to the select element
        editStateSelect.innerHTML = ''; // Clear existing options

        let stateAvailable = false;

        // State options array
        const stateOptions = [
            "Not Confirmed",
            "Andhra Pradesh",
            "Arunachal Pradesh",
            "Assam",
            "Bihar",
            "Chhattisgarh",
            "Goa",
            "Gujarat",
            "Haryana",
            "Himachal Pradesh",
            "Jharkhand",
            "Karnataka",
            "Kerala",
            "Madhya Pradesh",
            "Maharashtra",
            "Manipur",
            "Meghalaya",
            "Mizoram",
            "Nagaland",
            "Odisha",
            "Punjab",
            "Rajasthan",
            "Sikkim",
            "Tamil Nadu",
            "Telangana",
            "Tripura",
            "Uttar Pradesh",
            "Uttarakhand",
            "West Bengal",
            "Andaman and Nicobar Islands",
            "Chandigarh",
            "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi",
            "Lakshadweep",
            "Ladakh",
            "Puducherry"
        ];

        // Iterate through state options and add options
        stateOptions.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            editStateSelect.appendChild(option); // Add option to select element
            if (studentData.state && state === studentData.state) {
                stateAvailable = true;
            }
        });

        // Add temporary state option if student's state is not available
        if (!stateAvailable && studentData.state) {
            addTemporaryOption(editStateSelect, studentData.state, studentData.state);
            setDefaultOption(editStateSelect, studentData.state, studentData.state);
        }

        // If student's state is available, set it as selected
        if (studentData.state && stateAvailable) {
            const selectedOption = editStateSelect.querySelector(`option[value="${studentData.state}"]`);
            if (selectedOption) {
                selectedOption.selected = true;
            }
        }

    } catch (error) {
        console.error('Error fetching courses:', error);
    }


  
    try {
    const response = await fetch(`https://final-backend-mark1.onrender.com/teachers`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch teachers: ${response.status} ${response.statusText}`);
    }
    const teachers = await response.json();
    console.log(teachers);

    const teacherSelect = document.getElementById('editTeacherName');
    teacherSelect.innerHTML = ''; // Clear existing options

    let teacherAvailable = false;

    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.TeacherName; // Assuming '_id' is the property containing teacher ID
        option.textContent = teacher.TeacherName; // Assuming 'teacherName' is the property containing teacher name
        teacherSelect.appendChild(option);

        if (studentData.Teacher && teacher.TeacherName === studentData.Teacher) {
            teacherAvailable = true;
        }
    });

    // If student's teacher is available, set it as selected
    if (studentData.Teacher && teacherAvailable) {
        const selectedOption = teacherSelect.querySelector(`option[value="${studentData.Teacher}"]`);
        if (selectedOption) {
            selectedOption.selected = true;
        }
    } else {
        // If student's teacher is not available, set NA as default option
        const defaultOption = document.createElement('option');
        defaultOption.value = 'NA';
        defaultOption.textContent = 'NA';
        defaultOption.selected = true;
        teacherSelect.appendChild(defaultOption);
    }

} catch (error) {
    console.error('Error fetching teachers:', error);
    // Handle error condition here, display error message or take appropriate action
}



try {
    const response = await fetch(`https://final-backend-mark1.onrender.com/user/allusers`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch teachers: ${response.status} ${response.statusText}`);
    }
    const all_users = await response.json();
    console.log(all_users);

    const userSelect= document.getElementById('editAssignedUser');
    userSelect.innerHTML = ''; // Clear existing options

    let user_available = false;

    all_users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.username; // Assuming '_id' is the property containing teacher ID
        option.textContent = user.username; // Assuming 'teacherName' is the property containing teacher name
        userSelect.appendChild(option);

        if (studentData.assignedUserId && user.username === studentData.assignedUserId) {
            user_available = true;
        }
    });

    // If student's teacher is available, set it as selected
    if (studentData.assignedUserId && user_available) {
        const selectedOption = userSelect.querySelector(`option[value="${studentData.assignedUserId}"]`);
        if (selectedOption) {
            selectedOption.selected = true;
        }
    } else {
        // If student's teacher is not available, set NA as default option
        const defaultOption = document.createElement('option');
        defaultOption.value = 'NA';
        defaultOption.textContent = 'NA';
        defaultOption.selected = true;
        userSelect.appendChild(defaultOption);
    }

} catch (error) {
    console.error('Error fetching users:', error);
    // Handle error condition here, display error message or take appropriate action
}

// Submit event listener
document.getElementById('modalForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const studentId = studentData._id; // Replace with the actual student ID

  const requestBody = {
      name: document.getElementById('editName').value,
      email: document.getElementById('editEmail').value,
      contact: document.getElementById('editContact').value,
      receipt : document.getElementById('editReceipt').value,
      course: document.getElementById('editCourse').value,
      assignedUserId: document.getElementById('editAssignedUser').value, // Change key to assignedUserId
      timing: document.getElementById('editTiming').value,
      date_of_payment: document.getElementById('editDateOfPayment').value,
      state: document.getElementById('editState').value,
      courseStartDate: document.getElementById('editCourseStartDate').value,
      courseEndDate: document.getElementById('editCourseEndDate').value,
      fee: document.getElementById('editFee').value,
      CourseDuration: document.getElementById('editCourseDuration').value,
      Teacher: document.getElementById('editTeacherName').value
  };

 
  try {
      const response = await fetch(`https://final-backend-mark1.onrender.com/user/student/edit/${studentId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        console.log(requestBody)
          alert('Student details updated successfully.');

        //   location.reload(); // Reload the page after successful update
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

