//here we are generating a global app which will be called when window loads
App = {
  web3Provider: null,
  contracts: {},
  web3js: null,

  //It will initiate a web3 App
  init: function() {
    return App.initWeb3();
  },

  //it wil first check if there is ethereum web provider in your browser
  //if it is there (!=='undefined') then web3 provider will be ethereum
  //else it will create a new web3 provider 
  //in the end it will return the initcontract function
  initWeb3: async function() {
    if (typeof window.ethereum !== 'undefined') {
      App.web3Provider = window['ethereum']
    }
    App.web3js = new Web3 (App.web3Provider)
    return App.initContract();
  },

  /*it will initiate the contract and will get the JSON file from 
  build/contracts which was created after truffle compile*/
  //it will give contract the web3 provider which we created in above function
  //upon loading, App.getBalances and App.get tokens will be called
  //and then it will return bind events
  initContract: function() {
    $.getJSON('createTokens.json', function(data) {
      var createTokensArtifact = data;
      App.contracts.createTokens = TruffleContract(createTokensArtifact);
      App.contracts.createTokens.setProvider(App.web3Provider);
      App.getBalances();
      App.getTokens();
    });
    return App.bindEvents();
  },

  //bind events are used to attach one or more event handlers
  //it will call handletransfer function on clicking transfer button
  //it will call create token button on clicking create button
  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#rock', App.userRock);
    $(document).on('click', '#paper', App.userPaper);
    $(document).on('click', '#scissors', App.userScissors);
  },

  userRock: function(event) {
    event.preventDefault();
    var name = $('#userName').val();

    console.log(name + " is playing Rock paper Scissors");
    var createTokensInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;
        return createTokensInstance.rock(name);
      }).then(function(result) {
        alert("Thankyou For playing Rock-Paper-Scissors");
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  userPaper: function(event) {
    event.preventDefault();
    var name = $('#userName').val();

    console.log(name + " is playing Rock paper Scissors");
    var createTokensInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;
        return createTokensInstance.paper(name);
      }).then(function(result) {
        alert("Thankyou For playing Rock-Paper-Scissors");
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  userScissors: function(event) {
    event.preventDefault();
    var name = $('#userName').val();

    console.log(name + " is playing Rock paper Scissors");
    var createTokensInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;
        return createTokensInstance.scissors(name);
      }).then(function(result) {
        alert("Thankyou For playing Rock-Paper-Scissors");
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  //It will handle transfer of tokens from one account to other
  handleTransfer: function(event) {
    event.preventDefault();

    var tokenid = parseInt($('#TTTransferId').val());  
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + tokenid + ' Token to ' + toAddress);
    var createTokensInstance;

    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;
        //{from: account, gas: 100000} it means that function is called from account and the gas limit will be 100000
        return createTokensInstance.transferFrom(account, toAddress, tokenid, {from: account, gas: 100000});
      }).then(function() {
        alert('Transfer Successful!');
        App.getBalances();
        App.getTokens();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  //it will get balance of the particular account 
  //balances are the number of tokens that an account have
  getBalances: function() {
    console.log('Getting balances...');
    var createTokensInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;
        return createTokensInstance.balanceOf(account);
      }).then(function(result) {
        //the value of balance is present in 0th index of property C on result
        balance = result.c[0];
        //it will put the balance in text form in the TTBalance div of HTML file
        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  //this function will get the list of ERC721 tokens and display is on the screen
  getTokens: function() {
    console.log('Getting Tokens...');
    var createTokensInstance;
    App.web3js.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.createTokens.deployed().then(function(instance) {
        createTokensInstance = instance;

        //this will call the getKeys function from our contract
        var keys = createTokensInstance.getKeys();   
        var tokenrow = $('#all-tokens');
        
        //it will remove all the contents from out all-tokens Div in HTML file
        $("#all-tokens").empty();
        return keys
      }).then(function(data) {
        //the array of token ids is present in data

        //this loop is for each token id in the data 
        for (i=0; i<data.length; i++){
          //now call the tokensbyId function from our contract with particular token id
          createTokensInstance.tokensbyId(data[i].toNumber())
            .then(function(result){

              var tokenrow = $('#all-tokens');
              var tokenTemplate = $('#template');

              //next 4 lines will find the particular div and add the particular data
              tokenTemplate.find('.TTId').text(result[0]);
              tokenTemplate.find('.TTOwner').text(result[1]);

              //it will append the template div in tokenrow div
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

  
//this is the starting function
//when window is loaded then App.init function will be called
//which is the first function in our global App
$(function() {
  $(window).load(function() {
    App.init();
  });
});
