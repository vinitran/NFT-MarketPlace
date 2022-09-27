import React, { useState } from 'react'
import '../css/List.css'
import { NFTStorage} from 'nft.storage'
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE0MDhhNjgyMjk3OTg4RkUwNjA5OUU5RGE4ODQzNzE4MzY0OWJmZDIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NDIyMjg1NjczMCwibmFtZSI6InZpbml0cmFuIn0.nj4WVOBKgErheRcL275gTmARdpfVxpVB9dflwyNUJck'
const client = new NFTStorage({ token: apiKey })
const ethers = require("ethers")
const List = (props) => {
    const [image, setImage] = useState()
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const createNFT = async () => {
        try {
            //Upload NFT to IPFS & Filecoin
            const metadata = await client.store({
                name: name,
                description: description,
                image: image,
            });
            console.log("completely create metadata!");
            mintThenList(metadata);
        } catch (error) {
            console.log(error);
        }
    }
    const mintThenList = async (result) => {
        const uri = `https://cloudflare-ipfs.com/ipfs/${result.ipnft}/metadata.json`
        // mint nft 
        console.log(uri);
        await (await props.nft.mint(uri)).wait()
        console.log("completely create minting!");
        // get tokenId of new nft 
        const id = await props.nft.tokenCount()
        // approve marketplace to spend nft
        await (await props.nft.setApprovalForAll(props.marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await (await props.marketplace.makeItem(props.nft.address, id, listingPrice)).wait()
        console.log("complete listing")
    }
    return (
        <div className="list-wrapper">
            <div>
                <div className="list-header">List New NFT</div>
                <div className="sub-title">* Required fields</div>
                <div className="title">Image, Video, Audio, or 3D Model</div>
                <div className="sub-title">File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</div>
                <input
                    onChange={(event) => setImage(event.target.files[0])}
                    type="file"
                    className="custom-file-input input-image"
                    id="inputGroupFile02" />
                <div className="title">Name</div>
                <input onChange={(e) => setName(e.target.value)} className="input-text" placeholder="Item name" />
                <div className="title">Description</div>
                <div className="sub-title">The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</div>
                <textarea onChange={(e) => setDescription(e.target.value)} type="text" className="input-text description" placeholder="Provide a detailed description of your item" />
                <div className="title">Price (ETH)</div>
                <div className="sub-title">The quantity of payment in ETH given by buyer</div>
                <input onChange={(e) => setPrice(e.target.value)} type="number" className="input-text" placeholder="0 ETH" />
                <div></div>
                <button onClick={e => createNFT(e)} type="button" className="btn btn-secondary">Mint And List</button>
            </div>
        </div>
    )
}
export default List;
