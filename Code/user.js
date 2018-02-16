$(window).on('load', function() {
	var contractAbi = [
		{
			"constant": true,
			"inputs": [],
			"name": "myBalance",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_supplier",
					"type": "address"
				},
				{
					"name": "_meter",
					"type": "address"
				},
				{
					"name": "_kWh",
					"type": "uint256"
				},
				{
					"name": "_price",
					"type": "uint256"
				}
			],
			"name": "payForEnergy",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_target",
					"type": "address"
				},
				{
					"name": "_amount",
					"type": "uint256"
				}
			],
			"name": "sendTokens",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_origin",
					"type": "address"
				}
			],
			"name": "setOrigin",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		}
	];
	
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I doesn\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#log').text(errorMsg);
        console.log(errorMsg);
        return;
    }
    
	// create instance of contract object that we use to interface the smart contract
	var contractInstance = web3.eth.contract(contractAbi).at("0x9aab124b9f5c0a3e3790d1a1e64a5b8a04e8dda2");
	
	$('#form_buy').on('submit', function(e) {
		e.preventDefault();
		contractInstance.payForEnergy($('#supplier').val(), $('#meter').val(), parseInt($('#kWh').val()), parseInt($('#price')), function(error) {});
	});

	$('#form_check').on('submit', function(e) {
		e.preventDefault();
		$('#log').text("Tokens: loading...");
		contractInstance.myBalance(function(error, value) {
			$('#log').text("Tokens: " + value);
		});
	});
	

	$('#form_send').on('submit', function(e) {});
});