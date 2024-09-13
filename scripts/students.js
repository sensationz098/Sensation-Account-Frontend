let userToken = JSON.parse(localStorage.getItem('Data'))
  let token = userToken.token
  let latestReceipt;
  let totalPages ;

document.addEventListener('DOMContentLoaded', function () {


  const dateOfPaymentInput = document.getElementById('date_of_payment');
  const assignedUserInput = document.getElementById('assignedUser2');
  
  const lastDateOfPayment = localStorage.getItem('lastDateOfPayment');
  const lastAssignedUser = localStorage.getItem('lastAssignedUser');

  if (lastDateOfPayment) {
    dateOfPaymentInput.value = lastDateOfPayment;
  }

  if (lastAssignedUser) {
    assignedUserInput.value = lastAssignedUser;
  }



  window.onload = () => {
    fetchLatestReceipt()
    document.getElementById('addStudent').addEventListener('click', fetchLatestReceipt);
   }

document.getElementById('addTeacherForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    const teacherName = document.getElementById('addteacherName').value;

    try {
        const response = await fetch('https://final-backend-mark1.onrender.com/teachers/add', {
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
        } else {
            console.error('Failed to add teacher:', response.statusText);
            alert('Failed to add teacher:', response.statusText)
        }
    } catch (error) {
        console.error('Error adding teacher:', error);
    }
});






fetch('https://final-backend-mark1.onrender.com/teachers', {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': token
  }
})
.then(res => res.json())
.then(data => {
  const selectTeacher = document.getElementById('TeacherName');
  const selectTeacher2 = document.getElementById('teacherSelect'); 
  data.sort((a,b) => a.TeacherName - b.TeacherName)
  data.forEach(teacher => {
    const option = document.createElement('option')
    option.textContent = teacher.TeacherName
    option.value = teacher.TeacherName
    selectTeacher.appendChild(option)

    const option2 = document.createElement('option') 
    option2.textContent = teacher.TeacherName
    option2.value = teacher.TeacherName
    selectTeacher2.appendChild(option2) 
  })
})
.catch(err => console.log(err))



  fetch('https://final-backend-mark1.onrender.com/courses', {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
  }
  })

        .then(response => response.json())
        .then(data => {
            const selectCourse = document.getElementById('selectCourse');
            const selectCourse2 = document.getElementById('courseName')
            data.forEach(course => {
                const option = document.createElement('option');
                option.text = course.coursename; 
                option.value = course.coursename; 
                selectCourse.appendChild(option); 

                const option2 = document.createElement('option');
                option2.text = course.coursename;
                option2.value = course.coursename;
                selectCourse2.appendChild(option2); 
   
            });
        })
        .catch(error => console.error('Error fetching courses:', error));

  document.getElementById('searchStudent').addEventListener('submit', async(e) => {
    e.preventDefault()
  searchStudent()
  })
  
  

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
  const submitButton = document.getElementById('addStudent2');

  submitButton.disabled = true;

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
      TeacherInput.value.trim() === '' 
  ) {
      alert('Please fill in all the required fields.');
      submitButton.disabled = false; 
      return;
  }

  try {
      const addStudentModal = document.getElementById('addStudentModal');
      const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
      modalInstance.show(); 
      await addStudent(); 

      submitButton.disabled = false;
      
  } catch (error) {
      console.error("Error adding student:", error);
      submitButton.disabled = false;
  }
});




document.getElementById('addStudentModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('contact').value = '';
  // document.getElementById('assignedUser2').selectedIndex = 0; // Select the first option in the dropdown
  document.getElementById('selectCourse').selectedIndex = 0; // Select the first option in the dropdown
  document.getElementById('courseStartDate2').value = '';
  document.getElementById('courseEndDate2').value = '';
  // document.getElementById('date_of_payment').value = '';
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


document.getElementById('addStudentCloseBtn').addEventListener('click', function () {
  const addStudentModal = document.getElementById('addStudentModal');
  const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
  modalInstance.hide();
});




const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    } else {
        console.error("resetFiltersBtn not found!");
    }




fetchUsersForCheckboxes();
    fetchUsers();
    fetchStudents();
})


document.getElementById('filtersForm').addEventListener('submit', function (e) {
      e.preventDefault();
      fetchStudents();
    });



document.getElementById('downloadRep').addEventListener('click', async () => {
      console.log('Download button Clicked!');
    
      try {
        const selectedUserIds = Array.from(document.querySelectorAll('.userCheckbox:checked')).map(checkbox => checkbox.value);
        const startDate = document.getElementById('startDate').value || '';
        const endDate = document.getElementById('endDate').value || '';
        const courseStartDate = document.getElementById('courseStartDate').value || '';
        const courseEndDate = document.getElementById('courseEndDate').value || '';
        const courseName = document.getElementById('courseName').value || '';
        const CreationDate = document.getElementById('created_at').value || ''
        const PaymentDate = document.getElementById('PaymentDate').value || '';
        const courseFee = document.getElementById('courseFee').value || '';
        const contact = document.getElementById('contactcheck').value || '';
        const teacher = document.getElementById('teacherSelect').value || '';
        const timing = document.getElementById('timingSelect').value || '';
        const receipt = document.getElementById('Receipt').value || '';
    
        await fetchStudents(startDate, endDate, selectedUserIds, courseStartDate, courseEndDate, CreationDate, PaymentDate, courseName, courseFee, contact, teacher, timing, receipt, true);
      } catch (error) {
        console.error('Error fetching or downloading data:', error);
      }
    });
  


function calculateEndDate() {
  const startDateString = document.getElementById('courseStartDate2').value;
  const durationInMonths = parseInt(document.getElementById('CourseDuration').value);

  const startDate = new Date(startDateString);

  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + durationInMonths, startDate.getDate());

  const formattedEndDate = endDate.toISOString().split('T')[0];

  document.getElementById('courseEndDate2').value = formattedEndDate;
}

document.getElementById('courseStartDate2').addEventListener('change', calculateEndDate);
document.getElementById('CourseDuration').addEventListener('input', calculateEndDate);


async function addStudent() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const countryCodeInput = document.getElementById('countryCode');
  const contactInput = document.getElementById('contact');
  const assignedUserInput = document.getElementById('assignedUser2');
  const selectCourseInput = document.getElementById('selectCourse');
  const timingInput = document.getElementById('timing');
  const courseStartDateInput = document.getElementById('courseStartDate2');
  const courseEndDateInput = document.getElementById('courseEndDate2');
  const dateOfPaymentInput = document.getElementById('date_of_payment');
  const stateInput = document.getElementById('state');
  const feeInput = document.getElementById('fee');
  const courseDurationInput = document.getElementById('CourseDuration');
  const teacherNameInput = document.getElementById('TeacherName');
  const receiptNumInput = document.getElementById('receiptNum');

  const contactValue = `${countryCodeInput.value} ${contactInput.value}`;

  const formValues = {
    name: nameInput.value,
    email: emailInput.value,
    contact: contactValue,
    assignedUserId: assignedUserInput.value,
    course: selectCourseInput.value,
    timing: timingInput.value,
    date_of_payment: dateOfPaymentInput.value,
    state: stateInput.value,
    courseStartDate: courseStartDateInput.value,
    courseEndDate: courseEndDateInput.value,
    fee: feeInput.value,
    CourseDuration: courseDurationInput.value,
    Teacher: teacherNameInput.value,
    receipt: receiptNumInput.value
  };

  localStorage.setItem('lastDateOfPayment', dateOfPaymentInput.value);
  localStorage.setItem('lastAssignedUser', assignedUserInput.value);

  console.log("Form Values:", formValues);

  try {
    const response = await fetch('https://final-backend-mark1.onrender.com/user/student/add', {
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
    alert('Student Added Successfully!!');
    fetchStudents();
    const addStudentModal = document.getElementById('addStudentModal');
    const modalInstance = bootstrap.Modal.getInstance(addStudentModal);
    modalInstance.hide();
    
  } catch (error) {
    console.error('Error adding student:', error);
    alert('Error adding student: ' + error.message);
    window.location.reload();
  }
}




async function applyFilters() {
  const selectedUserIds = Array.from(document.querySelectorAll('.userCheckbox:checked')).map(checkbox => checkbox.value);
  console.log('Selected User IDs:', selectedUserIds);
  const startDate = document.getElementById('startDate').value || '';
  const endDate = document.getElementById('endDate').value || '';
  const courseStartDate = document.getElementById('courseStartDate').value || '';
  const courseEndDate = document.getElementById('courseEndDate').value || '';
  const PaymentDate = document.getElementById('PaymentDate').value || '';
  const courseName = document.getElementById('courseName').value || '';
  const creationDate = document.getElementById('created_at').value || '';
  const courseFee = document.getElementById('courseFee').value || '';
  const contact = document.getElementById('contactcheck').value || '';
  const teacher = document.getElementById('teacherSelect').value || '';
  const timing = document.getElementById("timingSelect").value || '';
  const Receipt = document.getElementById('Receipt').value || '';

  await fetchStudents(startDate, endDate, selectedUserIds, courseStartDate, courseEndDate, creationDate, PaymentDate, courseName, courseFee, contact, teacher, timing, Receipt);
}



async function fetchStudents(startDate = '', endDate = '', selectedUserIds = [], courseStartDate = '', courseEndDate = '', creationDate = '', PaymentDate = '', courseName = '', courseFee = '', contact = '', teacher = '', timing = '', Receipt = '', download = false) {
  let queryParams = `https://final-backend-mark1.onrender.com/user/displaydownload?startDate=${startDate}&endDate=${endDate}&usernames=${selectedUserIds.join(',')}&courseStart=${courseStartDate}&courseEnd=${courseEndDate}&creationDate=${creationDate}&PaymentDate=${PaymentDate}&coursename=${courseName}&fees=${courseFee}&contact=${contact}&teacher=${teacher}&timing=${timing}&receipt=${Receipt}`;
  console.log(queryParams);

  try {
    const response = await fetch(queryParams, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });
    const data = await response.json();
    let studentData = data.students;
    totalPages = data.totalPages;
    console.log(totalPages);

    studentData.forEach(student => {
      student.fee = parseFloat(student.fee);
    });

    displayStudents(studentData, download);
    if (download) {
      triggerDownload(studentData);
    }
    return studentData;
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}



async function triggerDownload(students) {
  try {
    const wb = XLSX.utils.book_new();

    let maxPreviousCourses = 0;
    students.forEach(student => {
      if (student.previousCourses && student.previousCourses.length > maxPreviousCourses) {
        maxPreviousCourses = student.previousCourses.length;
      }
    });

    const data = students.map(student => {
      const row = {
        name: student.name,
        contact: student.contact,
        email: student.email,
        receipt: student.receipt,
        assignedUserId: student.assignedUserId,
        CounselorName: student.CounselorName,
        isLifetime: student.isLifetime,
        course: student.course,
        timing: student.timing,
        date_of_payment: student.date_of_payment,
        courseStartDate: student.courseStartDate,
        courseEndDate: student.courseEndDate,
        fee: student.fee,
        CourseDuration: student.CourseDuration,
        Teacher: student.Teacher,
        state: student.state,
        courseExtended: student.previousCourses.length > 0 ? "Yes" : "No"
      };

      student.previousCourses.forEach((prevCourse, index) => {
        row[`prevCourse${index + 1}Start`] = prevCourse.start || 'NA';
        row[`prevCourse${index + 1}End`] = prevCourse.end || 'NA';
        row[`prevCourse${index + 1}Amount`] = prevCourse.amount || 'NA';
        row[`prevCourse${index + 1}Payment`] = prevCourse.date_of_payment || 'NA';
        row[`prevCourse${index + 1}Receipt`] = prevCourse.NewReceipt || 'NA';
      });

      for (let i = student.previousCourses.length; i < maxPreviousCourses; i++) {
        row[`prevCourse${i + 1}Start`] = 'NA';
        row[`prevCourse${i + 1}End`] = 'NA';
        row[`prevCourse${i + 1}Amount`] = 'NA';
        row[`prevCourse${i + 1}Payment`] = 'NA';
        row[`prevCourse${i + 1}Receipt`] = 'NA';
      }

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelFileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelFileBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.xlsx';
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
      const response = await fetch('https://final-backend-mark1.onrender.com/user/allusers', {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          }
      });

      if (!response.ok) {
          throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      users.sort((a,b) => a.name - b.name)
      console.log(users);

      const dropdown2 = document.getElementById('assignedUser2');
      dropdown2.innerHTML = ''; 

      users.forEach(user => {
          if (user.role === "user") {
              const option = document.createElement('option');
              option.value = user.username;
              option.textContent = user.username; 
              dropdown2.appendChild(option);
          }
      });

  } catch (error) {
      console.error('Error fetching users:', error);
  }
}



async function fetchUsersForCheckboxes() {
    try {
        const response = await fetch('https://final-backend-mark1.onrender.com/user/allusers', {
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
        userCheckboxContainer.innerHTML = ''; 
        
        users.forEach(user => {
            if (user.role === 'user') {
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'formcheck';
                const checkboxInput = document.createElement('input');
                checkboxInput.type = 'checkbox';
                checkboxInput.className = 'form-check-input userCheckbox';
                checkboxInput.value = user.username;
                checkboxInput.id = `userCheckbox_${user._id}`;
                checkboxDiv.appendChild(checkboxInput);
                const checkboxLabel = document.createElement('label');
                checkboxLabel.className = 'form-check-label';
                checkboxLabel.setAttribute('for', `userCheckbox_${user.username}`);
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
  event.stopPropagation(); 
}



function formatDateRange(previousCourse) {
    const startDate = formatDate2(previousCourse.start);
    const endDate = formatDate2(previousCourse.end);

    if (!startDate || !endDate) {
        return 'Invalid Date Range';
    }

    return `${startDate} - ${endDate}`;
}


async function fetchLatestReceipt() {
      try {
        const response = await fetch('https://final-backend-mark1.onrender.com/user/students/latest-receipt');
        if (response.ok) {
          const data = await response.json();
          latestReceipt = Number(data.latestReceipt) + 1;
          console.log('Latest Receipt:', latestReceipt);
          document.getElementById('NewReceipt').value = latestReceipt;
          document.getElementById('receiptNum').value = latestReceipt; 
        } else {
          console.error('Failed to fetch latest receipt:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching latest receipt:', error);
      }
    }



async function handleExtendCourseButtonClick(studentId) {
      try {
        fetchLatestReceipt()
        console.log(studentId)
        clearExtendModel();
        const response = await fetch(`https://final-backend-mark1.onrender.com/user/student/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const studentData = await response.json();
    
        const extendCourseModal = new bootstrap.Modal(document.getElementById('extendCourseModal'));
        extendCourseModal.show();
    
        const student_email = document.getElementById('student_email').value = studentData.email
        const stateSelect = document.getElementById('student_state');
        stateSelect.innerHTML = ''; 
    
        const studentStateOption = document.createElement('option');
        studentStateOption.value = studentData.state;
        studentStateOption.textContent = studentData.state;
        studentStateOption.selected = true;
        stateSelect.appendChild(studentStateOption);
    
        const otherStates = [
          'Andaman and Nicobar Islands',
          'Andhra Pradesh',
          'Arunachal Pradesh',
          'Assam',
          'Bihar',
          'Chandigarh',
          'Chhattisgarh',
          'Dadra and Nagar Haveli and Daman and Diu',
          'Delhi',
          'Goa',
          'Gujarat',
          'Haryana',
          'Himachal Pradesh',
          'Jammu and Kashmir',
          'Jharkhand',
          'Karnataka',
          'Kerala',
          'Ladakh',
          'Lakshadweep',
          'Madhya Pradesh',
          'Maharashtra',
          'Manipur',
          'Meghalaya',
          'Mizoram',
          'Nagaland',
          'Odisha',
          'Puducherry',
          'Punjab',
          'Rajasthan',
          'Sikkim',
          'Tamil Nadu',
          'Telangana',
          'Tripura',
          'Uttar Pradesh',
          'Uttarakhand',
          'West Bengal'
        ];
        
        otherStates.forEach(state => {
          if (state !== studentData.state) {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
          }
        });
    
        return new Promise((resolve, reject) => {
          const extendCourseBtn = document.getElementById('extendCourseBtn');
          extendCourseBtn.onclick = async () => {
            const additionalMonths = Number(document.getElementById('additionalMonths').value);
            const amount = document.getElementById('amount').value;
            const date_of_payment = document.getElementById('dateOfPayment').value;
            const ExtReceipt = document.getElementById('NewReceipt').value;
            const student_email = document.getElementById('student_email').value;
            const student_state = document.getElementById('student_state').value;

            try {
              const updatedStudent = await extendCourse(studentId, additionalMonths, amount, date_of_payment, ExtReceipt, student_email, student_state);
              resolve(updatedStudent); 
              alert('Student Course Has been Extended');
              fetchStudents();
            } catch (error) {
              reject(error); 
            }
          };
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
        throw error; 
      }
    }
  

async function extendCourse(studentId, additionalMonths, amount, date_of_payment, NewReceipt, email, state ) {
  try {
      
      const response = await fetch(`https://final-backend-mark1.onrender.com/user/student/extend-course/${studentId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': token
          },
          body: JSON.stringify({
              additionalMonths,
              amount,
              date_of_payment,
              NewReceipt,
              email,
              state
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
    const headers = Object.keys(students[0]).filter(header => header !== '_id' && header !== 'previousCourses' && header !== '__v' && header !== 'userId');

    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      tableHeaders.appendChild(th);
    });

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
      thPayment.textContent = `Extended Course ${i} Amt.`;
      tableHeaders.appendChild(thPayment);

      const thDateOfPayment = document.createElement('th');
      thDateOfPayment.textContent = `Extended Course ${i} Date Of Payment`;
      tableHeaders.appendChild(thDateOfPayment);

      const thNewReceipt = document.createElement('th');
      thNewReceipt.textContent = `Extended Receipt ${i}`;
      tableHeaders.appendChild(thNewReceipt);
    }

    students.forEach(student => {
      const tr = document.createElement('tr');

      headers.forEach(header => {
          const td = document.createElement('td');
          if (header === 'date_of_payment' || header === 'courseStartDate' || header === 'courseEndDate' || header === 'createdAt') {
              td.textContent = formatDate2(student[header]);
          } else {
              td.textContent = student[header] !== undefined ? student[header] : 'NA';
          }
          tr.appendChild(td);


          if(header === 'contact'){
    if (header === 'contact') {
      td.innerHTML = ''; // Clear the existing content
      const contactLink = document.createElement('a');
      contactLink.textContent = student.contact;
      contactLink.href = '#';
      contactLink.addEventListener('click', () => handleEditStudent(student, student.assignedUserName));
      td.appendChild(contactLink);
    }
          }
      });
  
      const nameTd = tr.querySelector('td'); 
      nameTd.innerHTML = ''; 
      const nameLink = document.createElement('a');
      nameLink.textContent = student.name; 
      nameLink.href = '#'; 
      nameLink.addEventListener('click', () => handleExtendCourseButtonClick(student._id)); 
      nameTd.appendChild(nameLink);
  

    
      tableBody.appendChild(tr);
      

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

          const tdReceipt = document.createElement('td');
          tdReceipt.textContent = previousCourse.NewReceipt !== undefined ? previousCourse.NewReceipt : 'NA';
          tr.appendChild(tdReceipt)

        });
      } else {
        for (let i = 0; i < maxPreviousCoursesCount; i++) {
          const td = document.createElement('td');
          td.textContent = 'NA';
          tr.appendChild(td);
        }
      }

      const editStudentBtn = document.createElement('button');
      editStudentBtn.textContent = 'Edit';
      editStudentBtn.className = 'btn btn-outline-primary';
      editStudentBtn.setAttribute('data-bs-toggle', 'modal');
      editStudentBtn.setAttribute('data-bs-target', '#editStudentModal');
      editStudentBtn.addEventListener('click', () => handleEditStudent(student, student.assignedUserName)); 
      const editStudentTd = document.createElement('td');
      editStudentTd.append(editStudentBtn);
      tr.appendChild(editStudentTd);

      const extendCourseButton = document.createElement('button');
      extendCourseButton.textContent = 'Extend Course';
      extendCourseButton.className = 'btn btn-outline-success';
      extendCourseButton.setAttribute('data-toggle', 'modal');
      extendCourseButton.setAttribute('data-target', '#extendCourseModal');
      extendCourseButton.addEventListener('click', () => handleExtendCourseButtonClick(student._id));
      const extendCourseTd = document.createElement('td');
      extendCourseTd.appendChild(extendCourseButton);
      tr.appendChild(extendCourseTd);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'btn btn-outline-danger';
      deleteButton.addEventListener('click', () => handleDeleteButtonClick(student._id)); 
      const deleteTd = document.createElement('td');
      deleteTd.appendChild(deleteButton);
      tr.appendChild(deleteTd);

      tableBody.appendChild(tr);
    });
  } else {
   
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'No data available';
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }

  if (download) {
    console.log('Download initiated');
    return; 
  }

}




function handleAddCourseFormSubmit(event) {
  event.preventDefault(); 

  const courseName2 = document.getElementById('courseName2').value;

  fetch('https://final-backend-mark1.onrender.com/courses/add', {
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
      console.log(data); 
      
      alert(data.msg); 
      
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
      console.error('There was an error!', error);
      alert('There was an error while adding the course. Please try again later.');
  });
}

document.getElementById('addCourseForm').addEventListener('submit', handleAddCourseFormSubmit);





function formatDate(inputDate) {
    const date = new Date(inputDate);
    
    if (isNaN(date.getTime())) {
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
  document.getElementById('NewReceipt').value = '';
}


async function handleEditStudent(student) {
  try {

    localStorage.setItem('StudentData', JSON.stringify(student))
 
    window.location = './editStudent.html'
  } catch (error) {
    alert(error)
    console.error(error);
    alert('An error occurred while loading student data. Please try again later.');
  }
}


function handleDeleteButtonClick(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`https://final-backend-mark1.onrender.com/user/student/delete/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        .then(response => {
            if (response.ok) {
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
  const selectedUserCheckboxes = document.querySelectorAll('.userCheckbox:checked');
  selectedUserCheckboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  document.getElementById('selectedUserIds')
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('courseStartDate').value = '';
  document.getElementById('courseEndDate').value = '';
  document.getElementById('courseName').selectedIndex = 0; 
  document.getElementById('PaymentDate').value = '';
  document.getElementById('created_at').value = '';
  document.getElementById('courseFee').value = '';
  document.getElementById('contactcheck').value = '';
  document.getElementById('teacherSelect').selectedIndex = 0;
  document.getElementById('timingSelect').selectedIndex = 0;
  document.getElementById('Receipt').value = '';

  fetchStudents()
}


