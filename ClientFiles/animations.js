import * as alt from 'alt';
import * as game from 'natives';
import { LocalStorage } from "alt";
const storage = LocalStorage.get();

function playAnimation(animDict, animName, duration, flag) {
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, duration, flag, 1, false, false, false);
        }
    }, 0);
}