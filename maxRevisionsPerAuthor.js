const fs = require('fs');

const data = JSON.parse(fs.readFileSync('03.json'));

const revisionsPerReviewer = data.map(entry => {
    const revisedEntry = {...entry};
    delete revisedEntry.correspondence;
    const recipients = Array.from(new Set(entry.correspondence.map(cor => cor.recipient)))
    for (let i = 0; i < 23; i++) {
        revisedEntry[`${i}`] = new Set(entry.correspondence.filter(cor => cor.recipient == recipients[i]).map(ent => ent.revision)).size;
    }
    return revisedEntry;
});

for (let i = 0; i < 23; i++) {
    console.log(i + ': ' + revisionsPerReviewer.reduce((prev, cur) => cur[`${i}`] > prev ? cur[`${i}`] : prev , 0));
}

const weildiest = revisionsPerReviewer.find(entry => entry['0'] === 23);
const weildiest2 = data.find(entry => entry.id === 4777);

debugger;