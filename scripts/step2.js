// Define an object to act as the controller for this step
function Step2() {
}

// Indicate whether this step is completed
Step2.isCompleted = false;

// This method gets called when the session enters this step
Step2.run = function () {
    Step2.init();
};

// Undo all progress in this step
Step2.reset = function () {
    Session.clearAttachments();
    Step2.isCompleted = false;
};

// Get the estimated amount of work this step requires
Step2.getWeight = function () {
    return 5;
};

// Get the estimated amount of work already done in this step
Step2.getWeightCompleted = function () {
    if (Step2.isCompleted) {
        return Step2.getWeight();
    } else {
        return 0;
    }
};

// Initialize this step
Step2.init = function () {
    Step2.isCompleted = false;

    var comment =
    '<div class="panel panel-primary">' +
    '<div class="panel-heading"><h3 class="panel-title">Bijlagen</h3></div>' +
    '<div class="panel-body">'+
    '<p>Hier kunt u eventuele bijlagen toevoegen om uw aangifte te ondersteunen, zoals details van uw beroepskosten, attesten van hypothecaire leningen en individuele levensverzekering, enzovoort.</p>'+
    '<p>Enkel PDF-bestanden worden aanvaardt, dus andere formaten, zoals Word- en Excel-documenten, moet u omzetten alvorens u ze kunt meesturen.</p>'+
    '<p id="attachment-comment">Het is mogelijk dat u bepaalde bijlagen, toelichtingen of formulieren niet wilt (of niet kunt) toevoegen aan uw aangifte. U moet de bewijsstukken evenwel steeds bewaren met het oog op een eventuele vraag van de administratie.</p>';

    var headers =
        '<div id="attachments-headers">' +
        '<label id="attachments-header-name">Bestandsnaam</label>' +
        '<label id="attachments-header-comments">Commentaar</label>' +
        '</div>';

    var list =
        '<li id="attachments-list"></li>';

    var buttons =
        '<div id="attachments-buttons">' +
        '<label id="attachments-button-add" class="btn btn-primary btn-file" role="button"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Toevoegen<input id="input-add-attachment" accept="application/pdf" type="file" multiple style="display: none;" onchange="Step2.addAttachments();"></label>' +
        '<button id="attachments-button-remove-all" class="btn btn-primary" onclick="Step2.removeAllAttachments();"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Verwijder alle</button>' +
        '</div>';

    var closePanel = '</div></div>';

    Session.setContent(comment + headers + list + buttons + closePanel);

    var attachments = Session.getAttachments();
    var attachmentsIterator = attachments.entries();

    while (true) {
        var element = attachmentsIterator.next();

        if (element.done) {
            break;
        }

        attachment = element.value;

        Step2.renderAttachment(attachment[0], attachment[1]);
    }

    Session.setPossibleActions([
        ['Session.previousStep();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['Step2.isCompleted = true; Session.nextStep();', 'Volgende', Session.ACTION_TYPES.SECONDARY]
    ]);
};


// Attachments methods

Step2.removeAttachment = function (id) {
    Session.removeAttachment(id);
    $('#attachment-' + id).remove();
};

Step2.removeAllAttachments = function () {
    Session.clearAttachments();
    $('#attachments-list').empty();
};

Step2.addAttachments = function () {
    var files = $('#input-add-attachment').prop('files');

    for (var i = 0; i < files.length; i++) {
        var fileName = files[i].name.replace(/^.*[\\\/]/, '');
        var comments = '';
        var attachment = [fileName, comments];

        var id = Session.addAttachment(attachment);

        Step2.renderAttachment(id, attachment);
    }

    document.getElementById("input-add-attachment").value = null;
};

Step2.renderAttachments = function () {
    $('#attachments-list').empty();
    UI.Content.setAttachments(attachments);
};

Step2.renderAttachment = function (id, value) {
    var name = value[0];
    var comments = value[1];

    $('#attachments-list').append(
        '<li id="attachment-' + id + '">' +
        '<label class="filename">' + name + '</label>' +
        '<input type="text" class="form-control" onchange="Session.setAttachmentComment(' + id + ', this.value);" value="' + comments + '"></div>' +
        '<button class="btn btn-default" onclick="Step2.removeAttachment(' + id + ');"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Verwijder</button>' +
        '</li>'
    );
};
