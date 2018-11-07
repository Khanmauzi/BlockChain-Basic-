/* this is a test file to test the smart contract */


var Election = artifacts.require("./Election.sol");


contract("Election", function(accounts){
    var electionInstance;               // to get the instance of the candidate
    var candidate_id;                   // store the candidate id for which vote is casted
    it("initializes with two candidates ", function(){
        return Election.deployed().then(function(instance) {
            return instance.count();
        }).then(function(count) {
            assert.equal(count, 2);
        });
    });
    it("it initializes first candidate candidates values", function(){
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0],"Candidate_1","correct candidate name");
            assert.equal(candidate[1],1,"correct candidate id");
            assert.equal(candidate[2],0,"correct vote count");
        });
    });
    it("it initializes the second candidate value ", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.candidates(2);
        }).then(function(candidate) {
            assert.equal(candidate[0],"Candidate_2","correct candidate name");
            assert.equal(candidate[1],2,"correct candidate id");
            assert.equal(candidate[2],0,"correct vote count");
        });
    });
    // test script to check the voting script is working properly or not
    it("it allows the voter to cast a vote", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidate_id = 1;
            return electionInstance.castVote(candidate_id, {from: accounts[0] });
        }).then (function(receipt){
            return electionInstance.voter(accounts[0]);
        }).then( function(voted) {
            assert(voted,"the voter was marked as voted");
            return electionInstance.candidates(candidate_id);
        }).then( function(candidate){
            var votecount = candidate[2];
            assert.equal(votecount,1,"increments the candidate vote count");
        });
    });
});