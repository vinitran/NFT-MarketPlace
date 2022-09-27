import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faCreditCard, faBars } from '@fortawesome/free-solid-svg-icons'
import '../css/ItemDetail.css'

import { NFTItem } from "./ItemDetail";
import { Image } from 'react-bootstrap';

const ethers = require("ethers")
function ItemDetail({ marketplace, nft }) {
    const params = useParams();
    const [items, setItems] = useState(null)
    const loadMarketplaceItems = async () => {
        const item = await marketplace.items(params.nftId);
        const uri = await nft.tokenURI(item.tokenId)
        const response = await fetch(uri)
        const metadata = await response.json()
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        setItems({
            totalPrice,
            itemId: item.itemId,
            seller: item.seller,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image
        })
        console.log(items.name)
    }
    const buyMarketItem = async (item) => {
        await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
        loadMarketplaceItems()
      }
    useEffect(() => {
        loadMarketplaceItems()
    }, [])
    return (
        <div className="container">
            {items ?
                <div>
                    <div className="details" >
                        <div className="big-img">
                            <img src={`https://cloudflare-ipfs.com/ipfs/${items.image.slice(7)}`} />
                        </div>
                        <div className="box">
                            <div className="top">
                                <div className="name">{items.name}</div>
                                <div className="inLine selled">
                                    <div className="shop inLine">
                                        <div>Selled by</div>
                                        <div className="shop-name">{items.seller.slice(0, 5)}...{items.seller.slice(-5)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="middle-time">
                                <div className="timeselling">Posted in August 25, 2022 at 5:08pm</div>
                            </div>
                            <div className="middle-price">
                                <div className="price-text">Current Price</div>
                                <div className="inLine price-eth-usd">
                                    <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880" />
                                    <div className="price-eth">{ethers.utils.formatEther(items.totalPrice)}</div>
                                    <div className="price-usd">$1332</div>
                                </div>
                                <div className="inLine button-group">
                                    <button onClick={() => buyMarketItem(items)} className="inLine" >
                                        <FontAwesomeIcon icon={faCreditCard} className="icon" />
                                        <div>Buy now</div>
                                    </button>
                                    <button className="inLine" >
                                        <FontAwesomeIcon icon={faTag} className="icon" />
                                        <div>Make Offer</div>
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="wrapper-description">
                        <div className="wrapper-title">
                            <FontAwesomeIcon icon={faBars} className="icon" />
                            <div className="title">Description</div>
                        </div>
                        <div className="detail-description">{items.description}</div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default ItemDetail;