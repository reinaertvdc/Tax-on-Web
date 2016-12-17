// Define a UI object to hold static UI methods
function UI() {
}

// Set the conveyed synchronization state
UI.setSyncState = function (value) {
    var syncState = $('#sync-state');

    switch (value) {
        case Session.SYNC_STATES.SYNCED:
            syncState.text('Alle wijzigingen zijn opgeslagen.');
            break;
        case Session.SYNC_STATES.SYNCING:
            syncState.text('Wijzigingen aan het opslaan...');
            break;
        case Session.SYNC_STATES.OFFLINE:
            syncState.text('U bent offline, kan wijzigingen niet opslaan.');
            break;
    }
};

// Set the conveyed user names to the given array of names (must be of length 1 or 2)
UI.setUserNames = function (value) {
    var userNames = $('#user-names');

    userNames.empty();

    value.forEach(function (name) {
        userNames.append('<span class="navbar-text text-right">' + name + '</span>');
    });
};

// Set the conveyed current step to the step with the given number
UI.setCurrentStep = function (value) {
    var steps = $('#steps').children();

    steps.removeClass('current');
    steps.eq(value - 1).addClass('current');
};

// Set the conveyed progress to the given fraction (0 = 0%, 1 = 100%)
UI.setProgress = function (value) {
    var progressBar = $('#progress-bar').children();

    var percentage = Math.round(value * 100);

    progressBar.attr('aria-valuenow', percentage);
    progressBar.attr('style', 'width: ' + percentage + '%;');
    progressBar.children().text(percentage + '% voltooid');
};

// Set the 'actual content' of the page
UI.setContent = function (value) {
    var content = $('#content');

    content.empty();

    content.append(value);
};

// Create action buttons with the given properties (max. 4)
UI.setActionButtons = function (value) {
    var actionButtons = $('#action-buttons');

    var columnsPerButton = 12 / value.length;

    actionButtons.empty();

    value.forEach(function (button) {
        var onclick = button[0];
        var label = button[1];
        var style = 'btn-' + ((button.length >= 3) ? button[2] : 'default');

        actionButtons.append(
            '<span class="col-xs-' + columnsPerButton + '">' +
            '<button class="btn btn-lg ' + style + '" onclick="' + onclick + '">' + label + '</button>' +
            '</span>'
        );
    });
};
