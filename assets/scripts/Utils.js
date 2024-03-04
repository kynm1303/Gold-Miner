export const Utils = {};

/**
 * @param {number} maxX
 * @param {number} minX
 * @param {number} maxY
 * @param {number} minY
* */
Utils.randomPos = function (maxX, minX, maxY, minY) {
    let posX = Math.floor(Math.random() * (maxX - minX)) + minX;
    let posY = Math.floor(Math.random() * (maxY - minY)) + minY;
    // cc.log(maxX, minX);
    return cc.v2(posX, posY);
}

/**
 * @param {number} min
 * @param {number} max
 * */
Utils.randomRange = function (min, max) {
    return  Math.floor(Math.random() * (max - min)) + min;
}

Utils.storeNodeOrigin = function (node) {
    node._originX = node._originX || node.x;
    node._originY = node._originY || node.y;
    node._originW = node._originW || node.width;
    node._originH = node._originH || node.height;
    node._originPos = cc.v2(node._originX, node._originY);
}
/**
 * @param {cc.Node} node
 * @param {String} string
 * */
Utils.setNodeString = function (node, string) {
    const label = node.getComponent(cc.Label);
    if (label) label.string = string;
}

Utils.rectFromCfg = function (pos, type) {

}

Utils.getKeyByValue = function (object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

Utils.showPopUpFromNode = function (node) {
    if (node == null) return;
    var popupController = node.getComponent("PopUpController");
    if (popupController) popupController.showPopUp();
}

Utils.hidePopUpFromNode = function (node) {
    if (node == null) return;
    var popupController = node.getComponent("PopUpController");
    if (popupController) popupController.hidePopUp();
}

const map = {"first" : "1", "second" : "2"};