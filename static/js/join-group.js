document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-wizard");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const steps = document.querySelectorAll(".step");
  const stepIndicators = document.querySelectorAll(".progress-container li");
  const progress = document.querySelector(".progress");
  const stepsContainer = document.querySelector(".steps-container");
  const groupCodeInput = document.querySelector("#groupCodeInput");
  const invalidFeedback = document.querySelector(".invalid_feedback");

  let currentStep = 0;

  document.documentElement.style.setProperty("--steps", stepIndicators.length);

  const getRequiredFields = () =>
    steps[currentStep].querySelectorAll("input[required], select[required]");

  const validateForm = () => {
    let isValid = true;
    const fields = getRequiredFields();

    fields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
      }
    });

    if (!invalidFeedback.classList.contains("d-none")) {
      isValid = false;
    }

    nextBtn.disabled = !isValid;
  };

  const updateStepUI = () => {
    steps.forEach((step, index) => {
      const isCurrent = index === currentStep;
      step.classList.toggle("current", isCurrent);
      step.setAttribute("aria-hidden", !isCurrent);
      step.style.transform = `translateX(-${currentStep * 100}%)`;
    });

    stepIndicators.forEach((indicator, index) => {
      indicator.classList.toggle("current", index === currentStep);
      indicator.classList.toggle("done", index < currentStep);
    });

    stepsContainer.style.height = steps[currentStep].offsetHeight + "px";

    prevBtn.hidden = currentStep === 0;
    nextBtn.hidden = currentStep >= steps.length - 1;
    submitBtn.hidden = !nextBtn.hidden;

    validateForm();
  };

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateStepUI();
    }
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      currentStep--;
      updateStepUI();
    }
  });

  form.addEventListener("input", validateForm);

  groupCodeInput?.addEventListener("input", (e) => {
    const groupCode = e.target.value;
    invalidFeedback.textContent = "";

    if (groupCode.length > 0) {
      fetch("/member/group_code_validation/", {
        method: "POST",
        body: JSON.stringify({ group_code: groupCode }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            invalidFeedback.textContent = data.error;
            invalidFeedback.classList.remove("d-none");
          } else {
            invalidFeedback.classList.add("d-none");
          }
          validateForm();
        })
        .catch((err) => {
          console.error("Group code error:", err);
        });
    } else {
      invalidFeedback.textContent = "Group code is required.";
      invalidFeedback.classList.remove("d-none");
      validateForm();
    }
  });

  // 🔒 Disable tab key navigation within the form
  form.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      e.preventDefault(); // Block tab key from switching fields
    }
  });

  // Initial render
  updateStepUI();
});
