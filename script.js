const form = document.getElementById('multiStepForm');
const fieldsets = form.querySelectorAll('fieldset');
const prevBtns = form.querySelectorAll('.prev');
const nextBtns = form.querySelectorAll('.next');

let currentStep = 0;

function showStep(step) {
    fieldsets.forEach((fieldset, index) => {
        if (index === step) {
            fieldset.style.display = 'block';
        } else {
            fieldset.style.display = 'none';
        }
    });
}

function updateSummary() {
    const summary = document.getElementById('summary');
    summary.innerHTML = '';

    fieldsets.forEach((fieldset, index) => {
        if (index < fieldsets.length - 1) {
            const inputs = fieldset.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], textarea, select, input[type="checkbox"]:checked, input[type="radio"]:checked');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    const label = input.nextElementSibling.textContent;
                    summary.innerHTML += `<p><strong>${label}:</strong> ${input.value}</p>`;
                } else {
                    const label = input.previousElementSibling.textContent;
                    const value = input.value;
                    summary.innerHTML += `<p><strong>${label}</strong> ${value}</p>`;
                }
            });
        }
    });
}

function displayError(input, message) {
    const parent = input.parentElement;
    let error = parent.querySelector('.error-message');

    if (!error) {
        error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        parent.appendChild(error);
    } else {
        error.textContent = message; // Update error message
    }
}

function removeError(input) {
    const parent = input.parentElement;
    const error = parent.querySelector('.error-message');
    if (error) {
        parent.removeChild(error);
    }
}

function validateEmail(emailInput) {
    const email = emailInput.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        displayError(emailInput, 'Please enter a valid email');
        return false;
    } else {
        removeError(emailInput);
        return true;
    }
}

nextBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentFieldset = fieldsets[currentStep];
        const inputs = currentFieldset.querySelectorAll('input, textarea, select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                displayError(input, 'This field is required');
            } else {
                removeError(input);
            }

            if (input.type === 'email') {
                if (!validateEmail(input)) {
                    isValid = false;
                }
            }

            if (input.type === 'number' && input.value < 0) {
                isValid = false;
                displayError(input, 'Age cannot be negative');
            }
        });

        if (isValid) {
            currentStep++;
            showStep(currentStep);
            updateSummary();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentStep--;
        showStep(currentStep);
        updateSummary();
    });
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const username = formData.get('name'); 

    this.reset();
    const thankYouMessage = document.createElement('p');
    thankYouMessage.textContent = `Thank you for submitting details, ${username}!`;
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = '';
    formContainer.appendChild(thankYouMessage);
});
