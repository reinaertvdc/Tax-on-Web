/* Define a UI object to hold static UI methods */
function UI() {
}


/* Set the conveyed synchronization state */
UI.setSyncState = function (state) {
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
};


/* Set the conveyed user names to the given array of names (must be of length 1 or 2) */
UI.setUserNames = function (names) {
    var userNames = $('#user-names');

    if (!names.constructor === Array || names.length < 1 || names.length > 2) {
        return false;
    }

    userNames.empty();

    names.forEach(function (name) {
        userNames.append('<span class="navbar-text text-right">' + name + '</span>');
    });

    return true;
};


/* Set the conveyed current step to the step with the given number */
UI.setCurrentStep = function (number) {
    var steps = $('#steps').children();

    if (Number.isInteger(number) && steps.length >= number && number > 0) {
        steps.removeClass('current');
        steps.eq(number - 1).addClass('current');

        return true;
    } else {
        return false;
    }
};


/* Set the conveyed progress to the given fraction (0 = 0%, 1 = 100%) */
UI.setProgress = function (fraction) {
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
};


/* Define a Content object within the UI object to hold static methods that operate on the actual content */
UI.Content = function () {
};

/* Set the additional attachments*/
UI.Content.setAttachments = function (value){
    var attachments = $('#attachments');
    for(var j = 0; j < value.length; j++){
        var rowValues = value[j];
        var rowContent = '<div class="row">' +
            '<div class="col-sm-4 filenameContainer"><label class="filename">'+ rowValues[0] + '</label></div>';

        if(rowValues[1] != "")
            rowContent += '<div class="col-sm-6"><input type="text" class="form-control" value="' + rowValues[2] + '"></div>';
        else
            rowContent += '<div class="col-sm-6"><input type="text" class="form-control" value=""></div>';

        rowContent += '<div class="col-sm-2"><button id="action-button-remove" class="btn btn-default removeButton"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Verwijder</button></div></div>';

        attachments.append(rowContent);
    }
};  

UI.Content.setNextButton = function(){
    var buttons = $('#action-buttons');
    buttons.empty();
    buttons.append('<span class="col-xs-6"><button id="action-button-previous" class="btn btn-default btn-lg">Vorige</button></span>');
    buttons.append('<span class="col-xs-6"><button id="action-button-next" class="btn btn-default btn-lg">Volgende</button></span>');
};

/* Set the content to the given question */
UI.Content.setQuestion = function (value) {
    var content = $('#content');
    content.empty();
    content.append('<span class="question">' + value + '</span>');
};
