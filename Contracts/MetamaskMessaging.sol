pragma solidity ^0.5.2;
import 'openzeppelin-eth/contracts/math/SafeMath.sol';

contract MetamaskMessaging {
    using SafeMath for uint256;
    
    // Maps an address to an array of ipfs hashes that store encrypted messages
    mapping(address => mapping(uint256 => string)) private inbox;
    mapping(address => uint256) private latestMessage;
   
    // An optional opt-in whitelist 
    mapping(address => bool) private optIn;
    mapping(address => mapping(address => bool)) private whiteList;  
    mapping(address => address[]) private queryWhiteList;
    mapping(address => mapping(address => uint256)) private queryWhiteListIndex;

    constructor() public {}
    
    //-------Getters--------//
    
    function getWhiteListOptIn() public view returns (bool) {
        return optIn[msg.sender];
    }
    
    function getLatestMessageIndex() public view returns (uint256) {
        return latestMessage[msg.sender];
    }
    
    function queryMessageByIndex(uint256 _index) public view returns (string memory) {
        return inbox[msg.sender][_index];
    }
        
    function getWhiteList(uint256 _index) public view returns (address) {
        return queryWhiteList[msg.sender][_index];
    }   
    
    function getLatestWhiteListIndex() public view returns (uint256) {
        return queryWhiteList[msg.sender].length;
    }   
    
    //-------White List Functions---------//
    
     function toggleWhiteList() public {
        optIn[msg.sender] = !optIn[msg.sender];
    }
    
    function addToWhiteList(address _receiver) public {
        require(optIn[msg.sender], "User has not opted in yet"); 
        whiteList[msg.sender][_receiver] = true;
        
        uint index = queryWhiteList[msg.sender].push(_receiver);
        queryWhiteListIndex[msg.sender][_receiver] = index;
    }
    
    function removeWhiteList(address _receiver) public {
        require(optIn[msg.sender], "User has not opted in yet");
        whiteList[msg.sender][_receiver] = false;
        
        // Pop and swap the address so it does not leave a gap
        uint256 lastAddressIndex = queryWhiteList[msg.sender].length.sub(1);
        uint256 addressIndex = queryWhiteListIndex[msg.sender][_receiver];
        
        if (lastAddressIndex != addressIndex) {
            address lastAddress = queryWhiteList[msg.sender][lastAddressIndex];
            
            queryWhiteList[msg.sender][addressIndex] = lastAddress; // Move the last address to the slot of the to delete address
            queryWhiteListIndex[msg.sender][_receiver] = addressIndex; // Update moved address index
        }
        
        queryWhiteList[msg.sender].length--;
        queryWhiteListIndex[msg.sender][_receiver] = 0;
    }
    
    //--------Send Message Functions-------------//
    function sendMessage(address _receiver, string memory _ipfsHash) public {
        uint256 latestMessageIndex = latestMessage[_receiver];
        
        if (optIn[_receiver]) {
            if (whiteList[_receiver][msg.sender]) {
                inbox[_receiver][latestMessageIndex] = _ipfsHash;
                latestMessage[_receiver]++;
            } else {
                revert();
            }
        } else {
            inbox[_receiver][latestMessageIndex] = _ipfsHash;
            latestMessage[_receiver]++;            
        }
    }
}
