pragma solidity ^0.4.24;


contract Election {

    // model your candidate
    struct Candidate {
        string name;
        uint id;
        uint votecount;
    } 

    // store the candidate (it will be done through mapping)
    mapping(uint => Candidate) public candidates;

    // mapping to record if particular id has casted its vote
    mapping(address => bool) public voter;

    // use variable to maintain the count of the candidate
    uint public count;

    //constructor
    constructor () public {
        addCandidate("Candidate_1");
        addCandidate("Candidate_2");
    }


    // function to add candidate (call this function from constructor)
    function addCandidate(string _name) private {
        count++;
        candidates[count] = Candidate(_name,count,0);

    }

    // function to cast the vote for the candidates
    function castVote(uint id) public {
        // make sure user haven't cast his vote before
        require(!voter[msg.sender]);    // if this statement is true, then only rest of the fun will be executed 

        // make sure user is voting for valid candidate
        require(id>0 && id<=count);
        
        voter[msg.sender] = true;
        candidates[id].votecount++;
    }
}