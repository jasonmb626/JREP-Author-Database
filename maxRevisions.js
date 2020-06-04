const fs = require('fs');

const data = JSON.parse(fs.readFileSync('03.json'));

const revisionCount = data.map(entry => {
    const revisedEntry = {...entry};
    delete revisedEntry.correspondence;
    revisedEntry.revisions = entry.correspondence.reduce((prev, cur) => cur.revision > prev ? cur.revision : prev, 0);
    return revisedEntry;
});

const maxRevisions = revisionCount.reduce((prev, cur) => cur.revisions > prev ? cur.revisions : prev, 0);

console.log(maxRevisions); //4

const filtered = revisionCount.filter(entry => entry.revisions === maxRevisions);

