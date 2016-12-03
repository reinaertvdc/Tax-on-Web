/* Enum of all possible synchronization states */
SyncStates = {
    SYNCED: 'SYNCED',
    SYNCING: 'SYNCING',
    OFFLINE: 'OFFLINE'
};


/* Main flow of the tax report */
var flow = [
    "Vraag 1/5",
    "Vraag 2/5",
    "Vraag 3/5",
    "Vraag 4/5",
    "Vraag 5/5"
];


/* Completed parts of the flow */
var completed = [];


/* Set the synchronization state */
function setSyncState(state) {
    var syncState = $('#sync-state');

    switch (state) {
        case SyncStates.SYNCED:
            syncState.text('Alle wijzigingen zijn opgeslagen.');
            break;
        case SyncStates.SYNCING:
            syncState.text('Wijzigingen aan het opslaan...');
            break;
        case SyncStates.OFFLINE:
            syncState.text('U bent offline, kan wijzigingen niet opslaan.');
            break;
        default:
            return false;
    }

    return true;
}


/* Set the user name */
function setUserNames(names) {
    var userNames = $('#user-names');

    if (!names.constructor === Array || names.length < 1 || names.length > 2) {
        return false;
    }

    userNames.empty();

    names.forEach(function (name) {
        userNames.append('<span class="navbar-text text-right">' + name + '</span>');
    });

    return true;
}


/* Set the current step by its number */
function setCurrentStep(number) {
    var steps = $('#steps').children();

    if (Number.isInteger(number) && steps.length >= number && number > 0) {
        steps.removeClass('current');
        steps.eq(number - 1).addClass('current');

        return true;
    } else {
        return false;
    }
}


/* Set the progress bar to the given fraction (0 = 0%, 1 = 100%) */
function setProgress(fraction) {
    var progressBar = $('#progress-bar').children();
    var percentage = Math.round(fraction * 100);

    if (Number.isFinite(fraction) && fraction >= 0 && fraction <= 1) {
        progressBar.attr('aria-valuenow', percentage);
        progressBar.attr('style', 'width: ' + percentage + '%;');
        progressBar.children().text(percentage + '% voltooid');

        return true
    } else {
        return false;
    }
}


/* Update the page to match the current state of the tax report */
function renderPage() {
    var content = $('#content');
    var question;

    if (flow.length > 0) {
        question = flow[0];
    } else {
        question = 'Klaar!';
    }

    setProgress(completed.length / (flow.length + completed.length));
    content.empty();
    content.append('<span class="question">' + question + '</span>');
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
setSyncState(SyncStates.SYNCED);
setUserNames(['Erik Tienen', 'Tine van de Meent']);
setCurrentStep(1);
renderPage();
