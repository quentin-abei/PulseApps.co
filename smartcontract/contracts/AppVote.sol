//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

contract AppVote {
    address public owner;
    string[] public tickerArray;

    constructor() {
        owner = msg.sender;
    }

    struct ticker {
        bool exists;
        uint256 up;
        uint256 down;
        mapping(address => bool) Voters;
    }

    event tickerupdated ( 
        uint256 up,
        uint256 down,
        address voter,
        string ticker
    );

    mapping(string => ticker) private Tickers;

    function addTicker(string memory _ticker) public {
        require(msg.sender == owner, "Only the owner can create tickers");
        ticker storage newTicker = Tickers[_ticker];
        newTicker.exists = true;
        tickerArray.push(_ticker);
    }

    function vote(string memory _ticker, bool _vote) public {
        require(Tickers[_ticker].exists, "You can't vote on this Project");
        require(!Tickers[_ticker].Voters[msg.sender], "You have already voted for this project");


        ticker storage t = Tickers[_ticker];
        t.Voters[msg.sender] = true;

        if(_vote) {
            t.up++;
        } else {
            t.down++;
        }

        emit tickerupdated(t.up, t.down, msg.sender, _ticker);
    }

    function getVotes(string memory _ticker) public view returns(
        uint256 up,
        uint256 down
    ) {
        require(Tickers[_ticker].exists, "This Project does not exist");
        ticker storage t = Tickers[_ticker];
        return(t.up, t.down);
    }
}
