// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error UnDefinedAddress();
error UserAlreadyAdded();
error AccessDeclined();

contract Drive {

    struct User {
        string name;
        string[] files;
    }
    mapping(address => User) drive;


    mapping( address => mapping(address => bool)) allowedMap;
    mapping( address => address[] ) allowed;

    mapping( address => address[] ) allowedBy;

    function UserName(address user) external view returns(string memory) {
        return drive[user].name;
    }

    function PushFile(string calldata file) external returns(bool) {
        drive[msg.sender].files.push(file);

        return true;
    }

    function Display() external view returns(string[] memory) {
        return drive[msg.sender].files;
    }

    function Allow(address user) external returns(bool) {
        if( allowedMap[msg.sender][user] == true ) revert UserAlreadyAdded();

        allowedMap[msg.sender][user] = true;
        allowed[msg.sender].push(user);

        allowedBy[user].push(msg.sender);

        return true;
    }

    function BlockAccess(address user) external returns(bool) {
        if( allowedMap[msg.sender][user] == false ) return true;

        allowedMap[msg.sender][user] = false;

        uint length = allowed[msg.sender].length;
        for(uint i = 0; i < length; i++)
        {
            if(allowed[msg.sender][i] == user)
            {
                allowed[msg.sender][i] = allowed[msg.sender][length - 1];
                allowed[msg.sender].pop();
            }
        }

        length = allowedBy[user].length;
        for(uint i = 0; i < length; i++)
        {
            if(allowedBy[user][i] == msg.sender)
            {
                allowedBy[user][i] = allowedBy[user][length - 1];
                allowedBy[user].pop();
            }
        }

        return true;
    }

    function SharedDrives() external view returns(address[] memory) {
        return allowedBy[msg.sender];
    }

    function DisplayShared(address user) external view returns(string[] memory) {
        if(allowedMap[user][msg.sender] == false) revert AccessDeclined();

        return drive[user].files;
    }
    
}