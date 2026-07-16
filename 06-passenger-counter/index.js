let countEl = document.getElementById('count-el');
let count = 0;

function increment() {
  count = count + 1;
  countEl.innerText = count;
};

function save(){
  console.log(count)
};



/*
 let count = hadis (5 * 12);
 console.log(count);
 javascript:void(0);      
 -----
let myAge = 17
let dogHumanRatio = 7
let myDogAge = myAge * dogHumanRatio
const kesimpulan = `jadi ratio umur gw itu sekitar ${myDogAge} tahun umur dog (emote kaget)`

console.log(kesimpulan);   */

// reassigning and increamenting
// let bonusPoints = 50
// bonusPoints = bonusPoints + 50 - 75
// bonusPoints = bonusPoints + 45

// console.log(bonusPoints);

// let x = 3;
// const y = x++;

// console.log(`x:${x}, y:${y}`);
// // Expected output: "x:4, y:3"

// let a = 3;
// const b = ++a;

// console.log(`a:${a}, b:${b}`);
// // Expected output: "a:4, b:4"
