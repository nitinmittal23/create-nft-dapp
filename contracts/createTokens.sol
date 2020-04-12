//solidity version used is 0.5.16
pragma solidity 0.5.16;

//importing ERC721.sol file from github
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

//create contract is inherited from ERC721 tokens
contract createTokens is ERC721 {

    //it will contain tokenids of all the token created so far
    //it will be an array of tokenIds
    uint256[] indexes;
    
    //this function will create tokens
    function _createToken(uint _tokenId) public {
        
        //require condition is required if the token with provided tokenID is already created or not 
        //.push will add the token id to our array on indexes
        //mint function will create tokens - present in ERC721.sol file
        require(!_exists(_tokenId));
        
        indexes.push(_tokenId);
        _mint(msg.sender , _tokenId);
    }

    //this function will return our array of tokenIds which is indexes
    function getKeys() public view returns (uint256[] memory) {
        return indexes; 
    }

    function computerChoice() public view returns (uint) {
        uint randomnumber = uint(keccak256(abi.encodePacked(now, msg.sender))) % 3 + 1;
        return randomnumber;
    }

    function _createId(string memory _str) private pure returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % (10**16);
    }

    function rock(string memory _str) public returns (bool){
        uint computer = computerChoice();
        if (computer == 3){
            uint id = _createId(_str);
            _createToken(id);
            return (true);
        }
        else {
            return (false);
        }
    }

    function paper(string memory _str) public returns (bool){
        uint computer = computerChoice();
        if (computer == 1){
            uint id = _createId(_str);
            _createToken(id);
            return (true);
        }
        else{
            return (false);
        }
    }

    function scissors(string memory _str) public returns (bool){
        uint computer = computerChoice();
        if (computer == 2){
            uint id = _createId(_str);
            _createToken(id);
            return (true);
        }
        else {
            return(false);
        }
    }

    function tokensbyId(uint id) public view returns(uint, address) {
        address  owner = ownerOf(id);
        return (id, owner);
    }

}
