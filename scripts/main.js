/* Enum of all possible synchronization states */
SyncStates = {
    SYNCED: 'SYNCED',
    SYNCING: 'SYNCING',
    OFFLINE: 'OFFLINE'
};


/* Main flow of the tax return */
var flow = [
    "Vraag 1/5",
    "Vraag 2/5",
    "Vraag 3/5",
    "Vraag 4/5",
    "Vraag 5/5"
];


/* Completed parts of the flow */
var completed = [];


/* Update the page to match the current state of the tax return */
function renderPage() {
    var question;

    if (flow.length > 0) {
        question = flow[0];
    } else {
        question = 'Klaar!';
    }

    UI.setProgress(completed.length / (flow.length + completed.length));
    UI.Content.setQuestion(question);
}


/* Return to the previous page */
function previousPage() {
    if (flow.length > 0) {
        var page = flow.pop();
        flow.unshift(page);
        renderPage();
    }
}


/* Mark the current page as solved and go to the next page */
function nextPage() {
    if (flow.length > 0) {
        var page = flow.shift();
        completed.push(page);
        renderPage();
    }
}


/* Jump to the next page without resolving the current page */
function skipPage() {
    if (flow.length > 0) {
        var page = flow.shift();
        flow.push(page);
        renderPage();
    }
}


$('#action-button-previous')[0].addEventListener('click', function () {
    previousPage();
});

$('#action-button-yes')[0].addEventListener('click', function () {
    nextPage();
});

$('#action-button-no')[0].addEventListener('click', function () {
    nextPage();
});

$('#action-button-skip')[0].addEventListener('click', function () {
    skipPage();
});


/* Initialize the interface */
UI.setSyncState(SyncStates.SYNCED);
UI.setUserNames(['Erik Tienen', 'Tine van de Meent']);
UI.setCurrentStep(1);
renderPage();
