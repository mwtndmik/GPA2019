import React, { Component } from "react";
import SimpleStorageContract from "./LEthRoom.json";
import getWeb3 from "./utils/getWeb3";
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ipfs from './ipfs';
import MyDropzone from './fileUpload';
import AppTop from './AppBarOwner';
import CircularIndeterminate from './uploading';
//import fetch from './fetch';

import "./App.css";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  web3: null, accounts: null, contract: null,
                    name: '', files: [], buffer: null,
                    ipfsHash: null, url: null, ipfsHash_URI: null, 
                    url_URI: null, message: '', message2: '', tokenId: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleMint = this.handleMint.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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
      console.log(this.state.web3)
    
      //fetch();
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
    const { contract, accounts } = this.state;
    
    const supply = await contract.methods.totalSupply().call()
    console.log(supply)
    const isupply = await parseInt(supply);
    const tokenId = await isupply + 1;
    console.log(tokenId);
    
    this.setState({ tokenId })
    const URI =  {
      "name": this.state.name,
      "id": this.state.tokenId,
      "description": {
        "homeAddress":  this.state.homeAddress,
        "rent": this.state.rent,
        "layout": this.state.layout,
        "area": this.state.area,
        "floor": this.state.floor,
        "direction": this.state.direction,
        "builtYear": this.state.builtYear,
        "mailAddress": this.state.mailAddress
      },
      "image": this.state.url,
    }
    console.log(URI)

    const string = JSON.stringify(URI);
    const buffer = ipfs.types.Buffer.from(string);
    
    this.setState({message2 : 'now'});
    await ipfs.add(buffer, (err, results) => {
      if(err) {
        alert('登録が失敗しました')
        return;
      } 
      const ipfsHash_URI = results[0].hash;
      console.log(ipfsHash_URI);
      if(ipfsHash_URI) {
        this.setState({message2: null});
        alert('登録が完了しました！')
      }
      this.setState({
        ipfsHash_URI,
        url_URI: 'https://gateway.ipfs.io/ipfs/'+ipfsHash_URI
      });
      });
    
  }
  
  handleMint = async() => {
    const { contract, web3, accounts, url_URI, rent } = this.state;
    const irent = parseFloat(rent) * 1000000000000000;
    console.log(irent)
    const result = await contract.methods.mintRoom(url_URI, irent).send({
      from: accounts[0]
    });
    console.log(result);
    
  }

  onDrop(files) {
    this.setState({ files });
    const file = files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const result = reader.result;
      const buffer = ipfs.types.Buffer.from(result);
      this.setState({ buffer })
    }
  }

  onCancel() {
    this.setState({
      files: []
    });
  }

  handleUpload = async() => {
    this.setState({message : 'now'});
    const { buffer } = this.state;
    await ipfs.add(buffer, (err, results) => {
      if(err) {
        alert('アップロードが失敗しました')
        return;
      } 
      const ipfsHash = results[0].hash;
      console.log(ipfsHash);
      if(ipfsHash) {
        this.setState({message: null});
        alert('アップロードが完了しました！')
      }
        this.setState({
          ipfsHash,
          url: 'https://gateway.ipfs.io/ipfs/'+ipfsHash
        });
      });
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
    </li>
    ));

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
         <AppTop/>
         <h2>物件情報を登録してください</h2>

         <div className="boxCenter">
            <MyDropzone
              onDrop={this.onDrop.bind(this)}
              onFileDialogCancel={this.onCancel.bind(this)} />
            <p>{files}</p>
         </div>

         <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={this.handleUpload}>アップロード</Button>
              { !this.state.message ? <p></p> : <CircularIndeterminate/> }
          </Grid>

         <form >
         <Grid container spacing={16}>
           <Grid item xs={12}>
           <TextField
              id="standard-name"
              label="名前"
              onChange={this.handleChange('name')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>
          
          
           <Grid item xs={12}>
            <TextField
              id="standard-name"
              label="住所"
              onChange={this.handleChange('homeAddress')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>
         

          
           <Grid item xs={12}>
            <TextField
              id="standard-name"
              label="家賃(ETH)"
              onChange={this.handleChange('rent')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>
          
           <Grid item xs={12}>
            <TextField
              id="modules"
              label="レイアウト"
              onChange={this.handleChange('layout')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
              id="modules"
              label="面積"
              onChange={this.handleChange('area')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
              id="modules"
              label="階数"
              onChange={this.handleChange('floor')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
              id="modules"
              label="方向"
              onChange={this.handleChange('direction')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
              id="modules"
              label="建設年"
              onChange={this.handleChange('builtYear')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

            <Grid item xs={12}>
            <TextField
              id="modules"
              label="メールアドレス"
              onChange={this.handleChange('mailAddress')}
              //className={classes.textField}
              margin="normal"
            />
            </Grid>

          
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={this.handleClick}>登録</Button>
              { !this.state.message2 ? <p></p> : <CircularIndeterminate/> }
              <Button variant="contained" className="btn-color2" onClick={this.handleMint}>発行</Button>
            </Grid>
            </Grid>
         </form>
      </div>
    );
  }
}

export default withStyles(styles)(App);
