// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TicTacToe {
    enum MARK {EMPTY, PLAYER1, PLAYER2}
    uint8 constant PLAYGROUND_SIZE = 3;

    event SessionCreated(address playerSessionCreator, uint sessionID);
    event GameMove(uint indexed sessionID, address player, Move move);
    event HasWinner(uint indexed sessionID, address playerWinner);

    struct Move {
        uint8 row;
        uint8 col;
    }

    struct Session {
        address player1;
        address player2;
        address winner;
        MARK[PLAYGROUND_SIZE][PLAYGROUND_SIZE] playground;
    }

    uint public nextSessionID;
    mapping(uint => Session) sessions;

    function getSession(uint sessionID) public view returns (Session memory){
        return sessions[sessionID];
    }

    function getAvailableSessions(address player) public view returns (uint[] memory) {
        uint resultCount;


        for (uint sessionID = 0; sessionID < nextSessionID; sessionID++) {
            if(sessions[sessionID].winner == address(0) && (sessions[sessionID].player1 == player || sessions[sessionID].player2 == player || sessions[sessionID].player2 == address(0)) ){
                resultCount++;
            }
        }
        uint[] memory sessionIDs = new uint[](resultCount);

        uint index = 0;

        for (uint sessionID = 0; sessionID < nextSessionID; sessionID++) {
            if(sessions[sessionID].winner == address(0) && (sessions[sessionID].player1 == player || sessions[sessionID].player2 == player || sessions[sessionID].player2 == address(0)) ){
                sessionIDs[index] = sessionID;
                index++;
            }
        }

        return sessionIDs;
    }

    function getNextMark(uint sessionID) private view returns (MARK){
        uint8 mark1Count;
        uint8 mark2Count;
        MARK[3][3] storage playground = sessions[sessionID].playground;

        for (uint row = 0; row < PLAYGROUND_SIZE; row++) {
            for (uint col = 0; col < PLAYGROUND_SIZE; col++) {
                if (playground[row][col] == MARK.PLAYER1) {
                    mark1Count++;
                } else if (playground[row][col] == MARK.PLAYER2) {
                    mark2Count++;
                }
            }
        }

        if (mark1Count > mark2Count) {
            return MARK.PLAYER2;
        } else {
            return MARK.PLAYER1;
        }
    }

    function isWinner(MARK[PLAYGROUND_SIZE][PLAYGROUND_SIZE] storage playground, MARK mark) private view returns (bool) {
        uint8 winByRowCount;
        uint8 winByColCount;
        uint8 winByDiag;
        uint8 winByAntiDiag;

        for (uint i = 0; i < PLAYGROUND_SIZE; i++) {
            winByRowCount = 0;
            winByColCount = 0;

            if (playground[i][i] == mark) {
                winByDiag++;
            }

            if (playground[PLAYGROUND_SIZE - i - 1][i] == mark) {
                winByAntiDiag++;
            }

            for (uint j = 0; j < PLAYGROUND_SIZE; j++) {
                if (playground[i][j] == mark) {
                    winByRowCount++;
                }

                if (playground[j][i] == mark) {
                    winByColCount++;
                }
            }

            if (winByRowCount == PLAYGROUND_SIZE || winByColCount == PLAYGROUND_SIZE) {
                return true;
            }
        }

        if (winByDiag == PLAYGROUND_SIZE || winByAntiDiag == PLAYGROUND_SIZE) {
            return true;
        }

        return false;
    }

    function setMove(MARK[PLAYGROUND_SIZE][PLAYGROUND_SIZE] storage playground, Move memory move, MARK mark) private {
        playground[move.row][move.col] = mark;
    }

    function makeMove(int _sessionID, Move memory move) public {
        uint8 _row = move.row;
        uint8 _col = move.col;

        if (_sessionID == - 1) {
            Session storage session = sessions[nextSessionID];
            session.player1 = msg.sender;

            setMove(session.playground, move, MARK.PLAYER1);
            emit SessionCreated(msg.sender, nextSessionID);

            nextSessionID++;
        } else {
            require(uint(_sessionID) < nextSessionID, "Session does not exists");
            uint sessionID = uint(_sessionID);
            Session storage session = sessions[sessionID];
            require(session.winner == address(0), "Game ended");

            MARK[PLAYGROUND_SIZE][PLAYGROUND_SIZE] storage playground = session.playground;

            if (session.player1 != msg.sender && session.player2 == address(0)) {
                session.player2 = msg.sender;
            }

            require(session.player1 == msg.sender || session.player2 == msg.sender, "Not your session");

            MARK nextMark = getNextMark(uint(_sessionID));
            MARK yourMark = session.player1 == msg.sender ? MARK.PLAYER1 : MARK.PLAYER2;
            require(nextMark == yourMark, "Not your move");
            require(playground[_row][_col] == MARK.EMPTY, "Not possible move");

            setMove(playground, move, yourMark);

            if (isWinner(playground, yourMark)) {
                session.winner = msg.sender;
                emit HasWinner(sessionID, msg.sender);
            }

            emit GameMove(sessionID, msg.sender, move);
        }
    }
}
