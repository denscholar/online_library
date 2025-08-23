document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("#inputs_fields input");

    inputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
            const currentInput = event.target;
            const nextInput = inputs[index + 1];

            if (currentInput.value.length === 1 && nextInput) {
                nextInput.focus();
            }
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && input.value === "" && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
});