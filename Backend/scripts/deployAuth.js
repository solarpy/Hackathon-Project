const { ethers } = require("hardhat");

async function main() {
    const Auth = await ethers.getContractFactory("Auth");

    const auth = await Auth.deploy();
    console.log("Contract deployed to address:", auth.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });