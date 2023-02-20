const name = "Max";
let age = 29;
const hasHobbbies = true;

function summarizeUser(userName, userAge, userHasHobby) {
  return "My name is " +
  userName +
   ", my age is " +
    userAge +
    " and the user has hobbies: " +
    userHasHobby;
};

console.log(summarizeUser(name, age, hasHobbbies));
