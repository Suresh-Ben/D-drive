const { ethers } = require("hardhat");

async function main() {
    const [deploy] = await ethers.getSigner();
    const Drive = await ethers.getContractFactory("Drive");

    console.log("Deploying contract....!!!!")
    const contract = await contract.deploy();
    return contract;
}

main()
    .then((contract) => {
        console.log("Congtract deployed successfully at address : " + contract.address);
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });