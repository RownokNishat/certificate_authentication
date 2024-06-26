// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Authenticate{

    address[] CA;
    uint CAno;
    mapping (string => uint) CRL;
    mapping (string => address) VersityAddress;
    mapping (string => address) CertificateAddress;

    

    constructor() public {
        CA.push( msg.sender);
        CAno++;
        VersityAddress["Ahsanullah University"] = 0xC1BfA82A3F78535dE497f9690a3F705c2f4f7eAf;
        
    }

    modifier CAOnly(){
        for(uint i=0; i<CAno;i++){
            if( CA[i] == msg.sender){
                _; 
            }
        }
    }

    function CAaddress() public CAOnly() view returns(address[] memory){
        return CA;
    }

    function CAautherize(address _address) public CAOnly(){
        CA.push( _address);
        CAno++;
    }


    struct User { 
        string versityName;
        string roll;
        uint startDate;
        uint endDate;
        string hash;
        bool status;
    }
    struct Notice { 
        string id;
        uint startDate;
        uint endDate;
        string hash;
    }
    User[] UD;
    Notice[] ND;
    //string[] UserRoll;
    string currentR;
    string currentH;
    string currentVN;

    function CreateNotice(string calldata _ID,uint _ED,string calldata _H) public CAOnly() returns (int){
        for(uint i = 0; i < ND.length ; i++){
            if(keccak256(abi.encodePacked((ND[i].hash))) == keccak256(abi.encodePacked((_H)))){
                return 0;
            }
            else if((keccak256(abi.encodePacked((ND[i].id))) == keccak256(abi.encodePacked((_ID))))){
                return 1;
            }
        }
        
        ND.push(Notice({id : _ID,startDate: block.timestamp,endDate: _ED, hash : _H}));
        return 2;
        
    }

    function CreateUser(string calldata _VN,string calldata _R,uint _ED,string calldata _H) public CAOnly() returns (int){
        for(uint i = 0; i < UD.length ; i++){
            if(keccak256(abi.encodePacked((UD[i].hash))) == keccak256(abi.encodePacked((_H)))){
                return 0;
            }
            else if((keccak256(abi.encodePacked((UD[i].roll))) == keccak256(abi.encodePacked((_R)))) && (keccak256(abi.encodePacked((UD[i].versityName))) == keccak256(abi.encodePacked((_VN))))){
                return 1;
            }
        }
        
        if(msg.sender == VersityAddress[_VN]){
            UD.push(User({versityName : _VN,roll : _R,startDate: block.timestamp,endDate: _ED, hash : _H,status : true}));
            CertificateAddress[_H] = msg.sender;
            return 2;
        }
        
        
    }

    // function SetCurrentUser(string memory _R,string memory _VN) public CAOnly(){
    //     currentR = _R;
    //     currentVN = _VN;
    // }

    // function UserInfo2() public CAOnly() view returns(string memory ,string memory ,string memory){

    //     for(uint i = 0; i < UD.length ; i++){
    //         if((keccak256(abi.encodePacked((UD[i].roll))) == keccak256(abi.encodePacked((currentR)))) && (keccak256(abi.encodePacked((UD[i].versityName))) == keccak256(abi.encodePacked((currentVN))))){
    //             return (UD[i].versityName,UD[i].roll,UD[i].hash);
    //         }
    //     }

    // }

    function UserInfo(string calldata _R,string calldata _VN) public CAOnly() view returns (string memory ,string memory ,string memory,uint,uint) {

        for(uint i = 0; i < UD.length ; i++){
            if((keccak256(abi.encodePacked((UD[i].roll))) == keccak256(abi.encodePacked((_R)))) && (keccak256(abi.encodePacked((UD[i].versityName))) == keccak256(abi.encodePacked((_VN))))){
                return (UD[i].versityName,UD[i].roll,UD[i].hash,UD[i].startDate,UD[i].endDate);
            }
        }

    }
    function AllUser() public CAOnly() view returns (User[] memory) {
        return (UD);
    }


    function BanUser(string calldata _R,string calldata _VN) public CAOnly() {

        for(uint i = 0; i < UD.length ; i++){
            if((keccak256(abi.encodePacked((UD[i].roll))) == keccak256(abi.encodePacked((_R)))) && (keccak256(abi.encodePacked((UD[i].versityName))) == keccak256(abi.encodePacked((_VN))))){
                UD[i].status = false;
            }
        }

    }

    // function RevocationList(string memory _A) public CAOnly(){
    //     CRL[_A] = 1;
    // }

    // function ViewRevocationList() public CAOnly() view returns(string memory){
    //     if(CRL[currentR]==0){
    //         return string(abi.encodePacked(currentR," is not banned.."));
    //     }
    //     else{
    //         return string(abi.encodePacked(currentR," is banned.."));
    //     }
    // }

    // function CurrentHash(string memory _H) public CAOnly(){
    //     currentH = _H;
    // }

    // function CheckCertificate4() public CAOnly() view returns(string memory){

    //     for(uint i = 0; i < UD.length ; i++){
    //         if(keccak256(abi.encodePacked((UD[i].hash))) == keccak256(abi.encodePacked((currentH)))){
    //             return "Authenticated Certificate";
    //         }
    //     }
    //     return "False Certificate";
        
    // }

    // function CurrentHashandVN(string memory _H,string memory _VN) public CAOnly(){
    //     currentH = _H;
    //     currentVN = _VN;
    // }

    // function CheckCertificate2() public CAOnly() view returns(string memory){
    //     if(CertificateAddress[currentH] ==  VersityAddress[currentVN]){
    //         return "Authenticated Certificate";
    //     }
    //     else{
    //         return "False Certificate";
    //     }
    // }

    // function CheckCertificate3(string memory _H,string memory _VN) public CAOnly() view returns(string memory){
    //     if(CertificateAddress[_H] ==  VersityAddress[_VN]){
    //         return "Authenticated Certificate";
    //     }
    //     else{
    //         return "False Certificate";
    //     }
    // }

    function CheckCertificate(string calldata _H,string calldata _VN) public view returns (string memory) {
        for(uint i = 0; i < UD.length ; i++){
            if((keccak256(abi.encodePacked((UD[i].hash))) == keccak256(abi.encodePacked((_H)))) &&(UD[i].status==false)){
                return "Certificate Revoked!!";
            }
        }
        return (CertificateAddress[_H] ==  VersityAddress[_VN]) ? 
        "Authenticated Certificate" : "False Certificate"; 
    }

}