//inside component folder
//https://react.semantic-ui.com/collections/table
import React, { Component } from 'react';
import {Button, Table} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
  onApprove = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
  };
  /*if MetaMask says 
    "Insufficient gas", check if this account has contributed!
    "Gas limit set dangerously high. Approving this txn is likely to fail" => check if you've enough condition to succeed, as MetaMask will simulate to see if it's going to FAIL
    regardless how much gas you would pay
  */
  onFinalize = async () => {
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
  };

  render() {
    const {Header, Row, Cell, HeaderCell} = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} negative={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>{request.complete ? null:(
          <Button color="green" basic onClick={this.onApprove}>Approve</Button>)}</Cell>
        <Cell>{request.complete ? null:(
          <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>)}</Cell>
      </Row>
    );
  }
}
export default RequestRow;

/**
------------------==
//New page: show info
import React, { Component } from 'react';

class RequestIndex extends Component {
  render() {
    return (
      <h3>Show Info List</h3>
    );
  }
}
export default RequestIndex;
*/