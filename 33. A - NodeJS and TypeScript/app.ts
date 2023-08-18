
const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

function add(num1: number, num2: number){
    return num1 + num2
   }

   // Possibily 1 to check if there is a button element:
   if (buttonElement) {
        // Adding eventlistener:
        buttonElement.addEventListener("click", () => {
            // Now extacting the values of the input fields.
            const num1 = num1Element.value;
            const num2 = num2Element.value;
            // Now passing the value of the function:
            const result = add(+num1, +num2);
            console.log(result);
        })
    }
