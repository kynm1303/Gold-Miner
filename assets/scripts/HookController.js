// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {GameConfig} from "./config/GameConfig";
import {AnimConfig} from "./config/AnimConfig";
import {g_gameController} from "./GameController";
let {getGameManager} = require("./config/Global");

const HOOK_STATE = {
    NOT_HOOKING: 0,
    HOOK_START: 1,
    HOOK_BACK: 2
}

const COLLIDER_TAG = {
    HOOK: 0,
    MINING_OBJECT: 1,
}

cc.Class({
    extends: cc.Component,

    properties: {
        hookHead: {
            default: null,
            type: cc.Node,
        },
        hookEndEventHandler: {
            default: null,
            type: cc.Component.EventHandler
        },
        hookSpriteClose: {
            default: null,
            type: cc.Node,
        },
        hookSpriteOpen: {
            default: null,
            type: cc.Node,
        },
        hookRope: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._rotateRange = 75;
        this._hookSpeed = 400;
        this._hookHeadBaseY = this._hookHeadBaseY || this.hookHead.y;
        this._hookRopeBaseWidth = this._hookRopeBaseWidth || this.hookRope.width;
        this.hookHead.getComponent("HookHeadController").setCollisionCallback(this.onHookCollide, this);
    },

    start() {
        this.initHook();
    },

    initHook: function () {
        this._rotateTime = 0;
        this._hookObjects = [];
        this.setHookState(HOOK_STATE.NOT_HOOKING);
        this.hookHead.y = this._hookHeadBaseY;
        this.hookRope.width = this._hookRopeBaseWidth;
        this.clearHookObjects();
        this.node.angle = 0;
    },

    setHookState: function (hookState) {
        this._hookState = hookState;
    },

    onActionHook: function () {
        if (getGameManager().gameState === GameConfig.GAME_STATE.START)
            this._hookState = HOOK_STATE.HOOK_START;
    },

    setHookSprite: function (isOpen) {
        this.hookSpriteClose.active = !isOpen;
        this.hookSpriteOpen.active = isOpen;
    },

    getHookWeight: function () {
        let weightSum = 0;
        for(let hookedObject of this._hookObjects) {
            weightSum += hookedObject.getComponent("MiningObjectController").Mass;
        }
        return weightSum;
    },

    updateHook: function (dt) {
        this.setHookSprite(true);
        switch (this._hookState) {
            case HOOK_STATE.HOOK_START:
                if (!this.isOutRange()) {
                    this.moveHookHead( -this._hookSpeed * dt)
                } else {
                    this.setHookState(HOOK_STATE.HOOK_BACK);
                }
                break;
            case HOOK_STATE.HOOK_BACK:
                if (this.hookHead.y > this._hookHeadBaseY) {
                    this.hookEnd();
                } else {
                    this.moveHookHead(this._hookSpeed * dt);
                }
                this.setHookSprite(false);
                break;
            case HOOK_STATE.NOT_HOOKING:
            default:
                break;
        }
    },

    moveHookPack: function () {
        for (let object of this._hookObjects) {
            object.setPosition(this.getHookHeadGlobalPos());
        }
    },

    hookEnd: function (isCancel) {
        this.hookHead.y = this._hookHeadBaseY;
        this.hookRope.width = this._hookRopeBaseWidth;
        this.setHookState(HOOK_STATE.NOT_HOOKING);

        let priceSum = 0;
        for(let hookedObject of this._hookObjects) {
            priceSum += hookedObject.getComponent("MiningObjectController").Price;
            if (hookedObject.getParent() != null) {
                hookedObject.removeFromParent(true);
            }
        }
        // cc.log("HookController", "hookEnd", priceSum);
        if (isCancel) {

        } else {
            this.hookEndEventHandler.emit([priceSum]);
        }
        this._hookObjects = [];
    },

    clearHookObjects: function () {
        for(let hookedObject of this._hookObjects) {
            if (hookedObject.getParent() != null) {
                hookedObject.removeFromParent(true);
            }
        }
        this._hookObjects = [];
    },

    moveHookHead: function (deltaY) {
        let speedRatio = 1;
        const hookWeight = this.getHookWeight();
        if (hookWeight !== 0)
            speedRatio = 100 / hookWeight;
        this.hookHead.y += deltaY * speedRatio;
        this.hookRope.width -= deltaY * speedRatio;
        this.moveHookPack();
    },

    getHookHeadGlobalPos: function () {
        return this.node.convertToWorldSpaceAR(cc.v2(this.hookHead.x, this.hookHead.y - 25));
    },

    isOutRange: function () {
        const winSize = cc.winSize;
        const hookHeadGlobalPos = this.getHookHeadGlobalPos();
        const hookX = hookHeadGlobalPos.x;
        const hookY = hookHeadGlobalPos.y;
        // cc.log("hook Head global position", JSON.stringify(hookHeadGlobalPos));
        return hookX < 0 || hookX > winSize.width || hookY < 0;
    },

    isHooking: function () {
        return this._hookState === HOOK_STATE.HOOK_START || this._hookState === HOOK_STATE.HOOK_BACK;
    },

    checkGameStateAnimHook: function () {
        // cc.log("checkGameStateAnimHook", g_gameController.gameState);
        switch (g_gameController.gameState) {
            case GameConfig.GAME_STATE.START:
            case GameConfig.GAME_STATE.MAIN_MENU:
                return true;
            case GameConfig.GAME_STATE.PAUSE:
            case GameConfig.GAME_STATE.END_LEVEL:
            case GameConfig.GAME_STATE.START_LEVEL:
                return false;
        }
    },

    cancelHook: function () {
        for(let hookedObject of this._hookObjects) {
            if (hookedObject.getParent() != null) {
                hookedObject.removeFromParent(true);
            }
        }
        this._hookObjects = [];
        const anim = g_gameController._animController.createAnim(AnimConfig.EXPLOSION);
        anim.parent = this.node.parent;
        var pos = this.hookHead.position;
        pos.y -= 30;
        anim.position = this.hookHead.parent.convertToWorldSpaceAR(pos);
    },

    update(dt) {
        if (this.checkGameStateAnimHook()) {
            if (!this.isHooking()) {
                this.node.angle = this._rotateRange * Math.cos(this._rotateTime * 0.9 + Math.PI/2);
                this._rotateTime += dt;
            }
            this.updateHook(dt);
        }
    },

    /**
     * Call when a collision is detected
     * @param  {Collider} other The other Collider Component
     * @param  {Collider} self  Self Collider Component
     */
    onHookCollide: function (other, self) {
        // cc.log('on collision enter', other);
        if (this._hookState === HOOK_STATE.HOOK_START) {
            this.setHookState(HOOK_STATE.HOOK_BACK);
            this._hookObjects.push(other.node);
            // if (other.node.getParent() != null) {
            //     other.node.removeFromParent(false);
            // }
            // this.hookHead.addChild(other.node);
            // other.node.setPosition(0,this._hookHeadBaseY);
            // cc.log("on Hook Collided", this.getHookWeight());
        }
    },
});