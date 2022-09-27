import React from 'react'
import '../css/NFTItem.css'
import { Link } from 'react-router-dom'

const ethers = require("ethers")

export const NFTItem = (props) => {
  //console.log(props.product);
  return (
    props.item ?
      <Link to={`/nft/${props.item.itemId.toString()}`}>
        <div className="item-wrapper">
          <img className="image" src={`https://cloudflare-ipfs.com/ipfs/${props.item.image.slice(7)}`} />
          <div className="description">
            <div className="name">
              {props.item.name}
            </div>
            <div className="price-id">
              <div>Price: {ethers.utils.formatEther(props.item.totalPrice)} ETH</div>
              <div>Id: {props.item.itemId.toString()}</div>
            </div>
          </div>
        </div>
      </Link>
      : null
  )
}