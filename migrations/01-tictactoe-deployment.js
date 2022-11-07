const TicTacToe = artifacts.require('TicTacToe')

module.exports = function (depLayer, network, accounts) {
    depLayer.deploy(TicTacToe);
}
