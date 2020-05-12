
const fs = require('fs');
const cheerio = require('cheerio');


const html = fs.readFileSync('./EMDetails.aspx?docid=3407&ms_num=JREP-D-15-00024&sectionID=1');

const $ = cheerio.load(html);

const allAuthorsCell = $('span:contains("All Authors:")').parent().next()[0];
const initialSubmissionDate = $('span:contains("Initial Date Submitted:")').parent().next()[0].children[0].children[0].nodeValue;
const currentStatus = $('span:contains("Current Editorial Status:")').parent().next()[0].children[0].children[0].nodeValue;

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
console.log(authors);

