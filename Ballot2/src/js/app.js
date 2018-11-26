App = {
  web3Provider: null,
  contracts: {},
  names: new Array(),
  url: 'http://127.0.0.1:9545',
  chairPerson:null,
  currentAccount:null,
  init: function() {
    $.getJSON('../proposals.json', function(data) {
      var proposalsRow = $('#proposalsRow');
      var proposalTemplate = $('#proposalTemplate');

      for (i = 0; i < data.length; i ++) {
        proposalTemplate.find('.panel-title').text(data[i].name);
        proposalTemplate.find('img').attr('src', data[i].picture);
        proposalTemplate.find('.btn-vote').attr('data-id', data[i].id);

        proposalsRow.append(proposalTemplate.html());
        App.names.push(data[i].name);
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
        // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the TestRPC
      App.web3Provider = new Web3.providers.HttpProvider(App.url);
    }
    web3 = new Web3(App.web3Provider);

    App.populateAddress();
    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Ballot.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var voteArtifact = data;
    App.contracts.vote = TruffleContract(voteArtifact);

    // Set the provider for our contract
    App.contracts.vote.setProvider(App.web3Provider);
    
    App.getChairperson();
    return App.bindEvents();
  });
  },

  

  bindEvents: function() {
    $(document).on('click', '.btn-vote', App.handleVote);
    $(document).on('click', '#win-count', App.handleWinner);
    $(document).on('click', '#register1', function(){ var ad = $('#enter_address1').val(); App.handleRegister(ad);   });
    $(document).on('click', '#register2', function(){ var ad = $('#enter_address2').val(); App.handleRegister(ad);   });
    $(document).on('click', '#register3', function(){ var ad = $('#enter_address3').val(); App.handleRegister(ad);   });
  },

  
  populateAddress : function(){
    new Web3(new Web3.providers.HttpProvider(App.url)).eth.getAccounts((err, accounts) => {
      var i=0;
      jQuery.each(accounts,function(i){
        if(web3.eth.coinbase != accounts[i]){
          var optionElement = '<option value="'+accounts[i]+'">'+accounts[i]+'</option';
          console.log(optionElement);
          if(i<4)
            jQuery('#enter_address1').append(optionElement);
          if(i>=4 && i<7)
            jQuery('#enter_address2').append(optionElement);
          if(i>=7 && i<10)
            jQuery('#enter_address3').append(optionElement);
          i++;  
        }
      });
    });
  },

  getChairperson : function(){
    App.contracts.vote.deployed().then(function(instance) {
      return instance.chairperson();
    }).then(function(result) {
      App.chairPerson = result.toString();
      App.currentAccount = web3.eth.coinbase;
      var optionElement = '<option value="'+App.currentAccount+'">'+App.currentAccount+'</option';
      jQuery('#enter_address4').append(optionElement);
      if(App.chairPerson != App.currentAccount){
        jQuery('#address_div1').css('display','none');
        jQuery('#register_div1').css('display','none');
        jQuery('#address_div2').css('display','none');
        jQuery('#register_div2').css('display','none');
        jQuery('#address_div3').css('display','none');
        jQuery('#register_div3').css('display','none');
        jQuery('#id1').css('display','none');
        jQuery('#id2').css('display','none');
        jQuery('#id3').css('display','none');
        jQuery('#showaccount').css('display','block');
        jQuery('#showaccount1').css('display','block');
      }else{
        jQuery('#address_div1').css('display','block');
        jQuery('#register_div1').css('display','block');
        jQuery('#address_div2').css('display','block');
        jQuery('#register_div2').css('display','block');
        jQuery('#address_div3').css('display','block');
        jQuery('#register_div3').css('display','block');
        jQuery('#id1').css('display','block');
        jQuery('#id2').css('display','block');
        jQuery('#id3').css('display','block');
        jQuery('#showaccount').css('display','none');
        jQuery('#showaccount1').css('display','none');
        
      }
    })
  },

  handleRegister: function(addr){

    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.register(addr);
    }).then( function(result){
      if(result.receipt.status == '0x01')
        alert(addr + " is registered successfully")
      else
        alert(addr + " account registeration failed due to revert")
    }).catch( function(err){
      alert(addr + " account registeration failed")
    })
  },

  handleVote: function(event) {
    event.preventDefault();
    var proposalId = parseInt($(event.target).data('id'));
    var voteInstance;

    web3.eth.getAccounts(function(error, accounts) {
      var account = accounts[0];

      App.contracts.vote.deployed().then(function(instance) {
        voteInstance = instance;

        return voteInstance.vote(proposalId, {from: account});
      }).then(function(result){
            if(result.receipt.status == '0x01')
            alert(account + " voting done successfully")
            else
            alert(account + " voting not done successfully due to revert")
        }).catch(function(err){
          alert(account + " voting failed")
    });
    });
  },


  handleWinner : function() {
    var voteInstance;
    App.contracts.vote.deployed().then(function(instance) {
      voteInstance = instance;
      return voteInstance.winningProposal();
    }).then(function(res){
      alert(App.names[res] + "  is the winner ! :)");
    }).catch(function(err){
      console.log(err.message);
    })
  }
};


$(function() {
  $(window).load(function() {
    App.init();
    console.log('starting app.js');
  });
});
