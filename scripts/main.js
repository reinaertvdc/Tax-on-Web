/* Enum of all possible synchronization states */
SyncStates = {
    SYNCED: 'SYNCED',
    SYNCING: 'SYNCING',
    OFFLINE: 'OFFLINE'
};

var currentStep = 1;

/* Main flow of the tax return */
var flow = [
    "Vraag 1/5",
    "Vraag 2/5",
    "Vraag 3/5",
    "Vraag 4/5",
    "Vraag 5/5"
];

/*List of additional attachments*/
var attachments = [];


/* Completed parts of the flow */
var completed = [];


/* Update the page to match the current state of the tax return */
function renderPage() {
    var question;

    if (flow.length > 0) {
        question = flow[0];
    } else {
        question = 'Klaar!';
        UI.Content.setNextPrevButton();

        $('#action-button-next')[0].addEventListener('click', function () {
            ChangeStep(1);
        });
        $('#action-button-previous')[0].addEventListener('click', function () {
            ChangeStep(-1);
        });
        $('#action-button-previous').prop('disabled',true);
    }

    UI.setProgress(completed.length / (flow.length + completed.length));
    UI.Content.setQuestion(question);
}

/* Update page to match the additional attachments*/
function renderAttachments(){
    $('#attachments').empty();
    UI.Content.setAttachments(attachments);
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

function ChangeStep(value){
    currentStep += value;
    UI.setCurrentStep(currentStep);
    var content = $('#content');
    content.empty();

    if(currentStep == 1)
        UI.setupQuestions(content);
    else if(currentStep == 2) {
        $('#action-button-previous').prop('disabled', false);
        UI.setupAttachmentStep(content);
    }else if(currentStep == 3) {
        UI.setupSign(content);
    }

}

function updateComment(index, value){
    attachments[index][1] = value;
}

function removeAttachment(index) {
    attachments.splice(index, 1);
    renderAttachments();
}

/* remove all attachments */
function removeAllAttachments() {
    attachments = [];
    renderAttachments();
}

/* get all files from input and save the names in attachment array */
function addFile(){
    var fileArray = $("#file").prop("files");
    for (var i = 0; i < fileArray.length; ++i) {
        var filename = fileArray.item(i).name.replace(/^.*[\\\/]/, '');

        /* add tupple [filename, comment] */
        attachments.push([filename, ""]);
    }
    $("#file").val("");
    renderAttachments();
}

/* Initialize the interface */
UI.setSyncState(SyncStates.SYNCED);
UI.setUserNames(['Erik Tienen', 'Tine van de Meent']);
UI.setCurrentStep(1);
UI.setupQuestions($('#content'));
