/* this is a test file to test the smart contract */


var Election = artifacts.require("./Election.sol");


contract("Election", function(accounts){
    var electionInstance;               // to get the instance of the candidate
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
});