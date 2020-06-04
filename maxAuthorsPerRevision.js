const fs = require('fs');

const data = JSON.parse(fs.readFileSync('03.json'));

const authorsPerRevision = data.map(entry => {
    const revisedEntry = {...entry};
    delete revisedEntry.correspondence;
    for (let i = 0; i <= 4; i++) {
        revisedEntry[`${i}`] = new Set(entry.correspondence.filter(cor => cor.revision == i).map(ent => ent.recipient)).size;
    }
    return revisedEntry;
});

for (let i = 0; i <= 4; i++) {
    console.log(i + ': ' + authorsPerRevision.reduce((prev, cur) => cur[`${i}`] > prev ? cur[`${i}`] : prev , 0));
}

const weildiest = authorsPerRevision.find(entry => entry['0'] === 23);
const weildiest2 = data.find(entry => entry.id === 4777);

debugger;