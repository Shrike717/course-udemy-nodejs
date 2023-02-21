// Objects:
const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, i am " + this.name)
  }
};
//person.greet();

// Arrays:
const hobbies = ["Sports", "Cooking",];
hobbies.push("Programming");
console.log(hobbies);

// for (let hobby of hobbies) {
//   console.log(hobby);
// }
// console.log(hobbies.map(hobby => "My hobby is: " + hobby));
