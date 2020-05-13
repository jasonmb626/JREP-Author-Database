const fs = require('fs');
const cheerio = require('cheerio');

//loops through the entries in 02.json, parses the doc_history html for that entry, adds reviewer/revision info
//outputs new file 03.json

files = fs.readdirSync('./');

const getFileNameForJournalID = (id, type) => files.find(file => {
    const start = file.indexOf('=')+1;
    const end = file.indexOf('&');
    if (end > start) {
        return file.toUpperCase().includes(type.toUpperCase()) && file.substring(start,end) == id;
    }
    return false;
});

const oldData = JSON.parse(fs.readFileSync('./02.json'));

newData = oldData.map(entry => {

    const html = fs.readFileSync(getFileNameForJournalID(entry.id, 'history'));

    const $ = cheerio.load(html);

    const rows = $('a[name="correspondence"]')[0].parent.next.next.next.next.children[1].children.filter(child => child.type === 'tag' && child.name && child.name ==='tr');
    const correspondence = rows.map(row => {
        const cols = row.children.filter(child => child.type === 'tag' && child.name && child.name === 'td');
        if (cols.length >= 4) {
            return {
                correspondenceDate: cols[0].firstChild.nodeValue.trim(),
                recipient: cols[2].firstChild.nodeValue.trim(),
                status: cols[3].firstChild.nodeValue.trim(),
                revision: cols[4].firstChild.nodeValue.trim(),
            }
        } else {
            return {};
        }
    });

    return {...entry, correspondence: correspondence.slice(1).reverse()}; //first row is headers (ignore) & listed in reverse order so reverse it.
});

fs.writeFileSync('./03.json', JSON.stringify(newData), 'utf-8'); //this has all the data scraped. Now it's just a matter of formatting it properly.
