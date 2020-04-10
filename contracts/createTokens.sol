//solidity version used is 0.5.16
pragma solidity 0.5.16;

//importing ERC721.sol file from github
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

//create contract is inherited from ERC721 tokens
contract createTokens is ERC721 {

    //this will save the details of each token created
    struct token{
        uint256 tokenid;
        string name;
        string symbol;
    }

    //mapping from tokenid to its token details which include its name, symbol
    mapping (uint256 => token) public idToToken;  

    //it will contain tokenids of all the token created so far
    //it will be an array of tokenIds
    uint256[] indexes;
    
    //this function will create tokens
    function _createToken(uint256 _tokenId, string memory _name, string memory _symbol) public {
        
        //require condition is required if the token with provided tokenID is already created or not 
        //.push will add the token id to our array on indexes
        //next 3 lines will create mapping object and will add name, tokenid, symbol 
        //mint function will create tokens - present in ERC721.sol file
        require(!_exists(_tokenId));
        indexes.push(_tokenId);
        idToToken[_tokenId].tokenid = _tokenId;
        idToToken[_tokenId].name = _name;
        idToToken[_tokenId].symbol = _symbol;
        _mint(msg.sender , _tokenId);
    }

    //this function will return our array of tokenIds which is indexes
    function getKeys() public view returns (uint256[] memory) {
        return indexes; 
    }

    //this function will provide us the details of token by using _tokenid
    function tokensbyId(uint _tokenid) public view returns (string memory, string memory, uint256, address) { 

        //ownerOf function present in ERC721 file which provide us the address of owner  
        address owner = ownerOf(_tokenid);
        return (idToToken[_tokenid].name, idToToken[_tokenid].symbol, _tokenid, owner);
    }

}
