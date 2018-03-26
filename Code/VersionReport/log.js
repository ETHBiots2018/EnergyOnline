$(window).on('load', function() {
    
    var operatorAdress = "0x510b580dd10dd0bbfb17eb0956b9e54fe2e30a3e";
    var operatorAbi = [
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
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "trustedSmartMeterBackends",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "entered",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "initialized",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
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
            "name": "pricePerKWh",
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
            "name": "rewardPerKWh",
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
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_client",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_kWh",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "ClientBoughtEnergy",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_rewardPerKWh",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "_pricePerKWh",
                    "type": "uint256"
                }
            ],
            "name": "PriceChanged",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_kWh",
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
            "inputs": [
                {
                    "name": "_smartMeterBackend",
                    "type": "address"
                }
            ],
            "name": "trust",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
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
                    "name": "_rewardPerKWh",
                    "type": "uint256"
                },
                {
                    "name": "_pricePerKWh",
                    "type": "uint256"
                }
            ],
            "name": "setRewardAndPrice",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
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
                    "name": "_payoutAddress",
                    "type": "address"
                }
            ],
            "name": "rewardProduction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_smartMeterBackend",
                    "type": "address"
                }
            ],
            "name": "untrust",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        var errorMsg = 'I don\'t have web3 :( Please open in Google Chrome Browser and install the Metamask extension.';
        $('#log').text(errorMsg);
        console.log(errorMsg);
        return;
    }
    
    var operator = web3.eth.contract(operatorAbi).at(operatorAdress);

    var clientBoughtEnergy = operator.ClientBoughtEnergy();

    var log = "";

    clientBoughtEnergy.watch(function(error, result){
        if (!error) {
            log += result.args._client + " bought " + result.args._kWh + " kWh for " + result.args._price + " tokens\n";
            $('#log').text(log);
        }
    });
});