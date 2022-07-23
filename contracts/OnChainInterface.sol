// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract OnChainInterface {
    event dataWritten(address sensor);

    struct IOTData {
        string encryptedDataUri;
        uint256 timestamp;
    }

    mapping(address => IOTData[]) private SensorInput;
    mapping(address => bool) private isSensorVerified;
    mapping(address => bool) private isUserVerified;
    IOTData[] private allData;

    modifier checkSenderStatus() {
        require(isUserVerified[msg.sender], "User not verified to access data");
        _;
    }

    constructor() {
        isUserVerified[msg.sender] = true;
    }

    function write(string calldata _dataUri) public {
        require(isSensorVerified[msg.sender], "Not a verified Sensor");
        SensorInput[msg.sender].push(
            IOTData({encryptedDataUri: _dataUri, timestamp: block.timestamp})
        );
        allData.push(
            IOTData({encryptedDataUri: _dataUri, timestamp: block.timestamp})
        );
        emit dataWritten(msg.sender);
    }

    function readBySpecificIndex(address sensorAddress, uint256 index)
        public
        view
        checkSenderStatus
        returns (IOTData memory _Data)
    {
        return SensorInput[sensorAddress][index];
    }

    function readAllFromSensor(address sensorAddress)
        public
        view
        checkSenderStatus
        returns (IOTData[] memory _Data)
    {
        return SensorInput[sensorAddress];
    }

    function readAll()
        public
        view
        checkSenderStatus
        returns (IOTData[] memory _Data)
    {
        return allData;
    }

    function approveSensor(address _sensor) public checkSenderStatus{
        isSensorVerified[_sensor]=true;
    }
}
