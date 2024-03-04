// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {Utils} from "./Utils";
import {GameConfig} from "./config/GameConfig";

cc.Class({
    extends: cc.Component,
    _gameState: null,
    properties: {
        labelMoney: {
            default: null,
            type: cc.Node
        },
        labelFlyingMoney: {
            default: null,
            type: cc.Node,
        },
        labelTitleMoney: {
            default: null,
            type: cc.Node,
        },
        mainCamera: {
            default: null,
            type: cc.Node,
        },
        buttonHook: {
            default: null,
            type: cc.Node,
        },
        buttonPause: {
            default: null,
            type: cc.Node,
        },
        popUpStartLevel: {
            default: null,
            type: cc.Node,
        },
        popUpEndLevel: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._mainMenuCameraY = 350;
        this._inGameCameraY = 0;
        this.mainCamera.y = this._mainMenuCameraY;
        this._gameState = null;
    },

    addPrice: function (playerMoney, price) {
        if (price === 0) return;
        this._playerMoney = playerMoney;
        this.flyMoney(price);
    },

    flyMoney: function (price) {
        Utils.setNodeString(this.labelFlyingMoney, "+$" + price);
        this.labelFlyingMoney.stopAllActions();
        this.labelFlyingMoney.setPosition(this.labelFlyingMoney._originPos);
        let posTo = cc.v2(this.labelFlyingMoney._originX, this.labelFlyingMoney._originY + 50);
        this.labelFlyingMoney.active = true;
        const callback = function () {
            this.labelFlyingMoney.active = false;
            this.animLabelMoney();
        }.bind(this);
        // this.labelFlyingMoney.setPosition(posTo);
        this.labelFlyingMoney.setScale(1);
        this.labelFlyingMoney.runAction(
            cc.sequence(
                cc.moveTo(1, posTo).easing(cc.easeOut(2)),
                cc.delayTime(0.5),
                cc.spawn(
                    cc.jumpTo(0.4, this.labelMoney.getPosition(), -50, 1),
                    cc.scaleTo(0.4, 0.4)
                ),
                cc.callFunc(callback)
            )
        );
    },

    loadLevel: function () {
        this.labelFlyingMoney.active = false;
        this.labelFlyingMoney.stopAllActions();
        Utils.setNodeString(this.labelMoney, "$" + this._playerMoney);
    },

    animLabelMoney: function () {
        this.labelMoney.runAction(
            cc.sequence(
                cc.scaleTo(0.2, 1.2),
                cc.scaleTo(0.1, 1)
            )
        )
        Utils.setNodeString(this.labelMoney, "$" + this._playerMoney);
    },

    start() {
        this.setInGameLabel(false);
        this._playerMoney = 0;
        Utils.setNodeString(this.labelMoney, "$0");
        Utils.storeNodeOrigin(this.labelFlyingMoney);
    },

    setInGameLabel: function (value) {
        this.labelFlyingMoney.active = value;
        this.labelMoney.active = value;
        this.labelTitleMoney.active = value;
    },

    setGameState: function (gameState) {
        switch (gameState) {
            case GameConfig.GAME_STATE.START:
            case GameConfig.GAME_STATE.PAUSE:
                this.labelMoney.active = true;
                this.labelTitleMoney.active = true;
                this.buttonPause.active = true;
                break;
            case GameConfig.GAME_STATE.MAIN_MENU:
                this.buttonPause.active = false;
                this.setInGameLabel(false);
                this.moveCamera(this._mainMenuCameraY);
                break;
            default:
            case GameConfig.GAME_STATE.START_LEVEL:
                if (this._gameState == null || this._gameState === GameConfig.GAME_STATE.MAIN_MENU) {
                    this.moveCamera(this._inGameCameraY, function () {
                        this.showPopUpStartLevel();
                    }.bind(this));
                } else {
                    this.scheduleOnce(this.showPopUpStartLevel.bind(this), 0.5);
                }
                this.buttonPause.active = false;
                this.setInGameLabel(false);
                break;
            case GameConfig.GAME_STATE.END_LEVEL:
                this.buttonPause.active = true;
                this.setInGameLabel(true);
                Utils.showPopUpFromNode(this.popUpEndLevel);
                break;
        }
        this._gameState = gameState;
    },

    showPopUpStartLevel: function () {
        Utils.showPopUpFromNode(this.popUpStartLevel);
        this.popUpStartLevel.getComponent("PopUpStartLevel").setInfo();
    },

    moveCamera: function (toPosY, callback) {
        if (this.mainCamera.y === toPosY) return;
        var callFunc = (callback == null) ? cc.callFunc() : cc.callFunc(callback);
        this.mainCamera.runAction(
            cc.sequence(
                cc.moveTo(0.8, this.mainCamera.x, toPosY).easing(cc.easeInOut(2)),
                callFunc
            )
        )
    },

    // update (dt) {},
});
