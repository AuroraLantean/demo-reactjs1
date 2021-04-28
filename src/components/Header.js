import React from 'react';
import { Menu } from 'semantic-ui-react';
/*to house all common components to be re-used
  put campaign list as child inside the Layout
  ,background: '#262626', color: '#ffffff'
*/
import { Link } from "../routes";

export default () => {
  return (
    <Menu style={{ marginTop:'10px'}}>
      <Link route="/">
        <a  style={{paddingTop: '12px'}}>Header Text</a>
      </Link>

      <Menu.Item position="right">
      <Link route="/">
        <a  style={{}}>Main Page</a>
      </Link>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <Link route="/ico">
        <a  style={{}}>ICO Page</a>
      </Link>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <Link route="/multisig">
        <a  style={{}}>MultiSig</a>
      </Link>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      <Link route="/dev">
        <a  style={{}}>Developer</a>
      </Link>

      </Menu.Item>
    </Menu>
  );//props.children are what's between <Layout></Layout> in index.js
};
/*The style of Menu.Item clashes with that of Link
so replace <Menu.Item>CrowdCoin</Menu.Item> with <Link></Link>

replace
        <Menu.Item>Campaigns</Menu.Item>
        <Menu.Item>+</Menu.Item>
*/