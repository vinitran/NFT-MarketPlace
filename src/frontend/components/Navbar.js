import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import '../css/Navbar.css'
function Navbar({ web3Handler, account }) {
    //   useSelector(state => state.counter.isLogin);
    //   console.log(isLogin)
    return (
        <div className="navbar-wrapper">
            <div className="navbar-left">
                <div>Marketplace</div>
            </div>
            <div className="navbar-center">
                <Link to="/" className="item">Home</Link>
                <Link to="/my-listed-item" className="item">My Listed Item</Link>
                <Link to="/my-purchase" className="item">My Purchase</Link>
                <Link to="/list-item" className="item">Mist Item</Link>
            </div>
            <div className="navbar-right">
                {account ?
                    <button type="button" className="btn btn-outline-secondary">{account.slice(0, 8) + '...' + account.slice(38, 42)}</button>
                    :
                    <button onClick={web3Handler} type="button" className="btn btn-outline-secondary">Connect wallet</button>
                }
            </div>
        </div>
    )
}

export default Navbar;