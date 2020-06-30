const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv')

//#Source https://bit.ly/2neWfJ2 
const toOrdinalSuffix = num => {
    const int = parseInt(num),
      digits = [int % 10, int % 100],
      ordinals = ['st', 'nd', 'rd', 'th'],
      oPattern = [1, 2, 3, 4],
      tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
      ? int + ordinals[digits[0] - 1]
      : int + ordinals[3];
  };


const oldData = JSON.parse(fs.readFileSync('./03.json'));

const newData = [];

oldData.forEach(el => {
    //correspondence sorted by recipient
    const corByRec = el.correspondence.sort( (a, b) => a.recipient.localeCompare(b.recipient));
    const recipients = Array.from(new Set(corByRec.map(el => el.recipient)));

    const newEntry = {
        'Paper Title': el.paperTitle,
        'JREP #': el.JREPNO,
        'Initial Submission Date': new Date(el.initialSubmissionDate).toLocaleDateString()
    }
    for (let i = 1; i <= 6; i++) //ran a previous script and found max 6 authors
        if ( i <= el.authors.length )   
            newEntry[`${toOrdinalSuffix(i)} author name`] = el.authors[i-1].name;
        else
            newEntry[`${toOrdinalSuffix(i)} author name`] = "";
    for (let i = 1; i <= 6; i++) //ran a previous script and found max 6 authors
        if ( i <= el.authors.length )   
            newEntry[`${toOrdinalSuffix(i)} author rank`] = el.authors[i-1].rank.split('|')[0].split(",")[0].trim();
        else
            newEntry[`${toOrdinalSuffix(i)} author rank`] = "";
    for (let i = 1; i <= 6; i++) //ran a previous script and found max 6 authors
        if ( i <= el.authors.length ) {
            const institutionArr = el.authors[i-1].rank.split('|')[0].split(",");
            if (institutionArr[1])
                newEntry[`${toOrdinalSuffix(i)} author institution`] = el.authors[i-1].rank.split('|')[0].split(",")[1].trim();
            else
                newEntry[`${toOrdinalSuffix(i)} author institution`] = "";
        } else
            newEntry[`${toOrdinalSuffix(i)} author institution`] = "";
    newEntry['Article type'] = "";
    newEntry['current status'] = el.currentStatus;
    newEntry['status date'] = new Date(el.statusDate).toLocaleDateString();
    for (let reviewerIndex = 1; reviewerIndex <= 23; reviewerIndex++) //ran a previous script and found max 23 reviewers
        for (let revisionIndex = 0; revisionIndex < 4; revisionIndex++) {
            if (reviewerIndex < recipients.length) {
                const filteredForReviewerAndRevision = el.correspondence.filter(cor => cor.recipient === recipients[reviewerIndex-1] && cor.revision == revisionIndex);
                
                if (filteredForReviewerAndRevision.length >= 1) {
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer name - ${toOrdinalSuffix(revisionIndex+1)} revision`] = filteredForReviewerAndRevision[0].recipient;
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer invite date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = new Date(filteredForReviewerAndRevision[0].correspondenceDate).toLocaleDateString();
                    if ( filteredForReviewerAndRevision.length > 1 ) {
                        newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status - ${toOrdinalSuffix(revisionIndex+1)} revision`] = filteredForReviewerAndRevision[filteredForReviewerAndRevision.length-1].status;
                        newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = new Date(filteredForReviewerAndRevision[filteredForReviewerAndRevision.length-1].correspondenceDate).toLocaleDateString();
                    } else {
                        newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                        newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    }
                } else {
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer name - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer invite date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                }
            } else {
                newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer name - ${toOrdinalSuffix(revisionIndex)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer invite date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
                    newEntry[`${toOrdinalSuffix(reviewerIndex)} reviewer last status date - ${toOrdinalSuffix(revisionIndex+1)} revision`] = "";
            }
        }
    newData.push(newEntry);
});

//fs.writeFileSync('./04.json', JSON.stringify(newData), 'utf-8');

const csv = new ObjectsToCsv(newData);
(async () => {
    await csv.toDisk('./04.csv'); //Format data properly into
})(); 