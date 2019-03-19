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
  Link,
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


class tokenList extends Component {
    constructor(props) {
      super(props);
      this.state = {  web3: null, accounts: null, contract: null, notApproved:[],
                      tokenURIs: [], storage: []};
    }

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
        await this.setState({ web3, accounts, contract: instance });
        await this.handleReturn();
        const storage = fetch(this.state.tokenURIs);
        setTimeout(() => {
          this.setState({ storage })
          console.log(this.state.storage)
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
        const { contract, notApproved } = this.state;
        const supply = await contract.methods.totalSupply().call();
        const number = parseInt(supply);
        for (var i = 1; i < number + 1 ; i++) {
            const check = await contract.methods.checkApproved(i).call();
            console.log(i);
            console.log(check);
            if(check == false) {
              await this.setState({ notApproved: this.state.notApproved.concat(i)});
            }
        }
        await this.handleURI();
    }
    
    handleURI = async() => {
        const { contract, notApproved, tokenURIs } = this.state;
        const number = await notApproved.length;
        for (var i = 0; i < number; i++) {
          const index = await notApproved[i]
          const tokenURI = await contract.methods.tokenURI(index).call();
          await this.setState({ tokenURIs: this.state.tokenURIs.concat(tokenURI)});
        }
        console.log(this.state.tokenURIs);
    }


  render () {
      return (
        <div className="App">
        <AppTop />
        <h2>売り出し中の物件</h2>
        <Paper >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">住所</TableCell>
              <TableCell align="right">家賃(月)</TableCell>
              <TableCell align="right"></TableCell>
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
            <TableCell align="right"><Link to={'/room/' + row.id}>詳細</Link></TableCell>
            <TableCell align="right"><Button href={'mailto:'+ row.mailAddress + '?subject=' + '不動産賃貸契約の締結依頼' + '&body=' + 'address: ' + this.state.accounts[0] + '%0d%0a'+ 'id: ' + row.id} color="primary" >メールを送る</Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
        </Table>
      </Paper>
        </div>
      );

    
  }
}


tokenList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(tokenList);