$(window).on('load', function() {

    var user1Adress = "0x9a15292d492667bafe62d53b4e369d28600d1973";
    var smartMeter1Adress = "0x56b2536b4520eac8cb57887a2507ab090fffc733";
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
    
    var smartMeterAbi = [
        {
            "constant": true,
            "inputs": [],
            "name": "smartMeter",
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
            "constant": false,
            "inputs": [
                {
                    "name": "_kWh",
                    "type": "uint256"
                }
            ],
            "name": "reportProduction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "payoutAddress",
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
            "constant": false,
            "inputs": [
                {
                    "name": "_smartMeter",
                    "type": "address"
                },
                {
                    "name": "_operatorBackend",
                    "type": "address"
                },
                {
                    "name": "_payoutAddress",
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
    
	var user = web3.eth.contract(userAbi).at(user1Adress);
	var meter = web3.eth.contract(smartMeterAbi).at(smartMeter1Adress);
    
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

    $('#form_report_production').on('submit', function(e) {
		e.preventDefault();
        meter.reportProduction($('#kWh_prod').val(), function(error) {});
    });
});