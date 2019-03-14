import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SimpleStorageContract from "./LEthRoom.json";
import getWeb3 from "./utils/getWeb3";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppTop from './AppBarBuyer';
import fetch from './fetch';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});


class buyerPage extends Component {

    state = {  web3: null, accounts: null, contract: null,
               tokenURIs: [] , storage: [], irent: null};

    componentDidMount = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({ web3, accounts, contract: instance });
        await this.handleReturn();
        const storage = fetch(this.state.tokenURIs);
        setTimeout(() => {
          this.setState({ storage })
          console.log(this.state.storage)
          this.setRent();
        }, 100);
        
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

    
    handleReturn = async() => {
        const { contract, accounts } = this.state;
        const supply = await contract.methods.totalSupply().call();
        const isupply = parseInt(supply);
        for(var i = 1; i < isupply + 1; i++) {
          const address = await contract.methods.getApproved(i).call();
          if(address === accounts[0]) {
            const uri = await contract.methods.tokenURI(i).call();
            this.setState({ tokenURIs: this.state.tokenURIs.concat(uri)})
          }
        }
    }

    
    handleClick = async(number) => {
        const { contract, accounts } = this.state;
        await contract.methods.depositMoney().send({
            from: accounts[0],
            value: number
        });
    }

    setRent = async() => {
      const { web3 } = this.state;
      this.state.storage.map(row => (
        this.setState({ irent: parseInt(web3.utils.toWei(row.rent))})
      ))
    }
    
  
  render () {
  return (
    <div className="App">
    <AppTop />
    <h2>あなたが借りている物件</h2>
    <Paper >
      <Table >
        <TableHead>
          <TableRow>
            <TableCell>名前</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">住所</TableCell>
            <TableCell align="right">家賃</TableCell>
            <TableCell align="right">画像</TableCell>
            <TableCell align="right">詳細</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.storage.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.homeAddress}</TableCell>
              <TableCell align="right">{row.rent}ETH</TableCell>
              <TableCell align="right"><Button href={row.image} color="primary">画像</Button></TableCell>
              <TableCell align="right">
                  <Link to={'/room/' + row.id}>詳細</Link>
              </TableCell>
              {console.log(this.state.irent)}
              <TableCell align="right"><Button color="primary" onClick={() => this.handleClick(this.state.irent)}>家賃を払う</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
    </div>
  );
  }
}

buyerPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(buyerPage);