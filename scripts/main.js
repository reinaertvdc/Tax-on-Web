// Configure the session
Session.setUserNames(['Erik Tienen', 'Tine van de Meent']);

// Start the session
Session.setCurrentStep(2);

/* you can fill in multiple of the same field for these questions */
var multipleFields = [288, 211, 255, 425];


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

function getFields (set, indentLvl){
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
            getFields(set[key], indentLvl + 1);
        }else {
            if(set[key] == 0)
                UI.Content.setSectionC(key, indentLvl);
            else
                UI.Content.addField(key, set[key], indentLvl);
        }
    }
}

function addSectionCField() {
    var content = $('#content');
    var fields = '<label class="indent'+ indentLvl +'">' + title + '</label>';
    fields += '<div class="row wizard-row indent'+ indentLvl +'">' +
        '<div class="col-sm-6"><label>Land</label></div>' +
        '<div class="col-sm-2"><label>Code</label></div>' +
        '<div class="col-sm-3"><label>Bedrag</label></div></div>';

    fields += '<div class="row wizard-row indent'+ indentLvl +'">' +
        '<div class="col-sm-6"><div class="bfh-selectbox bfh-countries" data-country="US"></div></div>' +
        '<div class="col-sm-2"><input type="number" class="form-control"></div>' +
        '<div class="col-sm-3"><input type="number" class="form-control"></div>' +
        '</div>';

    content.append(fields);
}

function addField (code) {
    var row = $("#" + code);

    $('<div class="row fieldRows"><div class="col-sm-8"></div><' +
        'div class="col-sm-1"><label>' + code + '</label></div><div class="col-sm-2">' +
        '<input type="number" class="form-control"></div></div>').insertAfter(row);

}

/* toggles the modal and set the right content (error message) */
function activateErrorModal(content){
    var modalContent = $('.modal-body');
    modalContent.empty();
    modalContent.append(content);
    $('#errorModal').modal('toggle');
}

/* Initialize the interface */
UI.setSyncState(Session.SYNC_STATES.SYNCED);
UI.setUserNames(['Erik Tienen', 'Tine van de Meent']);
UI.setCurrentStep(1);
//UI.setupQuestions($('#content'));
UI.setCodeFields("A. PENSIOENEN", "");
