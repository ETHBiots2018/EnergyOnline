$(window).on('load', function() {
    
    var contractAddress = "0x6366bfb2428792ae1ec5f8cf6340ed997c231a29"; // in Ropsten testnet!
    var contractAbi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_payoutAddress",
                    "type": "address"
                }
            ],
            "name": "setPayoutAddress",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_producedKWh",
                    "type": "uint256"
                }
            ],
            "name": "notifyEnergyProduction",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_producer",
                    "type": "address"
                },
                {
                    "name": "_supplier",
                    "type": "address"
                }
            ],
            "name": "setAddresses",
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
    
    /*...*/
});