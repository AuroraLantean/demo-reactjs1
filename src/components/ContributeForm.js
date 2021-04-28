import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';//use router to refresh the page
//push router makes an new browser history... bad => Use Router.replaceRoute()

class ContributeForm extends Component {
  state ={
    value: '',
    errorMessage: '',
    loading: false
  };//in ether

  onSubmit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({loading: true, errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({errorMessage: err.message});
    }

    this.setState({loading: false, value: ''});//reset the state values
  };

  //Don't add () to this.onSubmit because we only want to pass a reference
  //but not to call at render time
  render () {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input value={this.state.value}
            onChange={event => this.setState({value: event.target.value})}
            label="ether" labelPosition="right" />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage.substring(0, 300)} />
        <Button primary loading={this.state.loading}>Contribute!</Button>
      </Form>
    );
  };
}

export default ContributeForm;