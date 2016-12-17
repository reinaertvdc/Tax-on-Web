// Define an object to act as the controller for this step
function Step3() {
}

// This method gets called when the session enters this step
Step3.run = function () {
    Step3.init();
};

// Initialize this step
Step3.init = function () {
    var remarks =
        '<div class="panel panel-danger">' +
        '<div class="panel-heading"><h3 class="panel-title">Opmerkingen!</h3></div>' +
        '<div class="panel-body"><ul>' +
        '<li>Indien u een gezamelijke aangifte indient, moeten uw echtgeno(o)t(e) en uzelf elk de aangifte ondertekenen.</li>' +
        '<li>Als u de aangifte elektronisch indient, verstuur dan geen papieren versie meer.</li>' +
        '</ul></div>' +
        '</div>';

    var zoomit =
        '<div class="panel panel-primary">' +
        '<div class="panel-heading"><h3 class="panel-title">Zoomit</h3></div>' +
        '<div class="panel-body"><ul>' +
        '<li>Deze gratis dienst is niet verplicht.</li>' +
        '<li><strong>Indien ik voor Zoomit kies, zal ik mijn papieren aanslagbiljet niet meer ontvangen.</strong></li>' +
        '<li>Ik bevestig dat ik het internetbankieren gebruik.</li>' +
        '<li>Ik bevestig tevens dat ik de gebruiksvoorwaarden en de juridische gevolgen met betrekking tot deze keuze, die ik steeds kan raadplegen via de <a href="http://financien.belgium.be/nl/particulieren/belastingaangifte/aanslagbiljet/#q7">website van de FOD Financiën</a>, heb gelezen en aanvaard.</li>' +
        '</ul></div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik wens mijn aanslagbiljet in de personenbelasting voortaan te ontvangen in mijn internetbankieren via Zoomit.</label>' +
        '</div></div></div>';

    var juridical =
        '<div class="panel panel-primary">' +
        '<div class="panel-heading"><h3 class="panel-title">Verantwoordingsstukken</h3></div>' +
        '<div class="panel-body">Gelieve hieronder aan te duiden of u de verantwoordingsstukken die in de bij de aangifte gevoegde toelichting opgenomen zijn, ter beschikking zult houden en hen op vraag van de administratie voor te leggen.</div>' +
        '<div class="panel-footer">' +
        '<div class="checkbox">' +
        '<label><input type="checkbox" value="">Ik hou de verantwoordingsstukken ter beschikking</label>' +
        '</div></div></div>';

    var download =
        '<button class="btn btn-default btn-lg">Aangifte downloaden</button>';

    Session.setContent(remarks + zoomit + juridical + download);

    Session.setPossibleActions([
        ['Session.previousStep();', 'Vorige', Session.ACTION_TYPES.SECONDARY],
        ['', 'Ondertekenen', Session.ACTION_TYPES.SECONDARY]
    ]);
};
