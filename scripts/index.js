const dayField = document.getElementById("day-field");
const yearField = document.getElementById("year-field");
const graduationField = document.getElementById("graduation-field");
const phoneField = document.getElementById("phone-field");

const wrongDateBirth = document.getElementById("wrong-birth-input");
const wrongGraduationInput = document.getElementById("wrong-graduation-input");

let validateTtrigger = true;

function filterDate(e) {
  let theEvent = e || window.event;
  let key;

  if (theEvent.type === "paste") {
    key = event.clipboardData.getData("text/plain");
  } else {
    key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  const regex = /[0-9]|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}

dayField.addEventListener("keypress", filterDate);
yearField.addEventListener("keypress", filterDate);
graduationField.addEventListener("keypress", filterDate);

//validate birthday
function birthdayValidate() {
  if (dayField.value <= 0 || dayField.value >= 32
    || yearField.value <= 1960 || yearField.value >= 2006) {
    wrongDateBirth.style.display = "inline-block";
    validateTtrigger = false;
  } else {
    wrongDateBirth.style.display = "none";
    validateTtrigger = true;
  }
};

dayField.addEventListener('blur', birthdayValidate);
yearField.addEventListener('blur', birthdayValidate);

//validate graduation field
function graduationValidate() {
  if (this.value <= 1960 || this.value >= 2019) {
    wrongGraduationInput.style.display = "inline-block";
    validateTtrigger = false;
  } else {
    wrongGraduationInput.style.display = "none";
    validateTtrigger = true;
  }
};
graduationField.addEventListener('blur', graduationValidate);

//phone mask
function phoneMask(e) {
  const x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,3})/);
  e.target.value = !x[2] ? '+375-' : '+375-' + (!x[3] ? x[2] : '(' + x[2] + ') ') + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
};

function changePhoneColor() {
  if (this.value.length <= 5) {
    this.classList.add('phone-field');
  } else {
    this.classList.remove('phone-field');
  }
}

phoneField.addEventListener('input', phoneMask);
phoneField.addEventListener('input', changePhoneColor);

// submitting form
let questionnaireForm = document.getElementById("questionnaire-form");
const formData = {};

function getFormData() {
  if(validateTtrigger) {
    questionnaireForm = document.getElementById("questionnaire-form");
    const questionnaireFormData = new FormData(questionnaireForm);
    const resultForm = document.getElementById("result-form");

    for (let [key, value] of questionnaireFormData) {
      formData[key] = value;
    }
    insertData(formData);
    resultForm.style.display = "flex";
  }
}

function insertData(data) {
  const enteredName = document.getElementById("entered-name");
  const enteredSurname = document.getElementById("entered-surname");
  const enteredPatronymic = document.getElementById("entered-patronymic");
  const enteredInstitution = document.getElementById("entered-institution");
  const enteredFaculty = document.getElementById("entered-faculty");
  const enteredSpecialization = document.getElementById(
    "entered-specialization"
  );
  const enteredGraduation = document.getElementById("entered-graduation");
  const enteredPhone = document.getElementById("entered-phone");
  const enteredMail = document.getElementById("entered-mail");
  const enteredSkype = document.getElementById("entered-skype");
  const enteredTelegram = document.getElementById("entered-telegram");

  enteredName.innerText = data["name-field"];
  enteredSurname.innerText = data["surname-field"];
  enteredPatronymic.innerText = data["patronymic-field"];
  enteredInstitution.innerText = data["institution-field"];
  enteredFaculty.innerText = data["faculty-field"];
  enteredSpecialization.innerText = data["specialization-field"];
  enteredGraduation.innerText = data["graduation-field"];
  enteredPhone.innerText = data["phone-field"];
  enteredMail.innerText = data["mail-field"];
  enteredSkype.innerText = data["skype-field"];
  enteredTelegram.innerText = data["telegram-field"];
  insertBirthday(data);
  insertPhoto(data);
}

function insertPhoto(data) {
  if (data["attach-photo"].name) {
    const fReader = new FileReader();
    fReader.readAsDataURL(data["attach-photo"]);
    fReader.onloadend = function(event) {
      const employeePhoto = document.getElementById("employee-photo");
      employeePhoto.style.display = "block";
      employeePhoto.src = event.target.result;
    };
  }
  return;
}

function insertBirthday(data) {
  let result = "";
  if (data["day-field"] && data["month-field"] && data["year-field"]) {
    const enteredBirth = document.getElementById("entered-birth");
    result =
      data["day-field"] + "." + data["month-field"] + "." + data["year-field"];
    enteredBirth.innerText = result;
  }
  return;
}

questionnaireForm.addEventListener("submit", getFormData);

// download json file
const downloadBtn = document.getElementById("download-btn");
function downloadForm() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(formData));
  downloadBtn.setAttribute("href", dataStr);
  downloadBtn.setAttribute("download", "questionnaire.json");
}

downloadBtn.addEventListener("click", downloadForm);
