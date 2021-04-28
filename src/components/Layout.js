import React from 'react';
import Header from './Header';
import {Container} from 'semantic-ui-react';
import Head from 'next/head';//see the header in browser > dev tool > tab= Inspector/Element

/*to house all common components to be re-used
  put campaign list as child inside the Layout
  Copy semantic-ui css stylesheet at http://react.semantic-ui.com/theming
  , background: '#262626', color: '#ffffff'
*/
export default props => {
  return (
    <Container style={{}}>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css" />
        <link rel="shortcut icon" href="#/favicon.ico" />
      </Head>
      <Header />
      {props.children}
      <h3  style={{}}>2020 Team. All Rights Reserved.</h3>
    </Container>
  );//props.children are what's between <Layout></Layout> in index.js
};//div -> Container
