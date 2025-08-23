const phoneNumber = document.querySelector("#phone_number");
const invalidFeedback = document.querySelector(".invalid_feedback");
const submitBtn = document.querySelector(".submit");

submitBtn.disabled = phoneNumber.value.trim() === "";

phoneNumber.addEventListener("input", (e) => {
  invalidFeedback.textContent = "";
  const phoneNumberValue = e.target.value;

  if (phoneNumberValue.length > 0) {
    fetch("/auth/email_validation/", {
      body: JSON.stringify({ phone_number: phoneNumberValue }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          submitBtn.disabled = true;
          invalidFeedback.classList.remove("d-none");
          invalidFeedback.textContent = data.error;
        } else {
          invalidFeedback.classList.add("d-none");
          submitBtn.disabled = false;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        submitBtn.disabled = false; 
      });
  } else {
    submitBtn.disabled = true;
  }
});
