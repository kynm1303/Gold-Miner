import {MINING_CONFIG} from "./config/MiningObjectConfig";
import {Utils} from "./Utils";
import {GameConfig} from "./config/GameConfig";
let {setGlobalGameManager} = require("./config/Global");
export let g_gameController = null;
cc.Class({
    extends: cc.Component,
    properties: {
        miningObjectPrefab: {
            default: null,
            type: cc.Prefab,
        },
        hookNode: {
            default: null,
            type: cc.Node,
        },
        timerNode: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        setGlobalGameManager(this);
        g_gameController = this;
        this._uiController = this.node.getComponent("UIController");
        this._hookController = this.hookNode.getComponent("HookController");
        this._timerController = this.timerNode.getComponent("TimerController");
        this._levelController = this.node.getComponent("LevelController");
        this._animController = this.node.getComponent("AnimController");
    },

    start() {
        this._minX = 50;
        this._maxX = 1050;
        this._minY = 50;
        this._maxY = 400;
        this._playerMoney = 0;
        this._miningObjects = [];
        this.init();
        // this._hookController.initHook();
        this.setGameState(GameConfig.GAME_STATE.MAIN_MENU);
    },

    init: function () {
        this._hookController.initHook();
    },

    /**
     * @param {GameConfig.GAME_STATE} gameState
     * */
    setGameState: function (gameState) {
        switch (gameState) {
            case GameConfig.GAME_STATE.START:
                if (this.gameState === GameConfig.GAME_STATE.START_LEVEL) {
                    this.loadLevel();
                }
                break;
            case GameConfig.GAME_STATE.PAUSE:
            case GameConfig.GAME_STATE.START_LEVEL:
                if (this.gameState === GameConfig.GAME_STATE.MAIN_MENU) {
                    this.initLevel();
                }
                this._levelController.nextLevel();
                break;
            case GameConfig.GAME_STATE.END_LEVEL:
                break;
            case GameConfig.GAME_STATE.MAIN_MENU:
                this._levelController.clearLevel();
                break;
        }
        cc.log("GameController", "setGameState", Utils.getKeyByValue(GameConfig.GAME_STATE, gameState));
        this._uiController.setGameState(gameState);
        this._timerController.setGameState(gameState);
        this.gameState = gameState;
    },

    onPreStart: function () {
        this.setGameState(GameConfig.GAME_STATE.START_LEVEL);
    },

    onStartLevel: function () {
        this.setGameState(GameConfig.GAME_STATE.START);
    },

    onHookEnd: function (price) {
        // cc.log("GameController", "onHookEnd", price);
        this._playerMoney += price;
        this._uiController.addPrice(this._playerMoney, price);
    },

    initLevel: function () {
        this._levelController.initLevel();
    },

    loadLevel: function () {
        this._hookController.initHook();
        this._uiController.loadLevel();
        this._levelController.loadLevel();
        this._timerController.loadLevel();
    },

    onCountDownEnd: function () {
        this.setGameState(GameConfig.GAME_STATE.END_LEVEL);
    },


    pauseGame: function () {
        this.setGameState(GameConfig.GAME_STATE.PAUSE);
    },

    resumeGame: function () {
        this.setGameState(GameConfig.GAME_STATE.START);
    },

    // update (dt) {},
});
