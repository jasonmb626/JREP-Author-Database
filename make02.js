const fs = require('fs');
const cheerio = require('cheerio');

//loops through the entries in 01.json, parses the EMDetails html for that entry, adds submission data, current status, and authors
//outputs new file 02.json

files = fs.readdirSync('./');

const getFileNameForJournalID = (id, type) => files.find(file => {
    const start = file.indexOf('=')+1;
    const end = file.indexOf('&');
    if (end > start) {
        return file.toUpperCase().includes(type.toUpperCase()) && file.substring(start,end) == id;
    }
    return false;
});

const oldData = JSON.parse(fs.readFileSync('./01.json'));

newData = oldData.map(entry => {

    const html = fs.readFileSync(getFileNameForJournalID(entry.id, 'details'));

    const $ = cheerio.load(html);

    const allAuthorsCell = $('span:contains("All Authors:")').parent().next()[0];
    const initialSubmissionDate = $('span:contains("Initial Date Submitted:")').parent().next()[0].children[0].children[0].nodeValue;
    const currentStatus = $('span:contains("Current Editorial Status:")').parent().next()[0].children[0].children[0].nodeValue;
    const statusDate = $('span:contains("Editorial Status Date:")').parent().next()[0].children[0].children[0].nodeValue;

    const authors = [];
    allAuthorsCell.children.forEach(child => {
        let name = "";
        let rank = "";
        if (child.name === 'a') {
            try {
                name = child.firstChild.nodeValue.trim();
                rank = child.next.firstChild.nodeValue.slice(1).trim();
                authors.push({
                    name, rank
                });
            } catch (e) {

            }
        }
    });
    return {...entry, initialSubmissionDate, currentStatus, statusDate, authors};
});

fs.writeFileSync('./02.json', JSON.stringify(newData), 'utf-8');
