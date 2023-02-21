// Objects:
const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, i am " + this.name)
  }
};
//person.greet();

const copiedPerson = {...person};
console.log(copiedPerson);



// Arrays:
const hobbies = ["Sports", "Cooking",];
hobbies.push("Programming");

const copiedArray = [...hobbies];
//console.log(copiedArray);


// for (let hobby of hobbies) {
//   console.log(hobby);
// }
// console.log(hobbies.map(hobby => "My hobby is: " + hobby));

const toArray = (...args) => {
  return args;
};
console.log(toArray(1, 2, 3, 4));
