pragma solidity ^0.5.2;
import 'openzeppelin-eth/contracts/math/SafeMath.sol';

contract MetamaskMessaging {
    using SafeMath for uint256;
   
    event Message(
        address indexed _from,
        address indexed _to,
        string message
    );
    
    event Broadcast(
        address indexed _from,
        string message
    );
    
    // An opt-in whitelist to allow only the users in the whitelist to message the owner
    mapping(address => bool) private optIn;
    mapping(address => mapping(address => bool)) private whiteList;  
   
    // Whitelist enumerator for easy access to the whitelist
    mapping(address => address[]) private queryWhiteList;
    mapping(address => mapping(address => uint256)) private queryWhiteListIndex;

    constructor() public {}
    
    //-------Getters--------//
    
    /**
     * @dev Gets the whitelist status of the current user
     * @return bool The whitelist status
     */
    function getWhiteListOptIn() public view returns (bool) {
        return optIn[msg.sender];
    }
    
    /**
     * @dev Gets the latest index of the whitelisted addresses. Used for enumeration.
     * @return uint256 The latest index
     */
    function getLatestWhiteListIndex() public view returns (uint256) {
        require(queryWhiteList[msg.sender].length != 0, "No whitelist addresses");
        return queryWhiteList[msg.sender].length.sub(1);
    }   
    
    /**
     * @dev Gets a whitelisted address for the current user from the given index
     * @param _index The index of the whitelisted address
     * @return address The whitelisted address
     */
    function getWhiteList(uint256 _index) public view returns (address) {
        return queryWhiteList[msg.sender][_index];
    }   
    
    //-------White List Functions---------//
    
    /**
     * @dev Enables/disables the user for the whitelist
     */
    function toggleWhiteList() public {
        optIn[msg.sender] = !optIn[msg.sender];
    }
    
    /**
     * @dev Adds an address to the user's white list
     * @param _receiver address to be added to the user's white list
     */
    function addToWhiteList(address _receiver) public {
        require(optIn[msg.sender], "User has not opted in yet"); 
        whiteList[msg.sender][_receiver] = true;
        
        uint index = queryWhiteList[msg.sender].push(_receiver);
        queryWhiteListIndex[msg.sender][_receiver] = index.sub(1);
    }
    
    /**
     * @dev Removes an address to the user's white list
     * @param _receiver address to be removed from the user's white list
     */
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
    
    //--------Messaging Functions-------------//
    
    /**
     * @dev Sends an ipfs hash of an encrypted message to a receiver's inbox
     * @param _receiver The recipient address
     * @param _ipfsHash The hash of an encrypted message
     */
    function sendMessage(address _receiver, string memory _ipfsHash) public {
        if (optIn[_receiver]) {
            if (whiteList[_receiver][msg.sender]) {
                emit Message(msg.sender, _receiver, _ipfsHash);
            } else {
                revert();
            }
        } else {
            emit Message(msg.sender, _receiver, _ipfsHash);        
        }
    }
    
    /**
     * @dev Broadcast an ipfs hash of an encrypted message to subscribers
     * @param _ipfsHash The hash of an encrypted message
     */
    function sendBroadcast(string memory _ipfsHash) public {
        emit Broadcast(msg.sender, _ipfsHash);
    }
}
