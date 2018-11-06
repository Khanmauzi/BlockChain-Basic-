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
}