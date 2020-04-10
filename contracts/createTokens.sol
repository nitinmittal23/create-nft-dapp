pragma solidity 0.5.16;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract createTokens is ERC721 {

    struct token{
        uint256 tokenid;
        string name;
        string symbol;
    }

    mapping (uint256 => token) public idToToken;  
    uint256[] indexes;
    
    function _createToken(uint256 _tokenId, string memory _name, string memory _symbol) public {
        require(!_exists(_tokenId));
        indexes.push(_tokenId);
        idToToken[_tokenId].tokenid = _tokenId;
        idToToken[_tokenId].name = _name;
        idToToken[_tokenId].symbol = _symbol;
        _mint(msg.sender , _tokenId);
    }
    function getKeys() public view returns (uint256[] memory) { 
        return indexes; 
    }
    function tokensbyId(uint _tokenid) public view returns (string memory, string memory, uint256, address) {   
        address owner = ownerOf(_tokenid);
        return (idToToken[_tokenid].name, idToToken[_tokenid].symbol, _tokenid, owner);
    }

}
