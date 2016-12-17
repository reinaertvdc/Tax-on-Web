

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
        $('#action-button-previous').prop('disabled',true);
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
        UI.Content.setNextPrevButton();
    }else if(currentStep == 3) {
        UI.setupSign(content);
        UI.Content.setSignButtons();
    }

}

























UI.Content.setSignButtons = function () {
    var buttons = $('#action-buttons');
    buttons.empty();
    buttons.append('<span class="col-xs-6"><button id="action-button-previous" class="btn btn-default btn-lg">Vorige</button></span>');
    buttons.append('<span class="col-xs-6"><button id="action-button-sign" class="btn btn-default btn-lg">Ondertekenen</button></span>');
    $('#action-button-sign')[0].addEventListener('click', function () {

    });
    $('#action-button-previous')[0].addEventListener('click', function () {
        ChangeStep(-1);
    });
};


UI.Content.setNextPrevButton = function(){
    var buttons = $('#action-buttons');
    buttons.empty();
    buttons.append('<span class="col-xs-6"><button id="action-button-previous" class="btn btn-default btn-lg">Vorige</button></span>');
    buttons.append('<span class="col-xs-6"><button id="action-button-next" class="btn btn-default btn-lg">Volgende</button></span>');
    $('#action-button-next')[0].addEventListener('click', function () {
        ChangeStep(1);
    });
    $('#action-button-previous')[0].addEventListener('click', function () {
        ChangeStep(-1);
    });
};


