let profile = JSON.parse(localStorage.getItem('Data'))
const token = profile.token
let latestReceipt = 0 ;


document.addEventListener('DOMContentLoaded', function () {
    // Fetch and display data on page load
    const datepickerInput = document.getElementById('datePickerInput');

   const loginPage = document.getElementById('login-btn').addEventListener('click', ()=>{
    window.location.href = './index.html'
   })

   window.onload = () => {
    fetchLatestReceipt()
   }


   
    if(!profile || !token || isTokenExpired(token)){
        alert('Token has expired! Please log in again. ');
        window.location.href = './index.html';
        return;
    }



    const username = document.getElementById('username')
    username.textContent = `Hey ${profile.username}`


 flatpickr(datepickerInput, {
  mode: 'range',
  dateFormat: 'Y-m-d',
  onClose: handleDateChange
  });

    fetchDataAndDisplay();

    // Handle download button click
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', async () => {
        // Trigger the download request
        console.log('Download button clicked!!!');
        await fetchDataAndDisplay(true);
       
    });
});


function isTokenExpired(token) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Date.now() >= expiry * 1000;
}


async function fetchLatestReceipt() {
    try{
    const resp = await fetch('https://final-backend-mark1.onrender.com/user/students/latest-receipt')
    if(resp.ok){
        const data = await resp.json()
        latestReceipt = data.latestReceipt;
        console.log('latest receipt :', latestReceipt)
    }
    }
    catch(err){
        console.error('Error fetching latest receipt:', error);
    }
}



async function fetchDataAndDisplay(download = false) {
    try {
        const datepickerInput = document.getElementById('datePickerInput');
        const selectedDates = datepickerInput._flatpickr.selectedDates;

        console.log(selectedDates.length);

        let formattedStartDate = null;
        let formattedEndDate = null;
        
        if (selectedDates.length === 2) {
            formattedStartDate = formatDate(selectedDates[0]);
            formattedEndDate = formatDate(selectedDates[1]);
        } else {
            formattedStartDate = null;
            formattedEndDate = null;
        }
        
        console.log(`${formattedStartDate} to ${formattedEndDate}`);

        const url = `https://final-backend-mark1.onrender.com/user/students/testing?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

        const response = await fetch(url, {
            headers: {
                "Content": 'application/json',
                "Authorization": token
            }
        });
        const { students } = await response.json();
        console.log(students);

        students.forEach(student => {
            student.fee = parseFloat(student.fee);
        });

        // Display data in the table
        displayDataInTable(students, download);

        if (download) {
            triggerDownload();
        }

        // console.log('Selected Dates:', formatDateRange);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}




function displayDataInTable(students, download) {
const tableHeaders = document.getElementById('tableHeaders');
const tableBody = document.getElementById('tableBody');

// Clear existing table content
tableHeaders.innerHTML = '';
tableBody.innerHTML = '';

if (students.length > 0) {
// Extract headers from the first student (assuming all students have the same structure)
const headers = Object.keys(students[0]).filter(header => header !== '_id' && header !== '__v' && header !== "previousCourses");

// Create table header cell
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
const th = document.createElement('th');
th.textContent = `Prev Course ${i} Date Range`;
tableHeaders.appendChild(th);
}



students.forEach(student => {
const tr = document.createElement('tr');
headers.forEach(header => {
const td = document.createElement('td');
if (header === 'date_of_payment' || header === 'courseStartDate' || header === 'courseEndDate' || header === 'createdAt') {
// Format date columns
td.textContent = formatDate(student[header]);
} else {
// For other columns, simply display the data or 'NA' if undefined
td.textContent = student[header] !== undefined ? student[header] : 'NA';
}
tr.appendChild(td);
});

// Add data for PreviousCourses
if (student.previousCourses && student.previousCourses.length > 0) {
student.previousCourses.forEach(previousCourse => {
const formattedDateRange = formatDateRange(previousCourse);
const td = document.createElement('td');
td.textContent = formattedDateRange !== undefined ? formattedDateRange : 'NA';
tr.appendChild(td);
});
} else {
// Fill empty cells for PreviousCourses with 'NA'
for (let i = 0; i < maxPreviousCoursesCount; i++) {
const td = document.createElement('td');
td.textContent = 'NA';
tr.appendChild(td);
}
}

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
// If download flag is true, trigger the download
triggerDownload();
}
}


function formatDateRangeForDisplay(selectedDates) {
try {
if (selectedDates.length === 1) {
return `Selected Dates: ${selectedDates[0].toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`;
} else if (selectedDates.length === 2) {
const startDate = selectedDates[0].toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const endDate = selectedDates[1].toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
return `Selected Dates: ${startDate} to ${endDate}`;
}
return 'No date selected';
} catch (error) {
console.error('Error in formatDateRangeForDisplay:', error);
return 'Error in date format';
}
}



function formatDate(date) {
const options = { month: 'long', day: 'numeric', year: 'numeric' };
return new Date(date).toLocaleDateString('en-US', options);
}



function formatDateRange(course) {
    if (!course.start || !course.end) return '';
    const formattedStartDate = new Date(course.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedEndDate = new Date(course.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return `${formattedStartDate} - ${formattedEndDate}`;
}



function formatBackendDate(date){
return date.toISOString();
}



function handleDateChange(selectedDates, dateStr, instance) {
// Log a message to check if the function is triggered
console.log('handleDateChange called');

// Log the selected dates using the correct function
const formattedStartDate = formatDate(selectedDates[0]);
const formattedEndDate = formatDate(selectedDates[1]);
console.log(`Selected Dates: ${formattedStartDate} to ${formattedEndDate}`);

// Trigger fetchDataAndDisplay when the date range changes
fetchDataAndDisplay();
}




function triggerDownload() {
    try {
        // Generate Excel workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById('tabularData'));

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'report.xlsx');

        console.log('Download successful');
    } catch (error) {
        console.error('Error during download:', error);
    }
}



async function displayTokenExpiredModal() {
    const modal = document.getElementById('tokenExpiredModal');
    const modalReason = document.getElementById('tokenExpiredReason');
    const loginAgainBtn = document.getElementById('loginAgainBtn');

    // Display modal
    modal.style.display = 'block';

    // Set modal reason
    modalReason.textContent = 'Token has expired! Please log in again.';

    // Handle "Login Again" button click
    loginAgainBtn.addEventListener('click', function() {
        // Redirect to login page
        window.location.href = './index.html';
    });

    // Close the modal when the close button is clicked
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal when user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}



// redirecting work:

const users = document.getElementById('users').addEventListener('click', () => {
    window.location = './users.html'
})

const Allstudents = document.getElementById('allStudents').addEventListener('click', () => {
    window.location = './students.html'
})

const uploadFIle = document.getElementById('uploadFile').addEventListener('click', () => {
    window.location = './uploadfile.html'
})