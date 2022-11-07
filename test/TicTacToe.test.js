// eslint-disable-next-line no-undef
const TicTacToe = artifacts.require('TicTacToe')
const truffleAssert = require('truffle-assertions');

const move = (row, col) => ({row, col});

// eslint-disable-next-line no-undef
contract("TicTacToe", (accounts) => {
    it("should create session", async function () {
        const instance = await TicTacToe.deployed();

        const makeMovetransaction = await instance.makeMove(-1, move(0, 0));
        const currentSession = await instance.nextSessionID()
        // const session = await instance.getSession(0);

        truffleAssert.eventEmitted(makeMovetransaction, 'SessionCreated', {});

        // eslint-disable-next-line no-undef
        assert.equal(currentSession, 1, "Session not created");
    });

    it("should win", async function () {
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const instance = await TicTacToe.deployed();

        await instance.makeMove( -1, move(0, 0) ,{
            from: accountOne
        })

        const nextSessionID = await instance.nextSessionID()
        const sessionID = nextSessionID.toNumber() - 1

        await instance.makeMove(sessionID, move(1, 0), {
            from: accountTwo
        })
        await instance.makeMove(sessionID, move(0, 1),  {
            from: accountOne
        })
        await instance.makeMove(sessionID, move(2, 0), {
            from: accountTwo
        })
        const winTransaction = await instance.makeMove(sessionID, move(0, 2),  {
            from: accountOne
        })

        truffleAssert.eventEmitted(winTransaction, 'HasWinner', {});
    });

    it("should win diag", async function () {
        const accountOne = accounts[0];
        const accountTwo = accounts[1];

        const instance = await TicTacToe.deployed();

        await instance.makeMove(-1, move(0, 0) ,{
            from: accountOne
        })

        const nextSessionID = await instance.nextSessionID()
        const sessionID = nextSessionID.toNumber() - 1

        await instance.makeMove(sessionID, move(1, 0), {
            from: accountTwo
        })
        await instance.makeMove(sessionID, move(1, 1),  {
            from: accountOne
        })
        await instance.makeMove(sessionID, move(2, 0), {
            from: accountTwo
        })

        const winTransaction = await instance.makeMove(sessionID, move(2, 2),  {
            from: accountOne
        })

        truffleAssert.eventEmitted(winTransaction, 'HasWinner', {});
    });
})
