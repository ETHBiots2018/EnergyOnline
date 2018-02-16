pragma solidity ^0.4.19;

contract Origin {
    /* Address that gets all the money that this contract receives */
    address owner;
    
    /* Variable to prevent reentrant bugs */
    bool reenter;
    
    /* The token amount for every account */
    mapping(address => uint256) balance;
    mapping(address => uint256) lastAction;
    
    /* Just a constructor */
    function Origin() public {
        /* Initialize the balance of the origin */
        balance[address(this)] = 6e39;  // 0.6 * 10^40
        balance[msg.sender] = 4e39;     // 0.4 * 10^40
    }
    
    /* Event that will be called on every transfer */
    event Transfer(address _source, address _target, uint256 _amount);
    
    /* Function to transfer tokens from one account to another */
    function transfer(address _target, uint256 _amount) public {
        require(reenter == false);
        reenter = true;
        
        /* Source (= Caller) needs enough balance on account */
        require(balance[msg.sender] >= _amount);
        
        /* Do the transfer */
        balance[msg.sender] -= _amount;
        balance[_target] += _amount;
        
        /* Update lastAction */
        lastAction[msg.sender] = now;
        lastAction[_target] = now;
        
        /* Fire a transfer-event for eventual listeners */
        Transfer(msg.sender, _target, _amount);
        
        reenter = false;
    }
    
    /* Function to get the current balance of an address */
    function balance_of(address _adr) public view returns(uint256) {
        return balance[_adr];
    }
    
    /* If there is no action on the balance of an address over 2 years the
     * amount of tokens can be taken back (on the owners account) */
    function notifyBlackhole(address _adr) public {
        require(now - lastAction[_adr] >= 2 years);
        require(balance[_adr] > 0);
        balance[owner] += balance[_adr];
        balance[_adr] = 0;
    }
    
    /* Function that changes ether into tokens as long as there are tokens */
    function buyTokens() public payable {
        require(msg.value > 0);
        transfer(msg.sender, msg.value);
    }
    
    /* Called to move ether from this contract to the owner */
    function transferEther() public {
        require(owner == msg.sender);
        require(this.balance > 0);
        owner.transfer(this.balance);
    }
}

contract UserBackend {
    address owner;
    address origin;
    
    function UserBackend() public {
        owner = msg.sender;
    }
    
    function setOrigin(address _origin) public {
        require(owner == msg.sender);
        origin = _origin;
    }
    
    function sendTokens(address _target, uint256 _amount) public {
        require(owner == msg.sender);
        Origin(origin).transfer(_target, _amount);
    }
    
    function payForEnergy(address _supplier, address _meter, uint256 _kWh, uint256 _price) public {
        require(owner == msg.sender);
        Supplier(_supplier).requestEnergy(_meter, _kWh, _price);
        sendTokens(_supplier, _price);
        Supplier(_supplier).notifyEnergyPurchase();
    }
    
    function myBalance() public view returns(uint256) {
        return Origin(origin).balance_of(address(this));
    }
}

contract Policy {
    function grantRequest(address _trustedMeter, uint256 _tokenAmount, uint256 _kWh) public view;
    function getPayout(address _trustedMeter, uint256 _producedKWh) public view returns(uint256);
}

contract Supplier {
    address owner;
    bool isOriginSet;
    address origin;
    address policy;
    bool requestGranted;
    GrantedRequest request;
    mapping (address => bool) trustMeter;
    
    event ReleaseEnergy(address _meter, uint256 _kWh);
    event Payout(address _meter, address _payoutAddress, uint256 _kWh, uint256 _payout);
    
    struct GrantedRequest {
        address sender;
        address meter;
        uint256 kWh;
        uint256 forPrice;
        uint256 currentBalance;
    }
    
    function Supplier() public {
        owner = msg.sender;
    }
    
    function getOwner() public view returns(address) {
        return owner;
    }
    
    function setOrigin(address _origin) public {
        require(isOriginSet == false);
        require(msg.sender == owner);
        isOriginSet = true;
        origin = _origin;
    }
    
    function setPolicy(address _policy) public {
        require(msg.sender == owner || msg.sender == address(this));
        policy = _policy;
    }
    
    function requestEnergy(address _meter, uint256 _kWh, uint256 _forPrice) public {
        require(trustMeter[_meter] == true);
        Policy(policy).grantRequest(_meter, _kWh, _forPrice);
        requestGranted = true;
        request = GrantedRequest(msg.sender, _meter, _kWh, _forPrice, myBalance());
    }
    
    function notifyEnergyPurchase() public {
        require(requestGranted);
        require(request.sender == msg.sender);
        require(request.currentBalance + request.forPrice == myBalance());
        
        requestGranted = false;
        
        // Releases the energy as event, meter has to notify and release 
        // the energy physically if needed from the grid
        ReleaseEnergy(request.meter, request.kWh);
    }
    
    function notifyEnergyProduction(address _payoutAddress, uint256 _producedKWh) public {
        require(trustMeter[msg.sender] == true);
        uint256 payout = Policy(policy).getPayout(msg.sender, _producedKWh);
        Origin(origin).transfer(_payoutAddress, payout);
        Payout(msg.sender, _payoutAddress, _producedKWh, payout);
    }
    
    function addMeter(address _meter) public {
        require(msg.sender == owner);
        trustMeter[_meter] = true;
    }
    
    function removeMeter(address _meter) public {
        require(msg.sender == owner);
        trustMeter[_meter] = false;
    }
    
    function myBalance() public view returns(uint256) {
        return Origin(origin).balance_of(address(this));
    }
} 

contract EWZ is Supplier, Policy {
    uint256 kWhBuyPrice = 1e15;
    uint256 kWhSellPrice = 2e15;
    
    function EWZ() Supplier() public {
        setPolicy(this);
    }
    
    function setPrices(uint256 _kWhSellPrice, uint256 _kWhBuyPrice) public {
        require(msg.sender == getOwner());
        kWhSellPrice = _kWhSellPrice;
        kWhBuyPrice = _kWhBuyPrice;
    }
    
    function grantRequest(address /*_trustedMeter*/, uint256 _tokenAmount, uint256 _kWh) public view {
        require(_kWh >= _tokenAmount * kWhSellPrice);
    }
    
    function getPayout(address /*_trustedMeter*/, uint256 _producedKWh) public view returns(uint256) {
        return _producedKWh * kWhBuyPrice;
    }
}

contract SmartMeter {
    address oracle;
    address producer;
    address supplier;
    
    function SmartMeter() public {
        oracle = msg.sender;
    }
    
    function setAddresses(address _producer, address _supplier) public {
        require(msg.sender == oracle);
        producer = _producer;
        supplier = _supplier;
    }
    
    function notifyEnergyProduction(uint256 _producedKWh) public {
        require(msg.sender == oracle);
        Supplier(supplier).notifyEnergyProduction(producer, _producedKWh);
    }
}
