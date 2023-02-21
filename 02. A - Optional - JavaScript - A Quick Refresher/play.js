const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log("Hi, i am " + this.name)
  }
};
person.greet();
