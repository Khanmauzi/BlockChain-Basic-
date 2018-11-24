var Migrations = artifacts.require("./supplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
