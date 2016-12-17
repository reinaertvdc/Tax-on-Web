// Define an object to act as the controller for this step
function Step1() {
}

// This method gets called when the session enters this step
Step1.run = function () {
    Session.setPossibleActions([
        ['Step1.onActionPrevious();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['Step1.onActionYes();', 'Ja', Session.ACTION_TYPES.PRIMARY],
        ['Step1.onActionNo();', 'Nee', Session.ACTION_TYPES.PRIMARY],
        ['Step1.onActionSkip();', 'Overslaan', Session.ACTION_TYPES.SECONDARY]
    ]);

    Step1.setQuestion("Is het gelukt?");
};

// Convey the given question to the user
Step1.setQuestion = function (value) {
    Session.setContent('<span class="question">' + value + '</span>');
};


// Action callback methods

Step1.onActionPrevious = function () {

};

Step1.onActionYes = function () {

};

Step1.onActionNo = function () {

};

Step1.onActionSkip = function () {
    Session.nextStep();
};
