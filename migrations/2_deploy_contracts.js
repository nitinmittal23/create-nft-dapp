var Token = artifacts.require('./createTokens.sol')

module.exports = function(deployer) {
    deployer.deploy(Token);
    
} 