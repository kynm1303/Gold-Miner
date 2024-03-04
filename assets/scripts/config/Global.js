

const Global = {
    gameManager: null,
}

const setGlobalGameManager = function (gameManager) {
    Global.gameManager = gameManager;
    cc.log("gameManager", gameManager);
}

const getGameManager = function () {
    return Global.gameManager;
}

module.exports = {
    setGlobalGameManager,
    getGameManager
}