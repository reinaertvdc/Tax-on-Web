// Define a session object to hold the state of the session
function Session() {
}

// List of possible synchronization states
Session.SYNC_STATES = {
    SYNCED: 'SYNCED',
    SYNCING: 'SYNCING',
    OFFLINE: 'OFFLINE'
};

// List of possible action types
Session.ACTION_TYPES = {
    PRIMARY: 'primary',
    SECONDARY: 'default',
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    DANGER: 'danger',
    LINK: 'link'
};

// List of steps that a session goes through
Session.STEPS = [
    Step1,
    Step2,
    Step3
];

// Id of the next attachment
Session.nextAttachmentId = 1;

// Initialize session properties
Session.attachments = new Map();
Session.syncState = Session.SYNC_STATES.SYNCED;
Session.progress = 0.3;

// Set the 'actual content' delivered to the user
Session.setContent = function (value) {
    if (typeof value !== 'string') {
        return false;
    }

    UI.setContent(value);

    return true;
};

// Set the possible actions the user can take (max. 4, of the form [callback, label, type])
Session.setPossibleActions = function (value) {
    if (!value.constructor === Array || value.length > 4) {
        return false;
    }
    value.forEach(function (action) {
        if (!action.constructor === Array || action.length != 3 ||
            typeof action[0] !== 'string' ||
            typeof action[1] !== 'string' ||
            action[2] in Session.ACTION_TYPES) {
            return false;
        }
    });

    UI.setActionButtons(value);

    return true;
};


// 'Synchronization state' methods

Session.getSyncState = function () {
    return Session.syncState;
};

Session.setSyncState = function (value) {
    if (!(value in Session.SYNC_STATES)) {
        return false;
    }

    Session.syncState = value;
    UI.setSyncState(value);

    return true;
};


// 'User names' methods

Session.getUserNames = function () {
    return Session.userNames;
};

Session.setUserNames = function (value) {
    if (!value.constructor === Array || value.length < 1 || value.length > 2) {
        return false;
    }

    Session.userNames = value;
    UI.setUserNames(value);

    return true;
};


// 'Current step' methods

Session.getCurrentStep = function () {
    return Session.currentStep;
};

Session.setCurrentStep = function (value) {
    if (!Number.isInteger(value) || value <= 0 || value > Session.STEPS.length + 1) {
        return false;
    }

    Session.currentStep = value;
    UI.setCurrentStep(value);

    Session.setContent('');
    Session.setPossibleActions([]);

    if (value == Session.STEPS.length + 1) {
        Session.setContent('<span class="question">Klaar!</span>');
        Session.setPossibleActions([]);
    } else {
        Session.STEPS[value - 1].run();
    }

    Session.updateProgress();

    return true;
};

Session.nextStep = function () {
    return Session.setCurrentStep(Session.getCurrentStep() + 1);
};

Session.previousStep = function () {
    return Session.setCurrentStep(Session.getCurrentStep() - 1);
};


// 'Progress' methods

Session.getProgress = function () {
    return Session.progress;
};

Session.setProgress = function (value) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
        return false;
    }

    Session.progress = value;
    UI.setProgress(value);

    return true;
};

Session.updateProgress = function () {
    var weight = 0;
    var weightCompleted = 0;

    Session.STEPS.forEach(function (step) {
        weight += step.getWeight();
        weightCompleted += step.getWeightCompleted();
    });

    Session.setProgress(weightCompleted / weight);
};


// 'Attachments' methods

Session.getAttachments = function () {
    return Session.attachments;
};

Session.addAttachment = function (value) {
    if (!value.constructor === Array || value.length != 2 ||
        typeof value[0] !== 'string' ||
        typeof value[1] !== 'string') {
        return false;
    }

    Session.attachments.set(Session.nextAttachmentId, value);

    Session.nextAttachmentId++;

    return Session.nextAttachmentId - 1;
};

Session.setAttachmentComment = function (id, value) {
    if (!Number.isInteger(id) || typeof value[0] !== 'string' || !Session.attachments.has(id)) {
        return false;
    }

    Session.attachments.get(id)[1] = value;

    return true;
};

Session.removeAttachment = function (key) {
    return Session.attachments.delete(key);
};

Session.clearAttachments = function () {
    Session.attachments.clear();

    return true;
};
