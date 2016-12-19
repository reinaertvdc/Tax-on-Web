// Define an object to act as the controller for this step
function Step1() {
}

Step1.FLOW_ACTIONS = {
    PREVIOUS: 'PREVIOUS',
    YES: 'YES',
    NO: 'NO',
    NEXT: 'NEXT',
    SKIP: 'SKIP'
};

Step1.FLOW_TYPES = {
    QUESTION: 'QUESTION',
    CODE_FIELDS: 'CODE_FIELDS'
};

// Flow of questions and code fields
Step1.FLOW = [
    {
        type: Step1.FLOW_TYPES.QUESTION,
        text: 'Bent u werknemer in België, of werkt u voor een werkgever gevestigd in België?',
        yes: [
            {
                type: Step1.FLOW_TYPES.CODE_FIELDS,
                category: 'B. BEDRIJFSVOORHEFFING.',
                subcategory: ''
            },
            {
                type: Step1.FLOW_TYPES.QUESTION,
                text: 'Bent u blijvend arbeidsongeschikt, en ontvangt u hiervoor een vergoeding?',
                yes: [
                    {
                        type: Step1.FLOW_TYPES.CODE_FIELDS,
                        category: 'A. PENSIOENEN',
                        subcategory: '2. Arbeidsongevallen en beroepsziekten (wettelijke vergoedingen wegens blijvende ongeschiktheid).'
                    }
                ],
                no: []
            }
        ],
        no: []
    },
    {
        type: Step1.FLOW_TYPES.QUESTION,
        text: 'Doet u aan pensioensparen via een daarvoor geopende spaarrekening of spaarverzekering?',
        yes: [
            {
                type: Step1.FLOW_TYPES.CODE_FIELDS,
                category: 'A. PENSIOENEN',
                subcategory: '3. Pensioensparen.'
            },
            {
                type: Step1.FLOW_TYPES.CODE_FIELDS,
                category: 'A. PENSIOENEN',
                subcategory: '4. Niet ingehouden persoonlijke sociale bijdragen:'
            }
        ],
        no: []
    },
    {
        type: Step1.FLOW_TYPES.QUESTION,
        text: 'Ontvangt u pensioenen, anders dan uit pensioensparen en vergoedingen voor arbeidsongeschiktheid?',
        yes: [
            {
                type: Step1.FLOW_TYPES.CODE_FIELDS,
                category: 'A. PENSIOENEN',
                subcategory: '1. Andere dan de onder 2 en 3 bedoelde pensioenen.'
            },
            {
                type: Step1.FLOW_TYPES.QUESTION,
                text: 'Ontvangt u pensioenen van buitenlandse oorsprong?',
                yes: [
                    {
                        type: Step1.FLOW_TYPES.CODE_FIELDS,
                        category: 'C. PENSIOENEN VAN BUITENLANDSE OORSPRONG (EN DE DESBETREFFENDE KOSTEN).',
                        subcategory: ''
                    }
                ],
                no: []
            }
        ],
        no: []
    }
];

// Copy of the flow to work with
Step1.flow = JSON.parse(JSON.stringify(Step1.FLOW));

// Stack for keeping track of the current position in the flow
Step1.flowStack = [{series: Step1.flow, index: 0}];

// Queue for keeping track of the steps that still need to be done
Step1.flowQueue = [];

// This method gets called when the session enters this step
Step1.run = function () {
    Step1.flow.forEach(function(step) {
        Step1.flowQueue.push(step);
    });

    Step1.setUpCurrentStep();
};

// Set up the current step to enable the user to execute it
Step1.setUpCurrentStep = function () {
    if (Step1.flowQueue.length <= 0) {
        Step1.setQuestion('Klaar!');
        Session.setPossibleActions([]);

        return false;
    }

    currentStep = Step1.flowQueue[0];

    if (currentStep.type == Step1.FLOW_TYPES.QUESTION) {
        Step1.setQuestion(currentStep.text);
    } else {
        Step1.setCodeFields(currentStep.category, currentStep.subcategory);
    }
};

// Traverse the flow, possibly based on the given answer
Step1.traverseFlow = function (action) {
    if (Step1.flowStack.length <= 0) {
        return false;
    }

    if (action == Step1.FLOW_ACTIONS.SKIP) {
        Step1.flowQueue.push(Step1.flowQueue.shift());
    } else if (action == Step1.FLOW_ACTIONS.YES) {
        var currentStep = Step1.flowQueue.shift();

        if (currentStep.type == Step1.FLOW_TYPES.QUESTION) {
            for (var i = currentStep.yes.length - 1; i >= 0; i--) {
                Step1.flowQueue.unshift(currentStep.yes[i]);
            }
        }
    } else if (action == Step1.FLOW_ACTIONS.NO) {
        var currentStep = Step1.flowQueue.shift();

        if (currentStep.type == Step1.FLOW_TYPES.QUESTION) {
            for (var i = currentStep.no.length - 1; i >= 0; i--) {
                Step1.flowQueue.unshift(currentStep.no[i]);
            }
        }
    }

    Step1.setUpCurrentStep();
};

// Convey the given question to the user
Step1.setQuestion = function (value) {
    Session.setContent('<span class="question">' + value + '</span>');

    Session.setPossibleActions([
        ['Step1.traverseFlow(Step1.FLOW_ACTIONS.PREVIOUS);', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['Step1.traverseFlow(Step1.FLOW_ACTIONS.YES);', 'Ja', Session.ACTION_TYPES.PRIMARY],
        ['Step1.traverseFlow(Step1.FLOW_ACTIONS.NO);', 'Nee', Session.ACTION_TYPES.PRIMARY],
        ['Step1.traverseFlow(Step1.FLOW_ACTIONS.SKIP);', 'Overslaan', Session.ACTION_TYPES.SECONDARY]
    ]);
};

// Prompt the user to fill in the given code fields
Step1.setCodeFields = function (category, subcategory) {
    UI.setCodeFields(category, subcategory);

    Session.setPossibleActions([
        ['Step1.onActionPrevious();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['Step1.traverseFlow(Step1.FLOW_ACTIONS.SKIP);', 'Overslaan', Session.ACTION_TYPES.SECONDARY]
    ]);
};



































/* you can fill in multiple of the same field for these questions */
var multipleFields = [288, 211, 255, 425];

var infoIconCodes = ["_A_1", "_A_2", "_A_2_a", "_A_2_b", "_A_2_c2", "_A_3", "_A_4", "_B_1_a", "_B_1_b", "_B_2_a", "_B_2_b", "_C"];

var infoURL = "https://ccff02.minfin.fgov.be/towsimu/app/citizen/public/taxform/bookHelp.do?cadre=V&contentkey=application_help_0102#anchor";

/* every question has only 1 field */
var fields =
    {"A. PENSIOENEN": {
        "1. Andere dan de onder 2 en 3 bedoelde pensioenen.": {
            "a) Wettelijke pensioenen verkregen vanaf de wettelijke pensioenleeftijd:": 288,
            "b) Totaal van rubriek a:": 1228,
            "c) Achterstallen van onder a bedoelde wettelijke pensioenen:": 1230,
            "d) Overlevingspensioenen en overgangsuitkeringen:": 1229,
            "e) Achterstallen van overlevingspensioenen:": 1231,
            "f) Andere pensioenen, renten (behalve omzettingsrenten) en als zodanig geldende kapitalen, afkoopwaarden, enz., die gezamenlijk belastbaar zijn:": 211,
            "g) Totaal van rubriek f:": 1211,
            "h) Achterstallen van onder f bedoelde pensioenen, renten, enz.:": 1212,
            "i) Kapitalen en afkoopwaarden die afzonderlijk belastbaar zijn:": {
                "1° tegen 33% :": 1213,
                "2° tegen 20% :": 1245,
                "3° tegen 18% :": 1253,
                "4° tegen 16,5% :": {
                    "a. gekapitaliseerde waarde van wettelijke pensioenen verkregen vanaf de wettelijke pensioenleeftijd:": 1232,
                    "b. gekapitaliseerde waarde van overlevingspensioenen:": 1237,
                    "c. andere:": 1214
                },
                "5° tegen 10% :": 1215
            },

            "j) Omzettingsrenten van kapitalen en afkoopwaarden die zijn betaald of toegekend": {
                "1° in 2015:": 1216,
                "2° tijdens de jaren 2003 tot 2014:": 1218
            }
        },
        "2. Arbeidsongevallen en beroepsziekten (wettelijke vergoedingen wegens blijvende ongeschiktheid).": {
            "a) Uitkeringen, toelagen en renten (behalve omzettingsrenten):": 1217,
            "b) Achterstallen van onder a bedoelde uitkeringen:": 1224,
            "c) Omzettingsrenten van kapitalen betaald of toegekend:": {
                "1° in 2015:": 1226,
                "2° tijdens de jaren 2003 tot 2014:": 1227
            }
        },
        "3. Pensioensparen.": {
            "a) Pensioenen, renten, spaartegoeden, kapitalen en afkoopwaarden die gezamenlijk belastbaar zijn:": 1219,
            "b) Spaartegoeden, kapitalen en afkoopwaarden die afzonderlijk belastbaar zijn:": {
                "1° tegen 33% :": 1220,
                "2° tegen 16,5% :": 1221,
                "3° tegen 8% :": 1222
            }
        },
        "4. Niet ingehouden persoonlijke sociale bijdragen:": 1223
    },
        "B. BEDRIJFSVOORHEFFING.":
            {"1. Verrekenbaar en terugbetaalbaar":
                {"a) Verrekenbaar en terugbetaalbaar volgens fiches:": 255,
                    "b) Totaal van rubriek a:": 1225},

                "2. Verrekenbaar, maar niet terugbetaalbaar":
                    {"a) Verrekenbaar, maar niet terugbetaalbaar volgens fiches:" : 425,
                        "b) Totaal van rubriek a:": 1425}
            },
        "C. PENSIOENEN VAN BUITENLANDSE OORSPRONG (EN DE DESBETREFFENDE KOSTEN).": {
            "Vermeld het land, de code waarnaast ze zijn ingevuld (bv. 1211) en het bedrag van de hierboven vermelde pensioenen van buitenlandse oorsprong (en de desbetreffende kosten) waarvoor u aanspraak maakt op belastingvermindering voor inkomsten van buitenlandse oorsprong (pensioenen die zijn vrijgesteld van de personenbelasting, maar in aanmerking worden genomen voor de berekening van de belasting op uw andere inkomsten, of waarvoor de belasting tot de helft wordt verminderd).": 0
        }
    };




var result = 0;
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
        UI.Content.setNextPrevButton();
    }else if(currentStep == 3) {
        UI.setupSign(content);
        UI.Content.setSignButtons();
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

/* when values in the wizard change, check if the result field or the others need to be disabled */
function checkDisableWizard(element) {
    /* get all the children*/
    var rows = $('#wizard-rows');
    var children = rows[0].childNodes;
    var disableValue;

    if(element.value != ""){
        disableValue = true;
    }else {
        disableValue = false;
    }
    /* loop over the children en calculate there values */
    for(var i = 1; i < children.length; i++){
        /* get input field of the child */
        var childInfo = children[i].childNodes;
        childInfo[0].getElementsByTagName("input")[0].disabled = disableValue;
        childInfo[1].getElementsByTagName("input")[0].disabled = disableValue;
        childInfo[2].getElementsByTagName("input")[0].disabled = disableValue;
    }
}

/* update daycare wizard result field when there is a value that changed */
function updateResult() {
    result = 0;
    /* get all the children*/
    var rows = $('#wizard-rows');
    var children = rows[0].childNodes;

    /* loop over the children en calculate there values */
    for(var i = 1; i < children.length; i++){
        /* get input field of the child */
        var childInfo = children[i].childNodes;

        /* get the dagtarief and aantal dagen values */
        var value1 = childInfo[1].getElementsByTagName("input")[0].value;
        if (value1 < 0) {
            childInfo[1].getElementsByTagName("input")[0].value = 0;
            activateErrorModal('<p>U heeft een negatieve waarde ingevoerd. Er kunnen enkel positieve waarden gebruikt worden.</p>');
            return;
        }
        var re = /^[0-9]+([.,]?[0-9]+)?$/
        /* test if there is only one , or . */
        if(re.test(value1)){
            childInfo[1].getElementsByTagName("input")[0].value = 0;
            activateErrorModal('<p>U mag enkel een komma of een punt gebruiken de cijfers na de komma aan te geven. Er mogen ook geen spaties aanwezig zijn.</p>');
            return;
        }
        var value2 = childInfo[2].getElementsByTagName("input")[0].value;
        if (value2 < 0) {
            childInfo[2].getElementsByTagName("input")[0].value = 0;
            activateErrorModal('<p>U heeft een negatieve waarde ingevoerd. Er kunnen enkel positieve waarden gebruikt worden.</p>');
            return;
        }

        if (value2 != "" && value2 != parseInt(value2)) {
            childInfo[2].getElementsByTagName("input")[0].value = 0;
            activateErrorModal('<p>U mag enkel gehele getallen opgeven </p>');
            return;
        }

        /* max value of dagtarief is 11.20 */
        if(value1 > 11.20)
            value1 = 11.20;

        var sum =  value1 * value2;
        /* put the sum in the aftrekbaar bedrag field */
        childInfo[3].getElementsByTagName("input")[0].value = sum
        result += sum;
    }

    if(result > 0)
        $('#result')[0].disabled = true;
    else
        $('#result')[0].disabled = false;

    /* put result in result field */
    $('#result')[0].value = result;

}

function getFields (set, indentLvl, infoCode){
    var content = $('#content');
    for (var key in set) {
        /* check if there is a next niveau */
        if(isNaN(set[key])) {
            if(indentLvl == 0)
                content.append('<label class="indent'+ indentLvl +'">' + key + '</label>');
            else {
                content.append('<p class="indent' + indentLvl + '">' + key + '</p>');
            }
            /* get next niveau */
            getFields(set[key], indentLvl + 1, (infoCode + key.charAt(0)));
        }else {
            if(set[key] == 0)
                UI.Content.setSectionC(key, indentLvl);
            else
                UI.Content.addField(key, set[key], indentLvl);
        }
    }
}

function addField (code) {
    var row = $("#" + code);

    $('<div class="fieldRows indent">' +
        '<p class="field-label indent"></p>' +
        '<label class="field-code">' + code + '</label>' +
        '<input type="number" class="field-input  form-control">').insertAfter(row);

}

/* toggles the modal and set the right content (error message) */
function activateErrorModal(content){
    var modalContent = $('.modal-body');
    modalContent.empty();
    modalContent.append(content);
    $('#errorModal').modal('toggle');
}