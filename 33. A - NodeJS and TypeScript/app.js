var num1Element = document.getElementById("num1");
var num2Element = document.getElementById("num2");
var buttonElement = document.querySelector("button");
function add(num1, num2) {
    return num1 + num2;
}

// Adding eventlistener:
buttonElement.addEventListener("click", function () {
    // Now extacting the values of the input fields.
    var num1 = num1Element.value;
    var num2 = num2Element.value;
    // Now passing the value of the function:
    var result = add(num1, +num2);
    console.log(result);
});