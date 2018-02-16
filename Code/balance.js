$(window).on('load', function() {
    
    var contractAddress = ""; // in Ropsten testnet!
    var contractAbi = [
        {
            "constant": false,
            "inputs": [],
            "name": "Tokens",
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
            "name": "transfer",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_adr",
                    "type": "address"
                }
            ],
            "name": "balance_of",
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
            "inputs": [],
            "name": "transferEther",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "buyTokens",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_adr",
                    "type": "address"
                }
            ],
            "name": "notifyBlackhole",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_source",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_target",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
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
    
    var origin = web3.eth.contract(contractAbi).at(contractAddress);

	$('#my-form').on('submit', function(e) {
        e.preventDefault();
		contractInstance.balance_of($('#address').val(), function(error, value) {
            if (error)
                $('#log').text("Error: " + error);
            else    
                $('#log').text("Tokens: " + value);
        });
    });
});