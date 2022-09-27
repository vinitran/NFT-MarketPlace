
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import { useState } from "react"
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { Spinner } from 'react-bootstrap'

import Navbar from "./Navbar";

import Home from "./Home";
import ItemDetail from "./ItemDetail";
import List from "./List";
import MyListedItems from "./MyListedItem";
import MyPurchases from "./MyPurchase";

const ethers = require("ethers")
function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    console.log("1")
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    console.log(marketplace);
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    console.log(nft);
    setNFT(nft)
    setLoading(false)
    console.log("a")
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar web3Handler={web3Handler} account={account} />
        <Routes>
          <Route path="/" element={<Home marketplace={marketplace} nft={nft} />} />
          <Route path="/nft/:nftId" element={<ItemDetail marketplace={marketplace} nft={nft} />} />
          <Route path="/list-item" element={<List marketplace={marketplace} nft={nft} />} />
          <Route path="/my-listed-item" element={<MyListedItems marketplace={marketplace} nft={nft} account={account} />} />
          <Route path="/my-purchase" element={<MyPurchases marketplace={marketplace} nft={nft} account={account} />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
