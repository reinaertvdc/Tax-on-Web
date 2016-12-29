// Define an object to act as the controller for this step
function Step3() {
}

// Indicate whether this step is completed
Step3.isCompleted = false;

// This method gets called when the session enters this step
Step3.run = function () {
    Step3.init();
};

// Undo all progress in this step
Step3.reset = function () {
    Step3.isCompleted = false;
};

// Get the estimated amount of work this step requires
Step3.getWeight = function () {
    return 3;
};

// Get the estimated amount of work already done in this step
Step3.getWeightCompleted = function () {
    if (Step3.isCompleted) {
        return Step3.getWeight();
    } else {
        return 0;
    }
};

// Initialize this step
Step3.init = function () {
    Step3.isCompleted = false;

    var remarks =
        '<div class="panel panel-danger">' +
        '<div class="panel-heading"><h3 class="panel-title">Opmerkingen</h3></div>' +
        '<div class="panel-body"><ul>' +
        '<li>Indien u een gezamelijke aangifte indient, moeten uw echtgeno(o)t(e) en uzelf elk de aangifte ondertekenen.</li>' +
        '<li>Als u de aangifte elektronisch indient, verstuur dan geen papieren versie meer.</li>' +
        '</ul></div>' +
        '</div>';

    var zoomit =
        '<div class="panel panel-info">' +
        '<div class="panel-heading"><h3 class="panel-title">Zoomit (optioneel)</h3></div>' +
        '<div class="panel-body"><ul>' +
        '<li>Zoomit is een gratis dienst in Internet en Mobile Banking waarmee u uw documenten zoals facturen, creditnota’s en loonbrieven snel en gemakkelijk afhandelt. U beslist zelf wanneer u betaalt en verliest dus minder tijd met uw geldzaken. Daarnaast bent u verlost van uw paperassen en helpt u het milieu een handje.</li>'+
        '<li>Indien u dus kiest voor zoomit zal u geen papieren aanslagbiljet ontvangen, maar alles ontvangen via e-mail.</li>' +
        '<li>Door onderstaande checkbox aan te vinken bevestigd u dat u vanaf nu gebruik zal maken van internetbankieren.</li>' +
        '<li>U bevestigt tevens dat u de gebruiksvoorwaarden en de juridische gevolgen met betrekking tot deze keuze, die u steeds kan raadplegen via de <a href="http://financien.belgium.be/nl/particulieren/belastingaangifte/aanslagbiljet/#q7">website van de FOD Financiën</a>, heb gelezen en aanvaard.</li>' +
        '</ul></div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input id="checkbox-zoomit" type="checkbox" value="" onchange="Step3.evaluate();">Ik wens mijn aanslagbiljet in de personenbelasting voortaan te ontvangen in mijn internetbankieren via Zoomit.</label>' +
        '</div></div></div>';

    var juridical =
        '<div class="panel panel-primary">' +
        '<div class="panel-heading"><h3 class="panel-title">Verantwoordingsstukken</h3></div>' +
        '<div class="panel-body">Gelieve hieronder aan te duiden of u de verantwoordingsstukken die in de bij de aangifte gevoegde toelichting opgenomen zijn, ter beschikking zult houden en hen op vraag van de administratie voor te leggen.</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input id="checkbox-conditions" type="checkbox" value="" onchange="Step3.evaluate();"><strong style="color: red;">*</strong> Ik hou de verantwoordingsstukken ter beschikking.</label>' +
        '</div></div></div>';

    var download =
        '<a href="docs/aangifte.pdf" download><button class="btn btn-default btn-lg btn-info">Aangifte downloaden</button></a>';

    Session.setContent(remarks + zoomit + juridical + download);

    Step3.evaluate();
};

Step3.evaluate = function () {
    var acceptZoomit = $('#checkbox-zoomit').is(':checked');
    var acceptConditions = $('#checkbox-conditions').is(':checked');

    if (acceptConditions) {
        Session.setPossibleActions([
            ['Session.previousStep();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
            ['Step3.isCompleted = true; Session.nextStep();', 'Ondertekenen', Session.ACTION_TYPES.PRIMARY]
        ]);
    } else {
        Session.setPossibleActions([
            ['Session.previousStep();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
            ['', 'Ondertekenen', Session.ACTION_TYPES.SECONDARY, false]
        ]);
    }
};
