const { expect } = require('chai');

describe("Drive", () => {
    beforeEach(async() => {
        Drive = await ethers.getContractFactory("Drive");
        [owner, user1, user2, user3, ...users] = await ethers.getSigners();
        contract = await Drive.deploy();

        file1 = "trxycvjubknjsrvbasvjoiaysglvkanrv";
        file2 = "sdkbgsuyekbvsleivbsdlkhajrboiergb";
        file3 = "epaorghisupdbvkdhjbvdfjvebosibvsd";
        file4 = "mdzfvbdkzjhfvbkadyvbavbahdrvovbdj";
        file5 = "ryuiayvoibvkjdbzlvfjbdzfiubdjlbfj";
        file6 = "parhadvbjdiugahbsdkbvljkdbfvdblvk";
        file7 = "basiabvoaiufbiaufpihduifghdiudidf";
        file8 = "qkfjlbsivubdslidfbuifuiubildjbnkf";
    });

    describe("User tests", () => {
        it("username test", async() => {
            contract.connect(user1).SetName("USER ONE");
            contract.connect(user2).SetName("USER TWO");

            let name1 = await contract.UserName(user1.address);
            let name2 = await contract.UserName(user2.address);
            let name3 = await contract.UserName(user3.address);

            expect(name1).to.equal("USER ONE");
            expect(name2).to.equal("USER TWO");
            expect(name3).to.equal("");
        })

        it("upload test", async() => {
            await contract.PushFile(file1);
            let uploadedFile = await contract.Display();

            expect(uploadedFile[0]).to.equal(file1);
        });
    });

    describe("sharing tests", () => {
        it("allow test", async() => {
            await contract.connect(user1).Allow(user2.address);
            await expect(contract.connect(user1).Allow(user2.address)).to.be.revertedWith('UserAlreadyAdded');

            let sharedDrives = await contract.connect(user2).SharedDrives();
            expect(sharedDrives).to.deep.include(user1.address);
        });
        it("block access test", async() => {
            await contract.connect(user1).Allow(user2.address);
            let sharedDrives = await contract.connect(user2).SharedDrives();
            expect(sharedDrives).to.deep.include(user1.address);

            await contract.connect(user1).BlockAccess(user2.address);
            sharedDrives = await contract.connect(user2).SharedDrives();
            expect(sharedDrives).to.deep.not.include(user1.address);

        });

        it("access to shared files test", async() => {
            await contract.connect(user1).PushFile(file1);
            await contract.connect(user1).PushFile(file2);

            let uploadedFiles = await contract.connect(user1).Display();
            expect(uploadedFiles).to.deep.include(file1);
            expect(uploadedFiles).to.deep.include(file2);

            await contract.connect(user1).Allow(user2.address);
            let sharedFiles = await contract.connect(user2).DisplayShared(user1.address);
            expect(sharedFiles).to.deep.include(file1);
            expect(sharedFiles).to.deep.include(file2);

        });
    });
});