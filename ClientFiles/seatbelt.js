import * as alt from 'alt';
import * as game from 'natives';

let gurtAngelegt = false;

function seatbelt(status) {
    if(!gurtAngelegt && alt.Player.local.vehicle != null) {
        gurtAngelegt = true;
        alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 2, 3500, "Du hast dir den Sicherheitsgurt angelegt.");
    }
    else {
        gurtAngelegt = false;
        alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 2, 3500, "Du hast dir den Sicherheitsgurt abgelegt.");
    };
};

alt.everyTick(() => {
    if (gurtAngelegt && alt.Player.local.vehicle != null) {
        game.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
        game.disableControlAction(0, 75, true); 
    } else {
        game.setPedConfigFlag(alt.Player.local.scriptID, 32, false);
        game.enableControlAction(0, 75, true);
    }
})

alt.onServer("Clientq8FqUh28kGTAELbX:seatbelt:onseatbelt", (status) => {
    seatbelt(status);
});