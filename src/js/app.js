App = {
  web3Provider: null,
  contracts: {},
  web3js: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window['ethereum']
    }
    App.web3js = new Web3 (App.web3Provider)
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('createTokens.json', function(data) {
      var TutorialTokenArtifact = data;
      App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);
      App.contracts.TutorialToken.setProvider(App.web3Provider);
      App.getBalances();
      App.getTokens();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#createButton', App.createToken);
  },

  createToken: function(event) {
    event.preventDefault();

    var tokenid = parseInt($('#CTid').val());
    var symbol = $('#CTsymbol').val();
    var name = $('#CTname').val();

    console.log("creating token " + name +" " + symbol + " with token id " + tokenid);

    var tutorialTokenInstance;

    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        return tutorialTokenInstance._createToken(tokenid, name, symbol, {from: account, gas: 600000});
      }).then(function(result) {
        alert('Token created Successfully!');
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },


  handleTransfer: function(event) {
    event.preventDefault();

    var tokenid = parseInt($('#TTTransferId').val());  
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + tokenid + ' Token to ' + toAddress);
    var tutorialTokenInstance;

    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        return tutorialTokenInstance.transferFrom(account, toAddress, tokenid, {from: account, gas: 100000});
      }).then(function() {
        alert('Transfer Successful!');
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function() {
    console.log('Getting balances...');
    var tutorialTokenInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getTokens: function() {
    console.log('Getting Tokens...');
    var tutorialTokenInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;
        var keys = tutorialTokenInstance.getKeys();   
        var tokenrow = $('#all-tokens');
        
        $("#all-tokens").empty();
        return keys
      }).then(function(data) {
        console.log(data);
        for (i=0; i<data.length; i++){
          tutorialTokenInstance.tokensbyId(data[i].c[0])
            .then(function(result){
              var tokenrow = $('#all-tokens');
              var tokenTemplate = $('#template');
              var val;
              tokenTemplate.find('.TTId').text(result[2]);
              tokenTemplate.find('.TTName').text(result[0]);
              tokenTemplate.find('.TTSymbol').text(result[1]);
              tokenTemplate.find('.TTOwner').text(result[3]);
              tokenrow.append(tokenTemplate.html());
            })
            .catch(function(err) { 
              console.log(err.message);
            });
        } 
      })
      .catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

  

$(function() {
  $(window).load(function() {
    App.init();
  });
});
