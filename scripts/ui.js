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
        '<p>- Indien u een gezamelijke aangifte indient, moeten uw echtgeno(o)t(e) en uzelf elk de aangifte ondertekenen.</p>' +
        '<p>- Als u de aangifte elektronisch indient, verstuur dan geen papieren versie meer.</p>' +
        '<p>- Uw persoonsgegevens worden door de FOD Financiën verwerkt in overeenstemming met de wet van 8 december 1992 en met de andere in voege zijnde wetten. Bijkomende inlichtingen met betrekking tot dit onderwerp vindt u ' +
        '<a href="https://ccff02.minfin.fgov.be/towsimu/app/citizen/public/taxform/help.do?contentkey=application_help_0605" target="_blank">hier.</a></p>' +
        '</div></div>');

    content.append('<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Zoomit</h3>' +
        '</div><div class="panel-body">' +
        '<p>U kan uw aanslagbiljet in de personenbelasting voortaan ontvangen in uw internetbankieren via Zoomit.</p>'+
        '<p>- Deze gratis dienst is niet verplicht.</p>' +
        '<p>- Indien ik voor Zoomit kies, zal ik mijn papieren aanslagbiljet niet meer ontvangen.</p>' +
        '<p>- Ik bevestig dat ik het internetbankieren gebruik.</p>' +
        '<p>- Ik bevestig tevens dat ik de gebruiksvoorwaarden en de juridische gevolgen met betrekking tot deze keuze, die ik steeds kan raadplegen via de <a href="http://financien.belgium.be/nl/particulieren/belastingaangifte/aanslagbiljet/#q7" target="_blank">website van de FOD Financiën</a>, heb gelezen en aanvaard.</p>' +
        '</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik wens Zoomit te gebruiken.</label>' +
        '</div></div></div>');

    content.append('<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Verantwoordingsstukken en juridische overeenkomsten</h3>' +
        '</div><div class="panel-body">' +
        '<p>- Gelieve hieronder aan te duiden of u de verantwoordingsstukken die in de bij de aangifte gevoegde toelichting opgenomen zijn, ter beschikking zult houden en hen op vraag van de administratie voor te leggen.</p>' +
        '</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik ga akkoord met bovenstaande voorwaarden.</label>' +
        '</div></div></div>');
    content.append('<div class="row buttons"><span class="col-xs-4" id="download"><a href="docs/aangifte.pdf" download><button id="action-button-download" class="btn btn-primary btn-lg">Aangifte downloaden</button></a></form></span></div>');
};

UI.setDayCareWizard = function () {
    var content =
        '<div class="panel panel-primary">' +
        '<div class="panel-heading">' +
        '<h3 class="panel-title">Aftrekbaar bedrag van de uitgaven voor opvang van kinderen.</h3>' +
        '</div><div class="panel-body">' +
            '<div id="wizard-comments">' +
        '<p>- Geef voor elk kind de prijs van de opvang per dag en het aantal dagen in. (Per opvangdag en per kind mag dat bedrag evenwel niet hoger zijn dan 11,20 EUR).</p>' +
        '<p>- Als u het dagtarief niet kent, vul dan het aantal dagen en het betaalde bedrag in.</p>' +
        '<p>- Verschillende opvangen tijdens dezelfde dag worden als 1 opvangdag gerekend, tel de betaalde bedragen voor deze opvangdag samen.</p></div>' +
        '<div id="wizard-rows">' +
        '<div class="row wizard-row">' +
        '<div class="col-sm-4"><label>Naam en voornaam</label></div>' +
        '<div class="col-sm-2"><label>Dagtarief</label></div>' +
        '<div class="col-sm-2"><label>Aantal dagen</label></div>' +
        '<div class="col-sm-2"><label>Aftrekbaar bedrag</label></div>' +
        '<div class="col-sm-2 checkbox-label"><label>jonger dan 3</label></div></div>';

    if(Object.keys(childrenInfo).length > 0) {
        for (var key in childrenInfo) {
            var info = childrenInfo[key];
            content +=
                '<div class="row wizard-row" id="'+key+'">' +
                '<div class="col-sm-4"><input type="text" class="form-control" value="' + info[0] + '" oninput="saveChildInfo(this.parentNode.parentNode)"></div>' +
                '<div class="col-sm-2"><input type="text" class="form-control" value="' + info[1] + '" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveDouble(this)" min="0"></div>' +
                '<div class="col-sm-2"><input type="number" class="form-control" value="' + info[2] + '" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveInteger(this)" min="0" step="1"></div>' +
                '<div class="col-sm-2"><input type="number" class="form-control" value="' + info[3] + '" disabled></div>' +
                '<div class="col-sm-2 checkbox-container"><input type="checkbox" class="wizard-checkbox" onclick="saveChildInfo(this.parentNode.parentNode)" value="" ';

            if(info[4])
                content += 'checked></div></div>';
            else
                content += '></div></div>';
        }
    }else
        content +=
        '<div class="row wizard-row" id="childRow0">' +
        '<div class="col-sm-4"><input type="text" class="form-control" oninput="saveChildInfo(this.parentNode.parentNode)"></div>' +
        '<div class="col-sm-2"><input type="text" class="form-control" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveDouble(this)" min="0"></div>' +
        '<div class="col-sm-2"><input type="number" class="form-control" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveInteger(this)" min="0" step="1"></div>' +
        '<div class="col-sm-2"><input type="number" class="form-control" value="0" disabled></div>' +
        '<div class="col-sm-2 checkbox-container"><input type="checkbox" class="wizard-checkbox" onclick="saveChildInfo(this.parentNode.parentNode)" value="" ></div></div>';

    content +=
        '</div><div id="action-buttons-wizard" ><button id="action-button-addChild" class="btn btn-primary"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span>Kind toevoegen</button></form>' +
        '<button id="wizard-button-remove-all" class="btn btn-primary" onclick="removeAllchildren()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>Verwijder alle</button></div></div>' +

        '<div class="panel-footer">' +
        '<div class="pull-right"><label id="resultLabel">1384</label><input id="result" type="number" class="form-control" oninput="checkDisableWizard();" min="0" value="' + result + '"></div><div class="clearfix"></div>'+
    '</div></div>';

    UI.setContent(content);

    if(Object.keys(childrenInfo).length > 0)
        $('#result')[0].disabled = true;
    else if(result > 0) {
        checkDisableWizard();
    }


    $('#action-button-addChild')[0].addEventListener('click', function () {
        UI.Content.addChild();
    });
};

/* set category name and gets the needed sections */
UI.setCodeFields = function (category, section) {
    var content = $('#content');
    var sectionsFields = {};
    var infoCode = "_" + category.charAt(0); /* this variable holds the code for a infobButton */

    content.empty();
    content.append('<h3>'+ category +'</h3>');

    if(section == ""){
        sectionsFields = fields[category];
    }else {
        sectionsFields[section] = fields[category][section];
    }

    getFields(sectionsFields, 0, infoCode);
};

/* Define a Content object within the UI object to hold static methods that operate on the actual content */
UI.Content = function () {
};

/* set the UI elements for section c of the retirement compartment */
UI.Content.setSectionC = function (title, indentLvl, infoCode) {
    var content = $('#content');
    var fields = '';
    fields = '<div class="fieldRows indent'+ indentLvl + '">';
    fields += '<button type="button" class="field-info-button btn btn-primary btn-xs btn-round" onclick="window.open(\''+ infoURL + infoCode +'\',\'\', \'width=700, height=500\');"><span class="glyphicon glyphicon-info-sign"></span></button>';
    fields += '<label class="indent' + indentLvl + '">' + title + '</label>';
    fields += '</div>';
    fields += '<div id="sectionc-container">';
    fields += '<div class="row wizard-row indent'+ indentLvl +'">' +
        '<div class="col-sm-4"><label>Land</label></div>' +
        '<div class="col-sm-3"><label>Code</label></div>' +
        '<div class="col-sm-4"><label>Bedrag</label></div></div>';

    if(Object.keys(sectionCValues).length > 0) {
        var i = 0;
        for (var key in sectionCValues) {
            var info = sectionCValues[key];
            fields += '<div class="row wizard-row indent'+ indentLvl +'" id="'+ key +'">' +
                '<div class="col-sm-4"><div class="flagstrap select_country" data-input-name="NewBuyer_country" data-selected-country="'+info[0]+'"></div></div>' +
                '<div class="col-sm-3"><input type="number" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveInteger(this)" value="'+info[1]+'"></div>' +
                '<div class="col-sm-4"><input type="text" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveDouble(this)" value="'+info[2]+'"></div>';
            if(i == 0){
                fields +=  '<div class="col-sm-1"><button type="button" class="btn btn-primary btn-xs btn-round" onclick="UI.Content.addFieldSectionC()"><span class="glyphicon glyphicon-plus"></span></button></div>';
                i++;
            }

            fields += "</div>";
        }
    }else{
        fields += '<div class="row wizard-row indent'+ indentLvl +'" id="sectionCRow1">' +
            '<div class="col-sm-4"><div class="flagstrap select_country" data-input-name="NewBuyer_country" data-selected-country="US"></div></div>' +
            '<div class="col-sm-3"><input type="number" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveInteger(this)"></div>' +
            '<div class="col-sm-4"><input type="text" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveDouble(this)"></div>' +
            '<div class="col-sm-1"><button type="button" class="btn btn-primary btn-xs btn-round" onclick="UI.Content.addFieldSectionC()"><span class="glyphicon glyphicon-plus"></span></button></div></div>';
    }

    fields += '</div>';
    content.append(fields);
    $(document).ready(function () {
        $('.select_country').flagStrap({
            onSelect: function (value, element) {
                saveSectionCValues(element.parentNode.parentNode.parentNode)
            }
        });
    });



};

/* add new row for country selection in Section C */
UI.Content.addFieldSectionC = function() {
    var content = $('#sectionc-container');
    numberOfSectionValues++;
    var fields = '<div class="row wizard-row" id="sectionCRow' + numberOfSectionValues +'" >' +
        '<div class="col-sm-4"><div class="flagstrap select_country" data-input-name="NewBuyer_country" data-selected-country="US"></div></div>' +
        '<div class="col-sm-3"><input type="number" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveInteger(this)"></div>' +
        '<div class="col-sm-4"><input type="text" class="form-control" oninput="saveSectionCValues(this.parentNode.parentNode); testOnPositiveDouble(this)"></div>' +
        '</div>';
    content.append(fields);

    /* this action is needed to view the country picker*/
    $(document).ready(function () {
        $('.select_country').flagStrap({
            onSelect: function (value, element) {
                saveSectionCValues(element.parentNode.parentNode.parentNode)
            }
        });
    });
};

/* add question with the right field */
UI.Content.addField = function (title, code, indentLvl, infoCode){
    /* number of extra added fields of a specific code */
    var inputFieldId = code + "-0";
    var content = $('#content');

    var fields = '<div class="fieldRows indent'+ indentLvl + '" id="row'+ inputFieldId +'">';

    if (infoIconCodes.indexOf(infoCode) > -1) {
        fields += '<button type="button" class="field-info-button btn btn-primary btn-xs btn-round" onclick="window.open(\''+ infoURL + infoCode +'\',\'\', \'width=700, height=500\');"><span class="glyphicon glyphicon-info-sign"></span></button>'
    }

    if(indentLvl == 0)
        fields += '<label class="field-label">' + title +'</label>';
    else
        fields += '<p class="field-label">' + title +'</p>';

    fields += '<label class="field-code">' + code + '</label>';

    /* check if there was a value saved for this code */
    if(inputFieldId in fieldValues) {
        fields += '<input type="text" id="'+inputFieldId+'" class="field-input form-control" oninput="saveFieldValue( this.id, this.value); testOnPositiveDouble(this)" value="' + fieldValues[inputFieldId] + '">';
    }else{
        fields += '<input type="text" id="'+inputFieldId+'" class="field-input form-control" oninput="saveFieldValue( this.id, this.value); testOnPositiveDouble(this)" value="">';
    }

    if(multipleFields.indexOf(code) > -1){
        fields += '<button type="button" class="field-add-button btn btn-primary btn-xs btn-round" onclick="addField('+ code +')"><span class="glyphicon glyphicon-plus"></span></button>'
    }

    fields += '</div>';

    content.append(fields);

    /* append all the extra added fields of a code */
    setAddedFields(code);
};

UI.Content.setSignButtons = function () {
    var buttons = $('#action-buttons');
    buttons.empty();
    buttons.append('<span class="col-xs-6"><button id="action-button-previous" class="btn btn-default btn-lg">Vorige</button></span>');
    buttons.append('<span class="col-xs-6"><a href="https://eservices.minfin.fgov.be/taxonweb/app/citizen/public/taxbox/home.do;TAXONWEB_JSESSIONID=hkyWYTfFynBX2LR8vKy0zT182vnF6LjcpK9jDzTf9Zcf28vpwxxl!-1768414502"><button id="action-button-sign" class="btn btn-primary btn-lg">Ondertekenen</button></a></span>');
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
        var enabled = button.length >= 4 ? button[3] : true;

        actionButtons.append(
            '<span class="col-xs-' + columnsPerButton + '">' +
            '<button class="btn btn-lg ' + style + (enabled ? '' : ' disabled') + '" onclick="' + onclick + '">' + label + '</button>' +
            '</span>'
        );
    });
};
/* Add a child row in the wizard */
UI.Content.addChild = function () {
    numberOfChildren++;
    var wizard = $('#wizard-rows');
    wizard.append(
        '<div class="row wizard-row" id="childRow'+numberOfChildren+'">' +
        '<div class="col-sm-4"><input type="text" class="form-control" oninput="saveChildInfo(this.parentNode.parentNode)"></div>' +
        '<div class="col-sm-2"><input type="text" class="form-control" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveDouble(this)" min="0"></div>' +
        '<div class="col-sm-2"><input type="number" class="form-control" oninput="updateResult(); saveChildInfo(this.parentNode.parentNode); testOnPositiveInteger(this)" min="0" step="1"></div>' +
        '<div class="col-sm-2"><input type="number" class="form-control" value="0" disabled></div>' +
        '<div class="col-sm-2 checkbox-container"><input type="checkbox" class="wizard-checkbox" onclick="saveChildInfo(this.parentNode.parentNode)" value="" ></div></div>'
    );
};



