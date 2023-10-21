// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract hack1{

    struct maintainer{
        address maintainerAddress;
        string title;
        string description;
        string url;
        uint reward;
        string tags;
        bool solved;
    }

    struct solver{
        address solverAddress;
        uint bid;
        string description;
        string url;
    }
    

    mapping (address=>uint[]) public maintainerBID;
    mapping (uint=>address) public maintainerAddrs;
    mapping (uint=>maintainer) public bidDetails;

    mapping (address=>uint[]) public solverSID;
    mapping (uint=>address) public solverAddrs;
    mapping (uint=>solver) public  sidDetails;


    uint public BID=0;
    uint public SID=0;

    error throwError(string);

    function setDataMaintainerFree(string memory _title,string memory _desc,string memory _url,string memory _tags) public {
          BID=BID+1;
          maintainerBID[msg.sender].push(BID);
          maintainerAddrs[BID]=msg.sender;
          bidDetails[BID].maintainerAddress=msg.sender;
          bidDetails[BID].title=_title;
          bidDetails[BID].description=_desc;
          bidDetails[BID].url=_url;
          bidDetails[BID].reward=0;
          bidDetails[BID].tags=_tags;
          bidDetails[BID].solved=false;
    }

    function setDataMaintainerPiad(string memory _title,string memory _desc,string memory _url,string memory _tags) public payable {
          BID=BID+1;       
          maintainerBID[msg.sender].push(BID);
          maintainerAddrs[BID]=msg.sender;
          bidDetails[BID].title=_title;
          bidDetails[BID].description=_desc;
          bidDetails[BID].url=_url;
          bidDetails[BID].reward=msg.value;
          bidDetails[BID].tags=_tags;
          bidDetails[BID].solved=false;
    }

    // function stringToUint(string memory s) public pure returns (uint) {
    //     bytes memory b = bytes(s);
    //     uint result = 0;
    //     for (uint256 i = 0; i < b.length; i++) {
    //         uint256 c = uint256(uint8(b[i]));
    //         if (c >= 48 && c <= 57) {
    //             result = result * 10 + (c - 48);
    //         }
    //     }
    //     return result;
    // }

    function setDataSolver(uint _BID,string memory _desc,string memory _url) public {
          SID=SID+1;
          solverSID[msg.sender].push(SID);
          solverAddrs[SID]=msg.sender;
          sidDetails[SID].solverAddress=msg.sender;
          sidDetails[SID].bid=_BID;
          sidDetails[SID].description=_desc;
          sidDetails[SID].url=_url;
    }

    // function maintainerSolvedUpdate(bool _solved,uint _BID) public {
    //     bool check=false;
    //      for(uint i=0;i<maintainerBID[msg.sender].length;i++){
    //         if(maintainerBID[msg.sender][i]==_BID){
    //               check=true;
    //         }
    //      }
    //      if(check==false){
    //         revert throwError("This bounty is not yours");
    //      }
    //      bidDetails[_BID].solved=_solved;
    // } 

    function transferMoney(address payable solveAddress,uint _BID) public{
        // _address.transfer(this.balance);  
        // return bidDetails[_BID].reward;
         require(maintainerAddrs[_BID]!=msg.sender,"This bounty is not yours");
         bidDetails[_BID].solved=true;
         solveAddress.transfer(bidDetails[_BID].reward);
    }

    function maintainerUpdate(uint _BID,string memory _title,string memory _desc,string memory _url,string memory _tags) public {
          require(maintainerAddrs[_BID]!=msg.sender,"This bounty is not yours");
          bidDetails[BID].title=_title;
          bidDetails[BID].description=_desc;
          bidDetails[BID].url=_url;
          bidDetails[BID].tags=_tags;
    }

     function solverUpdate(uint _SID,uint _BID,string memory _desc,string memory _url) public {
          require(solverAddrs[_SID]!=msg.sender,"This bounty is not yours");
          require(sidDetails[SID].bid==_BID,"This is not the solution of this bounty");
          sidDetails[SID].bid=_BID;
          sidDetails[SID].description=_desc;
          sidDetails[SID].url=_url;
    }

}
