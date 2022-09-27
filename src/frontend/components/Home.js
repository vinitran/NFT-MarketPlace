import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/Home.css'
import { NFTItem } from "./NFTItem";
const ethers = require("ethers")

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const loadMarketplaceItems = async () => {
    // Load all unsold items
    console.log(marketplace);
    const itemCount = await marketplace.itemCount();
    console.log(itemCount);
    console.log("itemCount");

    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      console.log(i);
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false)
    setItems(items)
    console.log(items)
  }



  useEffect(() => {
    loadMarketplaceItems()
  }, [marketplace])

  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )

  return (
    <div className="home-wrapper">
      {items.length > 0 ?
        <div className="row">
          {
            items.map((item) =>
              <div className="nft-item-wrapper">
                <NFTItem className="nft-item" item={item} />
              </div>
            )
          }
        </div>
        :
        <div>No listed assets</div>
      }
    </div>
  )
}

export default Home;