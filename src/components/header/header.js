import React from 'react';
//import {Link} from 'react-router-dom';
//import { ReactComponent as Logo } from '../../assets/crown.svg';
import './header.scss';

const Header = ({ hidden }) => (
  <div className='header'>

    <div className='options'>
      <a className='option' href="https://www.google.com" target="_blank" rel="noreferrer">
      back to homepage
      </a>

    </div>
  </div>
);

//{user: {curentUser}, cart: {hidden}}

export default Header;
/**
    <div className='options'>
    <Link className='logo-container' to="/">
      <Logo className='logo' />
    </Link>

    <Link className='option' to='https://google.com'>
        HOME PAGE
      </Link>

    </div>



    */