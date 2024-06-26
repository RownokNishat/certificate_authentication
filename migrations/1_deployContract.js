const Authenticate = artifacts.require("Authenticate");

module.exports = function(deployer) {
  deployer.deploy(Authenticate);
};
