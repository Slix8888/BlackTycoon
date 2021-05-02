import * as alt from 'alt';
import * as native from 'natives';
import { hudBrowser } from './hud.js';
import {emitServer} from './server.js';

alt.setInterval(() => {
    if (!hudBrowser || alt.Player.local.getSyncedMeta("ADMINLEVEL") >= 3) return;
    if (native.getEntityAlpha(alt.Player.local.scriptID) <= 0 || !native.isEntityVisible(alt.Player.local.scriptID)) {
        emitServer("Serverq8FqUh28kGTAELbX:Utilities:BanMe", "Invisible Hack");
    }
}, 5000);
