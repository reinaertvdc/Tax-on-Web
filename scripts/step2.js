// Define an object to act as the controller for this step
function Step2() {
}

// This method gets called when the session enters this step
Step2.run = function () {
    Step2.init();
};

// Initialize this step
Step2.init = function () {
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

    Session.setContent(headers + list + buttons);

    Session.setPossibleActions([
        ['Session.previousStep();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['Session.nextStep();', 'Volgende', Session.ACTION_TYPES.SECONDARY]
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
