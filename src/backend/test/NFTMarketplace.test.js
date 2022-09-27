const { expect } = require('chai');

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", async function () {
    let deployer, addr1, addr2, nft, marketplace
    let feePercent = 1
    let URI = "Sample URI"
    beforeEach(async function () {
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");;

        [deployer, addr1, addr2] = await ethers.getSigners();

        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });    
    describe("Deployment", function () {
        it("Track name and symbol of the NFT collection", async function () {
            expect(await nft.name()).to.equal("Vini NFT")
            expect(await nft.symbol()).to.equal("VINI")
        })
        it("Track feeAccount and feePersent of the marketplace", async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address)
            expect(await marketplace.feePercent()).to.equal(feePercent)
        })
    });
    describe("Minting NFTs", function () {
        it("Track each minted NFT", async function () {
            //mint in addr1
            await nft.connect(addr1).mint(URI)
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);
            //mint in addr2
            await nft.connect(addr2).mint(URI)
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);

        })
    });
    describe("Making marketplace items", function () {
        beforeEach(async function () {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        })
        it("Track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1))).to.emit(marketplace, "Offered").withArgs(1, nft.address, 1, toWei(1), addr1.address);
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            expect(await marketplace.itemCount()).to.equal(1);

            const item = await marketplace.items(1);
            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.sold).to.equal(false);
        })
    });

    describe("Purchasing marketplace item", function () {
        let price = 1;
        beforeEach(async function () {
            await nft.connect(addr1).mint(URI);
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
        })
        it("Update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async function () {
            const sellerInitalEthBal = await addr1.getBalance();
            const feeAccountInitalEthBal = await deployer.getBalance();
            const totalPriceInWei = await marketplace.getTotalPrice(1);
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })).to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address)
            const sellerFinalEthBal = await addr1.getBalance();
            const feeAccountFinalEthBal = await deployer.getBalance();
            const feeEth = (feePercent / 100) * price;
            expect(+fromWei(totalPriceInWei)).to.equal(price + feeEth);
            expect(+fromWei(sellerFinalEthBal)).to.equal(price + + fromWei(sellerInitalEthBal));
            // expect(+fromWei(feeAccountFinalEthBal)).to.equal(+fromWei(feeAccountInitalEthBal));
            expect(await nft.ownerOf(1)).to.equal(addr2.address);
            expect((await marketplace.items(1)).sold).to.equal(true);
        })
    })
})