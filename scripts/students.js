let userToken = JSON.parse(localStorage.getItem('Data'))
   let token = userToken.token

document.addEventListener('DOMContentLoaded', function () {



document.getElementById('addTeacherForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    const teacherName = document.getElementById('addteacherName').value;

    try {
        const response = await fetch('https://sensationzmediaarts.onrender.com/teachers/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ TeacherName: teacherName })
        });

        if (response.ok) {
            const data = await response.json();
            alert('New teacher added:', data);
            // Optionally, you can close the modal or display a success message here
        } else {
            console.error('Failed to add teacher:', response.statusText);
            alert('Failed to add teacher:', response.statusText)
            // Handle error condition here, display error message or take appropriate action
        }
    } catch (error) {
        console.error('Error adding teacher:', error);
        // Handle error condition here, display error message or take appropriate action
    }
});





  fetch('https://sensationzmediaarts.onrender.com/teachers', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
  .then(res => res.json())
  .then(data => {
    const selectTeacher = document.getElementById('TeacherName');
    data.forEach(teacher => {
      const option = document.createElement('option')
      option.textContent = teacher.TeacherName
      option.value = teacher.TeacherName
      selectTeacher.appendChild(option)
    })
  })
   .catch(err => console.log(err))



  fetch('https://sensationzmediaarts.onrender.com/courses', {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
  }
  })

        .then(response => response.json())
        .then(data => {
            const selectCourse = document.getElementById('selectCourse');
            const selectCourse2 = document.getElementById('courseName')
            // Iterate through each course and create an option element
            data.forEach(course => {
                const option = document.createElement('option');
                option.text = course.coursename; // Assuming 'name' field contains course name
                option.value = course.coursename; // Assuming '_id' field contains course ID
                selectCourse.appendChild(option); // Append the option to select dropdown

                const option2 = document.createElement('option');
                option2.text = course.coursename;
                option2.value = course.coursename;
                selectCourse2.appendChild(option2); // Append the option to second select dropdown
   
            });
        })
        .catch(error => console.error('Error fetching courses:', error));

  document.getElementById('searchStudent').addEventListener('submit', async(e) => {
    e.preventDefault()
  searchStudent()
  })
  

  // Add event listener to the "Add Course" form submit event
document.getElementById('addCourseForm').addEventListener('submit', handleAddCourseFormSubmit);



  document.getElementById('addStudentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const contactInput = document.getElementById('contact');
    const courseStartDateInput = document.getElementById('courseStartDate2');
    const courseEndDateInput = document.getElementById('courseEndDate2');
    const dateOfPaymentInput = document.getElementById('date_of_payment');
    const stateInput = document.getElementById('state');
    const feeInput = document.getElementById('fee');
    const courseDurationInput = document.getElementById('CourseDuration');
    const TeacherInput = document.getElementById('TeacherName');

    if (
        nameInput.value.trim() === '' ||
        emailInput.value.trim() === '' ||
        contactInput.value.trim() === '' ||
        courseStartDateInput.value.trim() === '' ||
        courseEndDateInput.value.trim() === '' ||
        dateOfPaymentInput.value.trim() === '' ||
        stateInput.value.trim() === '' ||
        feeInput.value.trim() === '' ||
        courseDurationInput.value.trim() === '' ||
        TeacherInput.value.trim() === '' ||
        contactInput.value.trim().length < 10
    ) {
        alert('Please fill in all the required fields and ensure the contact number is 10 digits.');
        return; 
    }

    await addStudent();

    const addStudentModal = document.getElementById('addStudentModal');
    const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
    modalInstance.hide()
});


// Add student modal ke close button ke liye event listener
document.getElementById('addStudentCloseBtn').addEventListener('click', function () {
  const addStudentModal = document.getElementById('addStudentModal');
  const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
  modalInstance.hide();
});

// Add student modal hide event par background ko unlock karne ke liye event listener
document.getElementById('addStudentModal').addEventListener('hidden.bs.modal', function () {

  document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('assignedUser2').selectedIndex = 0; // Select the first option in the dropdown
    document.getElementById('selectCourse').selectedIndex = 0; // Select the first option in the dropdown
    document.getElementById('courseStartDate2').value = '';
    document.getElementById('courseEndDate2').value = '';
    document.getElementById('date_of_payment').value = '';
    document.getElementById('state').value = '';
    document.getElementById('fee').value = '';
    document.getElementById('CourseDuration').value = '';
    document.getElementById('TeacherName').value = '';


  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
      modalBackdrop.remove(); // Modal backdrop element ko remove karein
  }
  document.body.style.overflow = 'auto'; // Scroll lock ko unset karein
});

const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    if (resetFiltersBtn) {
        // If it exists, add event listener
        resetFiltersBtn.addEventListener('click', resetFilters);
        // fetchStudents();
    } else {
        console.error("resetFiltersBtn not found!");
    }




// Fetch users for checkboxes when the page loads
fetchUsersForCheckboxes();
    // Fetch users for dropdown
    fetchUsers();
    // Fetch and display initial student data
    fetchStudents();
})


    // Attach event listeners to form and button
document.getElementById('filtersForm').addEventListener('submit', function (e) {
      e.preventDefault();
      fetchStudents();
    });



document.getElementById('downloadRep').addEventListener('click', async () => {
      console.log('Download button Clicked!');
    
      try {
          // Fetch student data
          const selectedUserIds = Array.from(document.querySelectorAll('.userCheckbox:checked')).map(checkbox => checkbox.value);
          const startDate = document.getElementById('startDate').value || '';
          const endDate = document.getElementById('endDate').value || '';
          const courseStartDate = document.getElementById('courseStartDate').value || '';
          const courseEndDate = document.getElementById('courseEndDate').value || '';
          const courseName = document.getElementById('courseName').value || '';
          // const creationDate = document.getElementById('creationDate').value || '';
          const courseFee = document.getElementById('courseFee').value || '';
    
          const studentData = await fetchStudents(selectedUserIds, startDate, endDate, courseStartDate, courseEndDate, courseName, courseFee);
    
          // Trigger download with fetched data
          triggerDownload(studentData);
      } catch (error) {
          console.error('Error fetching or downloading data:', error);
      }
  });
  


  function calculateEndDate() {
  // Get the course start date and duration from the form
  const startDateString = document.getElementById('courseStartDate2').value;
  const durationInMonths = parseInt(document.getElementById('CourseDuration').value);

  // Convert start date string to Date object
  const startDate = new Date(startDateString);

  // Calculate course end date based on start date and duration
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + durationInMonths, startDate.getDate());

  // Format the end date as YYYY-MM-DD
  const formattedEndDate = endDate.toISOString().split('T')[0];

  // Set the calculated end date in the form
  document.getElementById('courseEndDate2').value = formattedEndDate;
}

// Add event listener to trigger calculation when either course start date or duration changes
document.getElementById('courseStartDate2').addEventListener('change', calculateEndDate);
document.getElementById('CourseDuration').addEventListener('input', calculateEndDate);


async function addStudent() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const countryCodeInput = document.getElementById('countryCode'); // New line to get country code
    const contactInput = document.getElementById('contact');
    const assignedUserInput = document.getElementById('assignedUser2');
    const selectCourseInput = document.getElementById('selectCourse');
    const timingInput = document.getElementById('timing');
    const courseStartDateInput = document.getElementById('courseStartDate2');
    const courseEndDateInput = document.getElementById('courseEndDate2');
    const dateOfPaymentInput = document.getElementById('date_of_payment');
    const state = document.getElementById('state')
    const feeInput = document.getElementById('fee');
    const courseDurationInput = document.getElementById('CourseDuration');
    const isLifetimeInput = document.getElementById('isLifetime');
    const TeacherName = document.getElementById('TeacherName');

    const contactValue = `${countryCodeInput.value}  ${contactInput.value}`;

    const formValues = {
        name: nameInput.value,
        email: emailInput.value,
        contact: contactValue, // Use the concatenated value
        assignedUserId: assignedUserInput.value,
        course: selectCourseInput.value,
        // batch: batchInput.value,
        timing: timingInput.value,
        date_of_payment: dateOfPaymentInput.value,
        state: state.value,
        courseStartDate: courseStartDateInput.value,
        courseEndDate: courseEndDateInput.value,
        fee: feeInput.value,
        CourseDuration: courseDurationInput.value,
        isLifetime: isLifetimeInput.value,
        Teacher: TeacherName.value
    };

    console.log("Selected lifetime value:", isLifetimeInput.value);
    console.log("Form Values:", formValues);

    try {
        // Use fetch or your preferred AJAX library to submit form data to the /student/add endpoint
        const response = await fetch('https://sensationzmediaarts.onrender.com/user/student/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(formValues),
        });

        if (!response.ok) {
            throw new Error('Failed to add student. Please try again later.');
        }

        const data = await response.json();
        console.log(data);
        const addStudentModal = document.getElementById('addStudentModal');
        const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
        alert('Student Added Successfully!!')
        fetchStudents()
        modalInstance.hide(); // Hide the modal upon successful addition
        // window.location.reload()
    } catch (error) {
        console.error('Error adding student:', error);
        alert('Error adding student: ' + error.message);
        window.location.reload();
    }
}



function searchStudent() {
  const name = document.getElementById('StudentNameValue').value || '';
console.log(name)
  fetchStudents(name)
}

async function applyFilters() {
  const selectedUserIds = Array.from(document.querySelectorAll('.userCheckbox:checked')).map(checkbox => checkbox.value);
  console.log('Selected User IDs:', selectedUserIds);
  const startDate = document.getElementById('startDate').value || '';
  const endDate = document.getElementById('endDate').value || '';
  const courseStartDate = document.getElementById('courseStartDate').value || '';
  const courseEndDate = document.getElementById('courseEndDate').value || '';
  const courseName = document.getElementById('courseName').value || '';
  // const creationDate = document.getElementById('creationDate').value || '';
  const courseFee = document.getElementById('courseFee').value || '';
  const contact = document.getElementById('contactcheck').value || '';

  // Call fetchStudents function with filter values
  await fetchStudents(selectedUserIds, startDate, endDate, courseStartDate, courseEndDate, courseName, courseFee, contact);
}


async function fetchStudents(selectedUserIds=[], startDate = '', endDate = '', courseStartDate = '', courseEndDate = '', courseName = '',  courseFee = '', contact='', download = false, name='') {

    let queryParams = `https://sensationzmediaarts.onrender.com/user/displaydownload?startDate=${startDate}&endDate=${endDate}&uesrnames=${null}&courseStart=${courseStartDate}&courseEnd=${courseEndDate}&fees=${courseFee}&coursename=${courseName}&usernames=${selectedUserIds}&contact=${contact}&name=${name}`;
    console.log(queryParams);
    try {
        const response = await fetch(queryParams,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const data = await response.json();
        // console.log(data.students);
        let studentData = data.students;
        const assignedUserIds = studentData.map(student => student.assignedUserId);
        const userNameResponse = await fetch(`https://sensationzmediaarts.onrender.com/user/allusers?id=${assignedUserIds.join(',')}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const userName = await userNameResponse.json();
  
        console.log(studentData)
       
        
        studentData.forEach(student => {
            // console.log(student);
            const user = userName.find(u => u._id === student.assignedUserId);
            if (user) {
                student.assignedUserId = user.username || 'NA';
                // console.log(student.userName);
            }
        });

        displayStudents(studentData, download);
        if (download) {
            triggerDownload(studentData);
        }
        return studentData;
    } catch (error) {
        console.error('Error fetching students:', error);
        return []
    }
}



async function triggerDownload(data) {
  try {
      // Generate Excel workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Save the workbook as an Excel file
      const excelFileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Convert the array buffer to a Blob
      const blob = new Blob([excelFileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Download successful');
  } catch (error) {
      console.error('Error during download:', error);
  }
}



async function fetchUsers() {
  try {
      const response = await fetch('https://sensationzmediaarts.onrender.com/user/allusers', {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      console.log(users);

      const dropdown2 = document.getElementById('assignedUser2');
      dropdown2.innerHTML = ''; // Clear existing options

      users.forEach(user => {
          if (user.role === "user") {
              const option = document.createElement('option');
              option.value = user._id;
              option.textContent = user.username; // Modify this according to your user schema
              dropdown2.appendChild(option);
          }
      });

  } catch (error) {
      console.error('Error fetching users:', error);
  }
}



// Function to fetch users for checkboxes
async function fetchUsersForCheckboxes() {
    try {
        const response = await fetch('https://sensationzmediaarts.onrender.com/user/allusers', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users for checkboxes');
        }

        const users = await response.json();

        const userCheckboxContainer = document.getElementById('userDropdownMenu');
        userCheckboxContainer.innerHTML = ''; // Clear existing checkboxes

        users.forEach(user => {
            if (user.role === 'user') {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'formcheck';
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.className = 'form-check-input userCheckbox';
                checkboxInput.value = user._id;
                checkboxInput.id = `userCheckbox_${user._id}`;
                checkboxDiv.appendChild(checkboxInput);
                const checkboxLabel = document.createElement('label');
                checkboxLabel.className = 'form-check-label';
                checkboxLabel.setAttribute('for', `userCheckbox_${user._id}`);
                checkboxLabel.textContent = user.username;
                checkboxDiv.appendChild(checkboxLabel);
                userCheckboxContainer.appendChild(checkboxDiv);
            }
        });

    } catch (error) {
        console.error('Error fetching users for checkboxes:', error);
    }
}



function handleCheckboxClick(event) {
  event.stopPropagation(); // Prevent dropdown from closing when clicking on checkbox
}



function formatDateRange(previousCourse) {
    const startDate = formatDate2(previousCourse.start);
    const endDate = formatDate2(previousCourse.end);

    if (!startDate || !endDate) {
        // Handle invalid dates as needed
        return 'Invalid Date Range';
    }

    return `${startDate} - ${endDate}`;
}



async function handleExtendCourseButtonClick(studentId) {
  try {
    console.log(studentId)
    clearExtendModel()
      // Fetch student data to display in the modal if needed
      const response = await fetch(`https://sensationzmediaarts.onrender.com/user/student/${studentId}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const studentData = await response.json();
      console.log(studentData);
      // Populate modal with student data if needed

      // Open the extend course modal
      const extendCourseModal = new bootstrap.Modal(document.getElementById('extendCourseModal'));
      extendCourseModal.show();

      return new Promise((resolve, reject) => {
          // Add event listener to the "Extend Course" button inside the modal
          const extendCourseBtn = document.getElementById('extendCourseBtn');
          extendCourseBtn.onclick = async () => {
              // Get input values from the modal
              const additionalMonths = Number(document.getElementById('additionalMonths').value);
              const amount = document.getElementById('amount').value;
              const date_of_payment = document.getElementById('dateOfPayment').value;

              try {
                  // Send PUT request to extend the course
                  const updatedStudent = await extendCourse(studentId, additionalMonths, amount, date_of_payment);
                  resolve(updatedStudent); // Resolve the promise with updated student data
                  alert('Student Course Has been Extended');
                  fetchStudents();
              } catch (error) {
                  reject(error); // Reject the promise if there is an error
              }
          };
      });
  } catch (error) {
      console.error('Error fetching student data:', error);
      throw error; // Throw error for further handling
  }
}



async function extendCourse(studentId, additionalMonths, amount, date_of_payment) {
  try {
      // Send PUT request to extend the course
      const response = await fetch(`https://sensationzmediaarts.onrender.com/user/student/extend-course/${studentId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify({
              additionalMonths,
              amount,
              date_of_payment
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to extend course');
      }

      const data = await response.json();
      console.log(data);
      const extendCourseModal = document.getElementById('extendCourseModal');
      const modalInstance = bootstrap.Modal.getInstance(extendCourseModal);
      modalInstance.hide();

      // Optionally, refresh the student data or perform any other action
  } catch (error) {
      console.error('Error extending course:', error);
  }
}



function displayStudents(students, download) {
  console.log(students);
  const tableHeaders = document.getElementById('tableHeaders');
  const tableBody = document.getElementById('tableBody');
  tableHeaders.innerHTML = '';
  tableBody.innerHTML = '';

  if (students.length > 0) {
    // Extract headers from the first student (assuming all students have the same structure)
    const headers = Object.keys(students[0]).filter(header => header !== '_id' && header !== 'email' && header !== 'previousCourses' && header !== '__v' && header !== 'userId');

    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHeaders.appendChild(th);
    });

    // Add dynamic columns for PreviousCourses
    let maxPreviousCoursesCount = 0;
    students.forEach(student => {
      if (student.previousCourses && student.previousCourses.length > maxPreviousCoursesCount) {
        maxPreviousCoursesCount = student.previousCourses.length;
      }
    });

    for (let i = 1; i <= maxPreviousCoursesCount; i++) {
      const thDateRange = document.createElement('th');
      thDateRange.textContent = `Prev. Course ${i} Date Range`;
      tableHeaders.appendChild(thDateRange);

      const thCreatedAt = document.createElement('th');
      thCreatedAt.textContent = `Prev. Course ${i} Extend At`;
      tableHeaders.appendChild(thCreatedAt);

      const thPayment = document.createElement('th');
      thPayment.textContent = `Prev. Course ${i} Payment`;
      tableHeaders.appendChild(thPayment);

      const thDateOfPayment = document.createElement('th');
      thDateOfPayment.textContent = `Prev. Course ${i} Date Of Payment`;
      tableHeaders.appendChild(thDateOfPayment);
    }

    students.forEach(student => {
      const tr = document.createElement('tr');

      headers.forEach(header => {
          const td = document.createElement('td');
          if (header === 'date_of_payment' || header === 'courseStartDate' || header === 'courseEndDate' || header === 'createdAt') {
              // Format date columns
              td.textContent = formatDate2(student[header]);
          } else {
              // For other columns, simply display the data or 'NA' if undefined
              td.textContent = student[header] !== undefined ? student[header] : 'NA';
          }
          tr.appendChild(td);
      });
  
      // Replace the content of the "name" column with a hyperlinked version
      const nameTd = tr.querySelector('td'); // Get the first td element (assuming it corresponds to the "name" column)
      nameTd.innerHTML = ''; // Clear the existing content
      const nameLink = document.createElement('a');
      nameLink.textContent = student.name; // Assuming 'name' is the property containing the student's name
      nameLink.href = '#'; // Set href to "#" to prevent page reload
      nameLink.addEventListener('click', () => handleExtendCourseButtonClick(student._id)); // Attach event listener to handle modal opening
      nameTd.appendChild(nameLink);
  
      // Add Edit button, Extend Course button, and Delete button as before
  
      tableBody.appendChild(tr);
      

       // Add data for PreviousCourses
       if (student.previousCourses && student.previousCourses.length > 0) {
        student.previousCourses.forEach(previousCourse => {
          const formattedDateRange = formatDateRange(previousCourse);
          const td = document.createElement('td');
          td.textContent = formattedDateRange !== undefined ? formattedDateRange : 'NA';
          tr.appendChild(td);

          const formattedCreatedAt = formatDate2(previousCourse.createdAt);
          const tdCreatedAt = document.createElement('td');
          tdCreatedAt.textContent = formattedCreatedAt !== undefined ? formattedCreatedAt : 'NA';
          tr.appendChild(tdCreatedAt);

          const tdPayment = document.createElement('td'); 
          tdPayment.textContent = previousCourse.amount !== undefined ? previousCourse.amount : 'NA';
          tr.appendChild(tdPayment);

          const formatDOP = formatDate2(previousCourse.date_of_payment)
          const tdDateOfPayment = document.createElement('td');
          tdDateOfPayment.textContent = formatDOP !== undefined ? formatDOP : 'NA';
          tr.appendChild(tdDateOfPayment)

        });
      } else {
        // Fill empty cells for PreviousCourses with 'NA'
        for (let i = 0; i < maxPreviousCoursesCount; i++) {
          const td = document.createElement('td');
          td.textContent = 'NA';
          tr.appendChild(td);
        }
      }

      // Add Edit button
      const editStudentBtn = document.createElement('button');
      editStudentBtn.textContent = 'Edit';
      editStudentBtn.className = 'btn btn-outline-primary';
      editStudentBtn.setAttribute('data-bs-toggle', 'modal');
      editStudentBtn.setAttribute('data-bs-target', '#editStudentModal');
      editStudentBtn.addEventListener('click', () => handleEditStudent(student, student.assignedUserName)); // Pass assignedUserName to handleEditStudent
      const editStudentTd = document.createElement('td');
      editStudentTd.append(editStudentBtn);
      tr.appendChild(editStudentTd);

      const extendCourseButton = document.createElement('button');
      extendCourseButton.textContent = 'Extend Course';
      extendCourseButton.className = 'btn btn-outline-success';
      extendCourseButton.setAttribute('data-toggle', 'modal');
      extendCourseButton.setAttribute('data-target', '#extendCourseModal'); // Assign the modal ID here
      extendCourseButton.addEventListener('click', () => handleExtendCourseButtonClick(student._id));
      const extendCourseTd = document.createElement('td');
      extendCourseTd.appendChild(extendCourseButton);
      tr.appendChild(extendCourseTd);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'btn btn-outline-danger';
      deleteButton.addEventListener('click', () => handleDeleteButtonClick(student._id)); // Call handleDeleteButtonClick directly
      const deleteTd = document.createElement('td');
      deleteTd.appendChild(deleteButton);
      tr.appendChild(deleteTd);

      tableBody.appendChild(tr);
    });
  } else {
    // Display a message when no data is available
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'No data available';
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }

  if (download) {
    console.log('Download initiated');
    return; // Return here to prevent further execution of the function if download is true
  }

  // If download is not initiated, proceed with the rest of the function
}




// Function to handle form submission for adding a course
function handleAddCourseFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  // Get the course name from the form
  const courseName2 = document.getElementById('courseName2').value;

  // Send an HTTP POST request to the server
  fetch('https://sensationzmediaarts.onrender.com/courses/add', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': token
      },
      body: JSON.stringify({ coursename: courseName2 })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Handle successful response
      console.log(data); // You can do something with the response data if needed
      
      // Optionally, you can display a success message to the user
      alert(data.msg); // Display the success message
      
      // Close the modal after showing the alert
      var addCourseModal = document.getElementById('addCourseModal');
      addCourseModal.classList.remove('show');
      addCourseModal.setAttribute('aria-hidden', 'true');
      addCourseModal.style.display = 'none';
      document.body.classList.remove('modal-open');
      var modalBackdrops = document.getElementsByClassName('modal-backdrop');
      for(var i = 0; i < modalBackdrops.length; i++) {
          modalBackdrops[i].parentNode.removeChild(modalBackdrops[i]);
      }
  })
  .catch(error => {
      // Handle errors
      console.error('There was an error!', error);
      // Optionally, you can display an error message to the user
      alert('There was an error while adding the course. Please try again later.');
  });
}

// Add event listener to the "Add Course" form submit event
document.getElementById('addCourseForm').addEventListener('submit', handleAddCourseFormSubmit);





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

function formatDate2(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function openAddStudentModal() {
  var myModal = new bootstrap.Modal(document.getElementById('addStudentModal'));
  myModal.show();
}


function clearExtendModel (){
  document.getElementById('additionalMonths').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('dateOfPayment').value = '';
}


async function handleEditStudent(student) {
  try {

    localStorage.setItem('StudentData', JSON.stringify(student))
 
    window.location = './editStudent.html'
  } catch (error) {
    alert(error)
    console.error(error);
    // Handle error
    alert('An error occurred while loading student data. Please try again later.');
  }
}



function handleDeleteButtonClick(studentId) {
    // Confirm with the user before deleting the student
    if (confirm('Are you sure you want to delete this student?')) {
        // Send DELETE request to the server
        fetch(`https://sensationzmediaarts.onrender.com/user/student/delete/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(response => {
            if (response.ok) {
                // If deletion is successful, reload the student data
                fetchStudents();
                alert('Student deleted successfully.');
            } else {
                throw new Error('Failed to delete student.');
            }
        })
        .catch(error => {
            console.error('Error deleting student:', error);
            alert('Error deleting student: ' + error.message);
        });
    }
}

function resetFilters() {
  // Reset each input field to its default value or empty string
  const selectedUserCheckboxes = document.querySelectorAll('.userCheckbox:checked');
  selectedUserCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  document.getElementById('selectedUserIds')
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('courseStartDate').value = '';
  document.getElementById('courseEndDate').value = '';
  document.getElementById('courseName').selectedIndex = 0; // Select the first option (empty option)
  // document.getElementById('creationDate').value = '';
  document.getElementById('courseFee').value = '';
  document.getElementById('contactcheck').value = '';


  fetchStudents()
}


