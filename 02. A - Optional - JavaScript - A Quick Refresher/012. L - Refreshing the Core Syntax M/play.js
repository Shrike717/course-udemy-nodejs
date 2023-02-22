// Asynchronous code with callbacks:
// const fetchData = callback => {
//   const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       callback("Done!")
//     }, 1500)
//   });
// };

// setTimeout(() => {
//   // 2. Ausführung
//   console.log("Timer is done!")
//   // 3. Ausführung
//   fetchData(text => {
//     console.log(text);
//   })
// }, 2000)

// Asynchronous code with promises:
const fetchData = () => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done!")
    }, 1500)
  });
  return promise;
};

setTimeout(() => {
  // 2. Ausführung
  console.log("Timer is done!")
  // 3. Ausführung
  fetchData()
    .then(text => {
      console.log(text);
      return fetchData()
    })
    .then(text2 => {
      console.log(text2);
    });
}, 2000)




// Synchronous code:
// 1. Ausführung
console.log("Hello");
console.log("Hi");
