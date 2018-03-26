pragma solidity 0.4.19;

contract Wallet {
    address public owner = msg.sender;
    mapping(address => uint256) public balance;
    
    event Transfer(address _source, address _dest, uint256 _amount);
    
    function Wallet() public {
        balance[owner] = 4e23;
        balance[this] = 6e23;
    }
    
    function transfer(address _dest, uint256 _amount) public {
        require(balance[msg.sender] >= _amount);
        
        balance[msg.sender] -= _amount;
        balance[_dest] += _amount;
        
        Transfer(msg.sender, _dest, _amount);
    }
    
    function buyTokens() public payable {
        require(balance[this] >= msg.value);
        
        balance[this] -= msg.value;
        balance[msg.sender] += msg.value;
        
        owner.transfer(address(this).balance);
        
        Transfer(this, msg.sender, msg.value);
    }
}

contract SmartMeterBackend {
    address public owner = msg.sender;
    address public smartMeter;
    address public operatorBackend;
    address public payoutAddress;
    
    function setUp(address _smartMeter, address _operatorBackend, address _payoutAddress) public {
        require(msg.sender == owner);
        
        smartMeter = _smartMeter;
        operatorBackend = _operatorBackend;
        payoutAddress = _payoutAddress;
        
        delete owner;
    }
    
    function reportProduction(uint256 _kWh) public {
        //require(msg.sender == smartMeter); (for demonstration commented out)
        
        OperatorBackend(operatorBackend).rewardProduction(_kWh, payoutAddress);
    }
}

contract EnergyClient {
    function payForEnergy() public;
}

contract OperatorBackend {
    mapping (address => bool) public trustedSmartMeterBackends;
    address public owner = msg.sender;
    bool public initialized = false;
    bool public entered = false;
    address public wallet;
    uint256 public rewardPerKWh;
    uint256 public pricePerKWh;
    
    event ClientBoughtEnergy(address _client, uint256 _kWh, uint256 _price);
    event PriceChanged(uint256 _rewardPerKWh, uint256 _pricePerKWh);
    
    function setUp(address _wallet) public {
        require(msg.sender == owner);
        require(initialized == false);
        initialized = true;
        
        wallet = _wallet;
    }
    
    function setRewardAndPrice(uint256 _rewardPerKWh, uint256 _pricePerKWh) public {
        //require(msg.sender == owner); (for demonstration)
        
        rewardPerKWh = _rewardPerKWh;
        pricePerKWh = _pricePerKWh;
        
        PriceChanged(_rewardPerKWh, _pricePerKWh);
    }
    
    function trust(address _smartMeterBackend) public {
        require(msg.sender == owner);
        trustedSmartMeterBackends[_smartMeterBackend] = true;
    }
    
    function untrust(address _smartMeterBackend) public {
        require(msg.sender == owner);
        delete trustedSmartMeterBackends[_smartMeterBackend];
    }
    
    function rewardProduction(uint256 _kWh, address _payoutAddress) public {
        require(trustedSmartMeterBackends[msg.sender] == true);
        
        Wallet(wallet).transfer(_payoutAddress, _kWh * rewardPerKWh);
    }
    
    function buyEnergy(uint256 _kWh) public {
        require(entered == false);
        entered = true;
        
        uint256 price = _kWh * pricePerKWh;
        require(price / _kWh == pricePerKWh);
        
        uint256 balance = Wallet(wallet).balance(this);
        EnergyClient(msg.sender).payForEnergy();
        uint256 newBalance = Wallet(wallet).balance(this);
        require(balance + price == newBalance);
        
        ClientBoughtEnergy(msg.sender, _kWh, price);
        
        entered = false;
    }
}

contract User is EnergyClient {
    address public owner = msg.sender;
    address public operatorBackend;
    address public wallet;
    uint256 public price = 0;
    
    function setUp(address _operatorBackend, address _wallet) public {
        require(msg.sender == owner);
        
        operatorBackend = _operatorBackend;
        wallet = _wallet;
    }
    
    function payForEnergy() public {
        require(msg.sender == operatorBackend);
        require(price != 0);
        
        uint256 _price = price;
        price = 0;
        
        Wallet(wallet).transfer(operatorBackend, _price);
    }
    
    function buyEnergy(uint256 _kWh, uint256 _totalPrice) public {
        //require(msg.sender == owner); (for demonstration)
        
        price = _totalPrice;
        OperatorBackend(operatorBackend).buyEnergy(_kWh);
        price = 0;
    }
    
    function transferTokens(address _dest, uint256 _amount) public {
        // require(msg.sender == owner);
        Wallet(wallet).transfer(_dest, _amount);
    }
    
    function myBalance() public view returns (uint256) {
        return Wallet(wallet).balance(this);
    }
}
