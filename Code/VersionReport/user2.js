$(window).on('load', function() {
	
    var user2Adress = "0xfe17a5d63ca15bc052bbbf179a85bdbe62af363c";
    var userAbi = [
        {
            "constant": true,
            "inputs": [],
            "name": "wallet",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "price",
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
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "operatorBackend",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
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
                    "name": "_kWh",
                    "type": "uint256"
                },
                {
                    "name": "_totalPrice",
                    "type": "uint256"
                }
            ],
            "name": "buyEnergy",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
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
                    "name": "_operatorBackend",
                    "type": "address"
                },
                {
                    "name": "_wallet",
                    "type": "address"
                }
            ],
            "name": "setUp",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_dest",
                    "type": "address"
                },
                {
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferTokens",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
	
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I doesn\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#log').text(errorMsg);
        console.log(errorMsg);
        return;
    }
    
	var user = web3.eth.contract(userAbi).at(user2Adress);
    
	$('#form_check').on('submit', function(e) {
		e.preventDefault();
		$('#log').text("Tokens: loading...");
		user.myBalance(function(error, value) {
			$('#log').text("Tokens: " + value);
		});
	});
	
	$('#form_send').on('submit', function(e) {
        e.preventDefault();
        user.transferTokens($('#address').val(), parseInt($('#amount').val()), function(error) {});
    });

	$('#form_buy').on('submit', function(e) {
        e.preventDefault();
		user.buyEnergy(parseInt($('#kWh').val()), parseInt($('#price').val()), function(error) {});
	});
});