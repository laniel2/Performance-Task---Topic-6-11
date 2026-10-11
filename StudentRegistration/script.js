const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const togglePassword = document.getElementById("togglePassword");

// 1. Validate the Form
// 1.1 Show error message and highlight invalid field
function showError(field, message) {
  const errorElement = document.getElementById(field.id + "Error");

  if (errorElement) {
    errorElement.textContent = message;
  }

  field.classList.add("error");
  field.setAttribute("aria-invalid", "true");
}

// 1.2 Clear error message and remove highlight
function clearError(field) {
  const errorElement = document.getElementById(field.id + "Error");

  if (errorElement) {
    errorElement.textContent = "";
  }

  field.classList.remove("error");
  field.removeAttribute("aria-invalid");
}

// 1.3 Check that required text fields are entered after trimming spaces
function checkRequired(field) {
  if (!field) return false;

  field.value = field.value.trim();

  if (field.value === "") {
    showError(field, field.dataset.error || "This field is required.");
    return false;
  }

  clearError(field);
  return true;
}

// 1.4 Validate email format
function validateEmail() {
  const email = document.getElementById("email");

  if (!checkRequired(email)) {
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    showError(email, "Please enter a valid email address.");
    return false;
  }

  clearError(email);
  return true;
}

// 1.5 Validate phone number format
function validatePhone() {
  const phone = document.getElementById("phone");

  if (!checkRequired(phone)) {
    return false;
  }

  const format = phone.dataset.phoneFormat || "11 digits starting with 09";
  const phonePattern = /^09\d{9}$/;

  if (!phonePattern.test(phone.value)) {
    showError(phone, "Phone number must use this format: " + format + ".");
    return false;
  }

  clearError(phone);
  return true;
}

// 1.6 Validate program and year level selection
function validateProgramAndYear() {
  const program = document.getElementById("program");
  const yearLevel = document.getElementById("yearLevel");
  let valid = true;

  if (!program.value) {
    showError(program, program.dataset.error || "Please select a program.");
    valid = false;
  } else {
    clearError(program);
  }

  if (!yearLevel.value) {
    showError(yearLevel, yearLevel.dataset.error || "Please select a year level.");
    valid = false;
  } else {
    clearError(yearLevel);
  }

  return valid;
}

// 1.7 Validate password and confirm password
function validatePasswords() {
  let valid = true;

  if (!checkRequired(password)) {
    valid = false;
  } else if (password.value.length < 8) {
    showError(password, "Password must be at least 8 characters.");
    valid = false;
  } else {
    clearError(password);
  }

  if (!checkRequired(confirmPassword)) {
    valid = false;
  } else if (confirmPassword.value !== password.value) {
    showError(confirmPassword, "Passwords do not match.");
    valid = false;
  } else {
    clearError(confirmPassword);
  }

  return valid;
}

// 1.8 Validate gender selection
function validateGender() {
  const genderGroup = document.getElementById("genderGroup");
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  const genderError = document.getElementById("genderError");

  if (!selectedGender) {
    genderError.textContent = "Please select a gender.";
    genderGroup.classList.add("error-group");
    return false;
  }

  genderError.textContent = "";
  genderGroup.classList.remove("error-group");
  return true;
}

// 1.9 Validate agreement checkbox
function validateAgreement() {
  const agreement = document.getElementById("agreement");
  const agreementError = document.getElementById("agreementError");

  if (!agreement.checked) {
    agreementError.textContent = "Please check the agreement box.";
    agreement.classList.add("error");
    return false;
  }

  agreementError.textContent = "";
  agreement.classList.remove("error");
  return true;
}

// 1.10 Validate the full form and final checks
function validateForm() {
  let valid = true;
  const requiredFields = [
    document.getElementById("studentId"),
    document.getElementById("fullName"),
    document.getElementById("dob"),
    document.getElementById("address")
  ];

  requiredFields.forEach(function(field) {
    if (!checkRequired(field)) {
      valid = false;
    }
  });

  if (!validateEmail()) valid = false;
  if (!validatePhone()) valid = false;
  if (!validateProgramAndYear()) valid = false;
  if (!validatePasswords()) valid = false;
  if (!validateGender()) valid = false;
  if (!validateAgreement()) valid = false;

  const dob = document.getElementById("dob");
  if (dob && dob.value) {
    const birthDate = new Date(dob.value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      showError(dob, "Date of birth cannot be in the future.");
      valid = false;
    }
  }

  return valid;
}

// 1.11 Clear all error messages and styles
function clearAllErrorsAndMessages() {
  form.querySelectorAll(".error").forEach(function(field) {
    field.classList.remove("error");
    field.removeAttribute("aria-invalid");
  });

  form.querySelectorAll(".error-group").forEach(function(group) {
    group.classList.remove("error-group");
  });

  form.querySelectorAll(".error-message").forEach(function(message) {
    message.textContent = "";
  });
}

// 2. Handle Form Submission
// 2.1 Prevent default submit and validate before success
form.addEventListener("submit", function(event) {
  event.preventDefault();
  successMessage.hidden = true;
  successMessage.textContent = "";

  if (validateForm()) {
    clearAllErrorsAndMessages();
    successMessage.textContent = "Registration successful!";
    successMessage.hidden = false;
  }
});

// 3. Display Error Messages
// 4. Highlight Invalid Fields
// 5. Use classList.toggle()
// 5.1 Toggle password visibility and update the button state
togglePassword.addEventListener("click", function() {
  const shouldShow = password.type === "password";

  password.setAttribute("type", shouldShow ? "text" : "password");
  confirmPassword.setAttribute("type", shouldShow ? "text" : "password");

  togglePassword.classList.toggle("active");
  togglePassword.dataset.mode = shouldShow ? "shown" : "hidden";
  togglePassword.textContent = shouldShow ? "Hide Passwords" : "Show/Hide Passwords";
});

// 6. Use data-* attributes
// 6.1 Read custom dataset values and handle dynamic validation updates
// 7. Manipulate an HTML Attribute
// 7.1 Change HTML attributes such as type during password toggle
form.querySelectorAll("input, select, textarea").forEach(function(field) {
  field.addEventListener("input", function() {
    if (field.id && document.getElementById(field.id + "Error")) {
      clearError(field);
    }

    if (field.id === "password" || field.id === "confirmPassword") {
      if (confirmPassword.value && password.value && confirmPassword.value !== password.value) {
        showError(confirmPassword, "Passwords do not match.");
      } else if (confirmPassword.value) {
        clearError(confirmPassword);
      }
    }

    if ((field.name === "gender" || field.id === "agreement") && field.type !== "text") {
      if (field.name === "gender") {
        validateGender();
      }
      if (field.id === "agreement") {
        validateAgreement();
      }
    }

    successMessage.hidden = true;
    successMessage.textContent = "";
  });

  field.addEventListener("change", function() {
    if (field.name === "gender") {
      validateGender();
    }

    if (field.id === "agreement") {
      validateAgreement();
    }
  });
});

// 8. Show a Success Message
// 8.1 Display success message when all validation passes
// 9. Reset the Form
// 9.1 Clear all errors, input values, and return the form to the original state
form.addEventListener("reset", function() {
  setTimeout(function() {
    clearAllErrorsAndMessages();
    successMessage.textContent = "";
    successMessage.hidden = true;

    password.setAttribute("type", "password");
    confirmPassword.setAttribute("type", "password");
    togglePassword.dataset.mode = "hidden";
    togglePassword.classList.remove("active");
    togglePassword.textContent = "Show/Hide Passwords";
  }, 0);
});
