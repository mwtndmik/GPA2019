import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SimpleStorageContract from "./LEthRoom.json";
import getWeb3 from "./utils/getWeb3";
import { withStyles } from '@material-ui/core/styles';
import AppTop from './AppBar';
import fetch from './fetch2';
import './App.css'
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



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

class roomInfo extends Component {
    constructor(props) {
      super(props);
      this.state = {  web3: null, accounts: null, contract: null,
        tokenURI: [], storage: [], name: '', id: '', address: '',
        rent: '', layout: '', area: '', floor: '', direction: '',
        builtYear: '', mailAddress: '', image: '', sample: ''
      };
      this.getInformation = this.getInformation.bind(this);
      this.setInformation = this.setInformation.bind(this);
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
        this.setState({ web3, accounts, contract: instance });
        await this.getInformation();
        const storage = fetch(this.state.tokenURI);
        setTimeout(() => {
          this.setState({ storage })
          console.log(this.state.storage)
        }, 100);
        setTimeout(() => {
          this.setInformation();
        }, 100)
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

    getInformation = async() => {
      const { params } = this.props.match
      const id = parseInt(params.id);
      const { contract } = this.state;
      const uri = await contract.methods.tokenURI(id).call();
      this.setState({ tokenURI: uri })
    }

    setInformation = async() => {
      const { storage } = this.state;
      await storage.map(r => 
        this.setState({ 
          name: r.name,
          id: r.id,
          address: r.homeAddress,
          rent: r.rent,
          layout: r.layout,
          area: r.area,
          floor: r.floor,
          direction: r.direction,
          builtYear: r.builtYear,
          mailAddress: r.mailAddress,
          image: r.image
        }))
    }
  
  render () {
    
    return (
      <div className="App">
        <AppTop/>
        <h2>{this.state.name}</h2>
        
        <img src={this.state.image} width="500" height="300"></img>
        <br/><br/>
        <div className="center">
        <Paper className="paper">
        <Table >
        
        <TableBody>
        
          <TableRow >
            <TableCell component="th" scope="row">
              住所
            </TableCell>
            <TableCell align="right">{this.state.address}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row">
              家賃
            </TableCell>
            <TableCell align="right">{this.state.rent}</TableCell>
          </TableRow>

          <TableRow >
            <TableCell component="th" scope="row">
              レイアウト
            </TableCell>
            <TableCell align="right">{this.state.layout}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row">
              面積
            </TableCell>
            <TableCell align="right">{this.state.area}</TableCell>
          </TableRow>

          <TableRow >
            <TableCell component="th" scope="row">
              階数
            </TableCell>
            <TableCell align="right">{this.state.floor}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row">
              方向
            </TableCell>
            <TableCell align="right">{this.state.direction}</TableCell>
          </TableRow>


          <TableRow >
            <TableCell component="th" scope="row">
              建設年
            </TableCell>
            <TableCell align="right">{this.state.builtYear}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row">
              家主の連絡先
            </TableCell>
            <TableCell align="right">{this.state.mailAddress}</TableCell>
          </TableRow>

        </TableBody>
        </Table>
    </Paper>
        </div>
      </div>
    );
  }
}

roomInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(roomInfo);