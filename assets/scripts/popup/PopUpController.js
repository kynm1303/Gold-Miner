import {g_gameController} from "../GameController";
import {GameConfig} from "../config/GameConfig";

cc.Class({
    extends: cc.Component,
    fog: null,
    properties: {
        showEvent: {
            default: null,
            type: cc.Component.EventHandler,
        },
        hideEvent: {
            default: null,
            type: cc.Component.EventHandler,
        }
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

    onLoad () {
        this.node.active = true;
        this.fog = this.node.getChildByName("Fog");
        this.panel = this.node.getChildByName("PanelWrap");
    },

    start() {
    },

    showPopUp: function (delay) {
        this.node.active = true;
        if (this.showEvent) {
            this.showEvent.emit();
        }
        if (delay == null) {
            delay = 0;
        }
        var delayAction = cc.delayTime(delay);
        this.panel.stopAllActions();
        cc.log('show Pop Up');
        this.panel.setScale(0);
        this.panel.runAction(
            cc.sequence(
                delayAction,
                cc.spawn(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.2),
                        cc.scaleTo(0.05, 1)
                    ),
                    cc.fadeTo(0.1, 255)
                )
            )
        )
    },

    hidePopUp: function () {
        cc.log('hidePopUp');
        if (this.hideEvent) {
            this.hideEvent.emit();
        }
        this.panel.stopAllActions();
        this.panel.runAction(
            cc.sequence(
                cc.spawn(
                    cc.sequence(
                        cc.scaleTo(0.05, 1.2),
                        cc.scaleTo(0.2, 0)
                    ),
                    cc.fadeTo(0.2, 255)
                ),
                cc.callFunc(function () {
                    this.node.active = false;
                }.bind(this))
            )
        )
    },

    onResumeButtonPressed: function () {
        this.hidePopUp();
    },

    onMenuButtonPressed: function () {
        this.hidePopUp();
        g_gameController.setGameState(GameConfig.GAME_STATE.MAIN_MENU);
    },

    // update (dt) {},
});

