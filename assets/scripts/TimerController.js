// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {GameConfig} from "./config/GameConfig";
import {Utils} from "./Utils";
import {g_gameController} from "./GameController";

cc.Class({
    extends: cc.Component,

    properties: {
        imageClock: {
            default: null,
            type: cc.Node,
        },
        labelCountdown: {
            default: null,
            type: cc.Node,
        },
        countDownHandler: {
            default: null,
            type: cc.Component.EventHandler
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.loadLevel();
    },

    loadLevel: function () {
        this._currentTime = GameConfig.LEVEL_COUNTDOWN;
    },

    setGameState: function (gameState) {
        switch (gameState) {
            case GameConfig.GAME_STATE.START:
                this._isCountDown = true;
                this.node.active = true;
                break;
            case GameConfig.GAME_STATE.PAUSE:
                this._isCountDown = false;
                this.node.active = true;
                break;
            case GameConfig.GAME_STATE.MAIN_MENU:
            case GameConfig.GAME_STATE.START_LEVEL:
            case GameConfig.GAME_STATE.END_LEVEL:
            default:
                this._isCountDown = false;
                this.node.active = false;
                break;
        }
    },

    update (dt) {
        if (this._isCountDown) {
            if (this._currentTime > 0) {
                Utils.setNodeString(this.labelCountdown, Math.ceil(this._currentTime));
                this._currentTime -= dt;
            } else {
                this.countDownHandler.emit();
            }
        }
    },
});
