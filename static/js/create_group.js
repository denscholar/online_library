const groupName = document.querySelector("#group_name");
const goalAmount = document.querySelector("#goal_amount");
const contAmount = document.querySelector("#contribution_amount");
// const contFreq = document.querySelector("#contribution_freq");
const numMember = document.querySelector("#num_member");
// const currentMember = document.querySelector("#current_member");
const startDate = document.querySelector("#start_date");
const endDate = document.querySelector("#end_date");
const createGroupForm = document.querySelector("#create-group-form");
const invalidFeedback = document.querySelector(".invalid_feedback");
const submitButton = document.querySelector(
  "#create-group-form button[type='submit']"
);
const dateError = document.createElement("small");

dateError.classList.add("invalid_feedback", "d-none");
endDate.parentNode.appendChild(dateError);

// Function to validate dates
function validateDates() {
  let today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight to avoid time-related issues

  let start = new Date(startDate.value);
  let end = new Date(endDate.value);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    dateError.classList.remove("d-none");
    dateError.textContent = "Please enter valid start and end dates.";
    submitButton.disabled = true;
    return;
  }

  // Check if start date is in the past
  if (start < today) {
    dateError.classList.remove("d-none");
    dateError.textContent = "Start date cannot be in the past.";
    submitButton.disabled = true;
    return;
  }

  let minEndDate = new Date(start);
  minEndDate.setMonth(minEndDate.getMonth() + 6); // Minimum 6 months

  let maxEndDate = new Date(start);
  maxEndDate.setMonth(maxEndDate.getMonth() + 12); // Maximum 12 months

  let monthDifference =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end < minEndDate) {
    dateError.classList.remove("d-none");
    dateError.textContent =
      "End date must be at least 6 months after the start date.";
    submitButton.disabled = true;
  } else if (end > maxEndDate) {
    dateError.classList.remove("d-none");
    dateError.textContent =
      "End date must not exceed 12 months from the start date.";
    submitButton.disabled = true;
  } else {
    dateError.classList.add("d-none");
    submitButton.disabled = false;
    numMember.value = monthDifference; // Prefill numMember
  }
}

// Attach event listeners
startDate.addEventListener("change", validateDates);
endDate.addEventListener("change", validateDates);

// Function to calculate and update the contribution amount
function updateContributionAmount() {
  let goalValue = parseFloat(goalAmount.value);
  let numMemberValue = parseInt(numMember.value);

  if (!isNaN(goalValue) && !isNaN(numMemberValue) && numMemberValue > 0) {
    contAmount.value = (goalValue / numMemberValue).toFixed(2);
  } else {
    contAmount.value = ""; // Reset if inputs are invalid
  }

  if ((invalidFeedback.textContent = "")) {
    invalidFeedback.textContent = "";
  }
}

// Attach event listeners to goal amount and numMember fields
goalAmount.addEventListener("input", updateContributionAmount);
numMember.addEventListener("input", updateContributionAmount);
invalidFeedback.addEventListener("input", updateContributionAmount);

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#current_member").value = 0;
  document.querySelector("#contAmount").disabled = true;
});

createGroupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log("Start Date:", startDate.value);
  console.log("End Date:", endDate.value);

  let groupNameValue = groupName.value;
  let goalAmountValue = goalAmount.value;
  let contAmountValue = contAmount.value;
  // let contFreqValue = contFreq.value;
  let numMemberValue = numMember.value;
  // let currentMemberValue = currentMember.value;
  let startDateValue = startDate.value
    ? new Date(startDate.value).toISOString().split("T")[0]
    : null;
  let endDateValue = endDate.value
    ? new Date(endDate.value).toISOString().split("T")[0]
    : null;

  fetch(createGroupUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      group_name: groupNameValue,
      goal_amount: goalAmountValue,
      contribution_amount: contAmountValue,
      // contribution_frequency: contFreqValue,
      num_of_members: numMemberValue,
      // current_members: currentMemberValue,
      start_date: startDateValue,
      end_date: endDateValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.message) {
        location.reload(); // Reload page or update UI dynamically
      } else {
        // alert("Error: " + data.error);
        invalidFeedback.classList.remove("d-none");
        invalidFeedback.textContent = data.error;
      }
    })
    .catch((error) => console.error("Error:", error));
});
