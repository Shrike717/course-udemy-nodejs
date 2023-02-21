// Objects:
const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, i am " + this.name)
  }
};
//person.greet();

const printName = ({ name }) => {
  //console.log(name);
};
printName(person);

const { name, age } = person;

// const copiedPerson = {...person};
// console.log(copiedPerson);

// // Arrays:
const hobbies = ["Sports", "Cooking"];
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);

// hobbies.push("Programming");

// const copiedArray = [...hobbies];
// //console.log(copiedArray);


// // for (let hobby of hobbies) {
// //   console.log(hobby);
// // }
// // console.log(hobbies.map(hobby => "My hobby is: " + hobby));

// const toArray = (...args) => {
//   return args;
// };
// console.log(toArray(1, 2, 3, 4));
