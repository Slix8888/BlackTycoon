import * as alt from 'alt';
import * as game from 'natives';
import {emitServer} from './server.js';

let charcreatorBrowser = null;
let charcreatorCam = null;
let pedHandle = null;
let modelHash = null;

alt.onServer('Clientq8FqUh28kGTAELbX:Charcreator:CreateCEFq8FqUh28kGTAELbX', (player) => {
    if (charcreatorBrowser == null) {
        game.freezeEntityPosition(game.playerPedId(), true);
        game.triggerScreenblurFadeOut(0);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        game.setEntityAlpha(alt.Player.local.scriptID, 0, 0);
        game.triggerScreenblurFadeIn(1);
        charcreatorCam = game.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', 402.7, -1003, -98.6, 0, 0, 358, 18, true, 2);
        game.setCamActive(charcreatorCam, true);
        game.renderScriptCams(true, false, 0, true, false);
        charcreatorBrowser = new alt.WebView("http://resource/client/cef/charcreator/index.html");
        charcreatorBrowser.focus();

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:ChangeGender", (gender) => {
            game.triggerScreenblurFadeOut(0);
            charcreatorBrowser.emit("CEFq8FqUh28kGTAELbX:Charcreator:showArea", "creatorarea");

            if (gender == 0 || gender == false) {
                spawnCreatorPed(false);
            } else if (gender == 1 || gender == true) {
                spawnCreatorPed(true);
            }
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:cefIsReady", () => {
            alt.setTimeout(function() {
                charcreatorBrowser.emit("CEFq8FqUh28kGTAELbX:Charcreator:showArea", "sexarea");
            }, 1000);
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:SetRotation", (rot) => {
            game.setEntityHeading(pedHandle, rot);
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:UpdateFaceFeature", (facefeaturesdata) => {
            let facefeatures = JSON.parse(facefeaturesdata);

            for (let i = 0; i < 20; i++) {
                game.setPedFaceFeature(pedHandle, i, facefeatures[i]);
            }
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:UpdateHeadBlends", (headblendsdata) => {
            let headblends = JSON.parse(headblendsdata);
            game.setPedHeadBlendData(pedHandle, headblends[0], headblends[1], 0, headblends[2], headblends[5], 0, headblends[3], headblends[4], 0, 0);
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:UpdateHeadOverlays", (headoverlaysarray) => {
            let headoverlays = JSON.parse(headoverlaysarray);
            game.setPedHeadOverlayColor(pedHandle, 1, 1, parseInt(headoverlays[2][1]), 1);
            game.setPedHeadOverlayColor(pedHandle, 2, 1, parseInt(headoverlays[2][2]), 1);
            game.setPedHeadOverlayColor(pedHandle, 5, 2, parseInt(headoverlays[2][5]), 1);
            game.setPedHeadOverlayColor(pedHandle, 8, 2, parseInt(headoverlays[2][8]), 1);
            game.setPedHeadOverlayColor(pedHandle, 10, 1, parseInt(headoverlays[2][10]), 1);
            game.setPedEyeColor(pedHandle, parseInt(headoverlays[0][14]));
            game.setPedHeadOverlay(pedHandle, 0, parseInt(headoverlays[0][0]), parseInt(headoverlays[1][0]));
            game.setPedHeadOverlay(pedHandle, 1, parseInt(headoverlays[0][1]), parseFloat(headoverlays[1][1]));
            game.setPedHeadOverlay(pedHandle, 2, parseInt(headoverlays[0][2]), parseFloat(headoverlays[1][2]));
            game.setPedHeadOverlay(pedHandle, 3, parseInt(headoverlays[0][3]), parseInt(headoverlays[1][3]));
            game.setPedHeadOverlay(pedHandle, 4, parseInt(headoverlays[0][4]), parseInt(headoverlays[1][4]));
            game.setPedHeadOverlay(pedHandle, 5, parseInt(headoverlays[0][5]), parseInt(headoverlays[1][5]));
            game.setPedHeadOverlay(pedHandle, 6, parseInt(headoverlays[0][6]), parseInt(headoverlays[1][6]));
            game.setPedHeadOverlay(pedHandle, 7, parseInt(headoverlays[0][7]), parseInt(headoverlays[1][7]));
            game.setPedHeadOverlay(pedHandle, 8, parseInt(headoverlays[0][8]), parseInt(headoverlays[1][8]));
            game.setPedHeadOverlay(pedHandle, 9, parseInt(headoverlays[0][9]), parseInt(headoverlays[1][9]));
            game.setPedHeadOverlay(pedHandle, 10, parseInt(headoverlays[0][10]), parseInt(headoverlays[1][10]));
            game.setPedComponentVariation(pedHandle, 2, parseInt(headoverlays[0][13]), 0, 0);
            game.setPedHairColor(pedHandle, parseInt(headoverlays[2][13]), parseInt(headoverlays[1][13]));
        });

        charcreatorBrowser.on("Clientq8FqUh28kGTAELbX:Charcreator:SaveCharacter", (vorname, nachname, birthdate, gender, facefeaturesarray, headblendsdataarray, headoverlaysarray, clothesarray) => {
            game.clearPedProp(game.playerPedId(), 0);
            game.clearPedProp(game.playerPedId(), 1);
            game.clearPedProp(game.playerPedId(), 2);
            game.clearPedProp(game.playerPedId(), 6);
            game.clearPedProp(game.playerPedId(), 7);
            emitServer("Serverq8FqUh28kGTAELbX:Charcreator:CreateCharacter", vorname + " " + nachname, birthdate, gender, facefeaturesarray, headblendsdataarray, headoverlaysarray);
        });
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Charcreator:DestroyCEFq8FqUh28kGTAELbX", () => {
    destroycharcreatorBrowser();
});

alt.onServer("Clientq8FqUh28kGTAELbX:Charcreator:showError", (msg) => {
    if (charcreatorBrowser != null) {
        charcreatorBrowser.emit("CEFq8FqUh28kGTAELbX:Charcreator:showError", msg);
    }
});


alt.onServer("Clientq8FqUh28kGTAELbX:Charcreator:showArea", (area) => {
    if (charcreatorBrowser != null) {
        charcreatorBrowser.emit("CEFq8FqUh28kGTAELbX:Charcreator:showArea", area);
    }
});

function spawnCreatorPed(gender) {
    if (gender == true) {
        modelHash = game.getHashKey('mp_f_freemode_01');
        game.requestModel(modelHash);
    } else if (gender == false) {
        modelHash = game.getHashKey('mp_m_freemode_01');
        game.requestModel(modelHash);
    }
    let interval = alt.setInterval(function() {
        if (game.hasModelLoaded(modelHash)) {
            alt.clearInterval(interval);
            pedHandle = game.createPed(4, modelHash, 402.778, -996.9758, -100.01465, 0, false, true);
            game.setEntityHeading(pedHandle, 180.0);
            game.setEntityInvincible(pedHandle, true);
            game.disablePedPainAudio(pedHandle, true);
            game.freezeEntityPosition(pedHandle, true);
            game.taskSetBlockingOfNonTemporaryEvents(pedHandle, true);
        }
    }, 0);
}

let destroycharcreatorBrowser = function() {
    if (charcreatorBrowser != null) {
        charcreatorBrowser.destroy();
    }
    charcreatorBrowser = null;
    game.renderScriptCams(false, false, 0, true, false);
    game.setCamActive(charcreatorCam, false);
    if (charcreatorCam != null) {
        game.destroyCam(charcreatorCam, true);
    }
    if (pedHandle != null) {
        game.deletePed(pedHandle);
        pedHandle = null;
    }
    charcreatorCam = null;
    alt.showCursor(false);
}