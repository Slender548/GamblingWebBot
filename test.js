

// const arr = (["x2", "x3", "x1.5", "x0.5", "x2", "x5", "lose", "lose", "lose", "lose"].sort(() => 0.5 - Math.random()))
// console.log(arr)

// console.log(arr[2])

// let out = 359
// while (out % 36 !== 0) {

//     const rotateDeg = Math.random() * 360 + 1080; // Rotate 3 to 4 full turns
//     out = rotateDeg;
//     let digit = Math.round((out % 360) / 36)
//     digit = !digit ? 0 : digit - 1
//     console.log(out % 360, arr[digit])

// }

console.log(new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3 $4:$5:$6'));

console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));