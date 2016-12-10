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

UI.setupQuestions = function (content){
    $('#action-buttons').append(
        ' <span class="col-xs-3"><button id="action-button-previous" class="btn btn-default btn-lg">Vorige</button></span>' +
        '<span class="col-xs-3"><button id="action-button-yes" class="btn btn-primary btn-lg">Ja</button></span>' +
        '<span class="col-xs-3"><button id="action-button-no" class="btn btn-primary btn-lg">Nee</button></span>' +
        '<span class="col-xs-3"><button id="action-button-skip" class="btn btn-default btn-lg">Overslaan</button></span>')

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

    renderPage();
};

UI.setupAttachmentStep = function(content) {
    content.append(
        '<div class="row" id="attachmentHeaders">' +
        '<div class="col-sm-4"><label>Bestandsnaam</label></div>' +
        '<div class="col-sm-6"><label>Commentaar</label></div>' +
        '<div class="col-sm-2"><br></div>' +
        '</div><div id="attachments"></div>');

    content.append(
        '<div id="buttons" class="row">' +
        '<span class="col-xs-8"><label class="btn btn-primary btn-file"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Toevoegen <input id="file" accept="application/pdf" type="file" multiple style="display: none;"> </label></span>' +
        '<span class="col-xs-4"><button id="action-button-removeAll" class="btn btn-primary"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>verwijder alle</button></span>' +
        '</div>');

    $('#action-button-removeAll')[0].addEventListener('click', function () {
        removeAllAttachments();
    });

    $('#file')[0].addEventListener('change', function () {
        addFile();
    });
};

UI.setupSign = function(content){
    content.append('<div class="panel panel-danger">' +
                    '<div class="panel-heading">' +
                         '<h3 class="panel-title">Opmerkingen!</h3>' +
                    '</div><div class="panel-body">' +
        '<p>* Indien u een gezamelijke aangifte indient, moeten uw echtgeno(o)t(e) en uzelf elk de aangifte ondertekenen.</p>' +
        '<p>* Als u de aangifte elektronisch indient, verstuur dan geen papieren versie meer.</p>' +
        '</div></div>');

    content.append('<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">ZOOMIT</h3>' +
        '</div><div class="panel-body">' +
        '<p>* info info info info info info info info info info info info info info</p>' +
        '<p>* info info info info info info info info info info info info info info</p>' +
        '<p>* info info info info info info info info info info info info info info</p>' +
        '<p>* info info info info info info info info info info info info info info</p>' +
        '<p>* info info info info info info info info info info info info info info</p>' +
        '</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik wens Zoomit te gebruiken.</label>' +
        '</div> </div></div>');

    content.append('<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Verantwoordingsstukken en juridische overeenkomsten</h3>' +
        '</div><div class="panel-body">' +
        'text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text'+
        '</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik ga akkoord met bovenstaande voorwaarden.</label>' +
        '</div> </div></div>');
    content.append('<div id="buttons" class="row"><span class="col-xs-4" id="download"><button id="action-button-download" class="btn btn-default btn-lg">Aangifte downloaden</button></span></div>');
};




/* Define a Content object within the UI object to hold static methods that operate on the actual content */
UI.Content = function () {
};

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

/* Set the additional attachments*/
UI.Content.setAttachments = function (value){
    var attachments = $('#attachments');
    for(var j = 0; j < value.length; j++){
        var rowValues = value[j];
        var rowContent = '<div class="row attachmentsRow">' +
            '<div class="col-sm-4 filenameContainer"><label class="filename">'+ rowValues[0] + '</label></div>';

        if(rowValues[1] != "")
            rowContent += '<div class="col-sm-7"><input type="text" class="form-control" onblur="updateComment(' + j + ', this.value)" value="' + rowValues[1] + '"></div>';
        else
            rowContent += '<div class="col-sm-6"><input type="text" class="form-control" onblur="updateComment(' + j + ', this.value)" value=""></div>';

        rowContent += '<div class="col-sm-2"><button id="action-button-remove" class="btn btn-default removeButton" onclick="removeAttachment(' + j + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Verwijder</button></div></div>';
        attachments.append(rowContent);
    }
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

/* Set the content to the given question */
UI.Content.setQuestion = function (value) {
    var content = $('#content');
    content.empty();
    content.append('<span class="question">' + value + '</span>');
};

