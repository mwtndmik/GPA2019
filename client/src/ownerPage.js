import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SimpleStorageContract from "./LEthRoom.json";
import getWeb3 from "./utils/getWeb3";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import AppTop from './AppBarOwner';
import fetch from './fetch';
import {
  BrowserRouter as Router,
  Link,
} from 'react-router-dom'
import './App.css';

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



class ownerPage extends Component {

    state = {  web3: null, accounts: null, contract: null, tokenURIs: [],
               storage: [] };

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
        }, 100);
      
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    
    handleClick = async() => {
        const { contract, accounts, address, tokenId } = this.state;
        const id = parseInt(tokenId);
        console.log(address);
        console.log(id);
        
        const approve = await contract.methods.ownerApprove(address, id).send({
            from: accounts[0]
        });
        if(approve) {
            alert('契約が開始されました')
        }
        
    }

    handleClearApprove = async() => {
        const { contract, accounts, iaddress, itokenId } = this.state;
        const id = parseInt(itokenId);
        const clearApprove = await contract.methods.ownerClearApprove(iaddress, id).send({
          from: accounts[0]
        });
        if(clearApprove) {
          alert('契約の取り消しが完了しました')
        }
    }

    
    handleReturn = async() => {
        const { contract, accounts } = this.state;
        const owner = await accounts[0]
        const tokens = await contract.methods.getOwnerTokens(owner).call();
        for (var i = 0; i < tokens.length; i++) {
          const index = await tokens[i]
          const tokenURI = await contract.methods.tokenURI(index).call();
          await this.setState({ tokenURIs: this.state.tokenURIs.concat(tokenURI)});
        }
    }
    
    handleRecover = async() => {
        const { contract, accounts } = this.state;
        const recover = await contract.methods.payToOwner().send({
          from: accounts[0]
        });
        if(recover) {
          alert('家賃の回収が完了しました')
        }
    }
    
  
  render () {
  return (
    <div className="App">
    <AppTop />
    <h2>契約を開始する</h2>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="アドレス"
          onChange={this.handleChange('address')}
          margin="normal"
          />
      </Grid>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="トークンID"
          onChange={this.handleChange('tokenId')}
          margin="normal"
          />
      </Grid>
    </Grid>
    <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={this.handleClick}>承認</Button>
    </Grid>
    </Grid>
    <br/>

    <div>
    <h2>あなたが所持している物件</h2>
    <Paper >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>名前</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">住所</TableCell>
              <TableCell align="right">建設年</TableCell>
              <TableCell align="right">画像</TableCell>
              <TableCell align="right">詳細</TableCell>
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
            <TableCell align="right">{row.builtYear}</TableCell>
            <TableCell align="right"><Button href={row.image} color="primary">画像</Button></TableCell>
            <TableCell align="right"><Link to={'/room/' + row.id}>詳細</Link></TableCell>
          </TableRow>
        ))}
      </TableBody>
        </Table>
    </Paper>
    </div>
    <br/>
    <Grid item xs={12}>
        <Button className="btn-color2"variant="contained" onClick={this.handleRecover}>家賃を回収する</Button>
    </Grid>

    <h2>契約を終了する</h2>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="アドレス"
          onChange={this.handleChange('iaddress')}
          margin="normal"
          />
      </Grid>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <TextField
          id="standard-name"
          label="トークンID"
          onChange={this.handleChange('itokenId')}
          margin="normal"
          />
      </Grid>
    </Grid>
    <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={this.handleClearApprove}>承認</Button>
    </Grid>
    </Grid>
    </div>
  );
  }
}

ownerPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ownerPage);