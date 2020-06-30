const fs = require('fs');

const data = JSON.parse(fs.readFileSync('02.json'));

console.log(data.map(entry => entry.authors.length).reduce((max, curr) => curr > max ? curr : max, 0));
console.log(data.filter(entry => entry.authors.length === 6));

//finds out max number of authors == 6