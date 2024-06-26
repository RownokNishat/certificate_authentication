import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Authenticate from '../abis/Authenticate.json';

const ipfsClient = require('ipfs-http-client')
const projectId = '2H7jMnviMZjZB4fq4w0leaswjCQ';
const projectSecret = 'e508e5b9f5e92b15c0f02a871e4b5524';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {authorization: auth,},}) // leaving out the arguments will default to these values

class Validation extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    /*
    const accounts = await window.web3.eth.getAccounts()
    console.log(accounts)
    const contract = await window.web3.eth.Contract(Authenticate.abi, Authenticate.networks[5777].address)
    console.log(contract)
    const ca = await contract.methods.CAaddress().call()
    console.log(ca)
    console.log(await window.web3.eth.Contract(Authenticate.abi, Authenticate.networks[5777].address).methods.CAaddress(accounts[0]).call())
    */
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    //this.setState({ useraccount: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Authenticate.networks[networkId]

    /* if(await this.state.contract.methods.UserInfo(this.state.useraccount).call()){
     console.log(await this.state.contract.methods.UserInfo(this.state.useraccount).call())
     }
     if(this.state.useraccount){
       const memeHash = await this.state.contract.methods.UserInfo(this.state.useraccount).call()
     console.log(memeHash)}
    */


    if (networkData) {
      const contract = web3.eth.Contract(Authenticate.abi, networkData.address)
      this.setState({ contract })
      //const memeHash = await contract.methods.get().call()
      //this.setState({ memeHash })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  async showValidemsg() {

    console.log('Certificate Status :', await this.state.contract.methods.CheckCertificate().call())
  }

  async showValidemsg2() {

    console.log('Certificate Status :', await this.state.contract.methods.CheckCertificate3(this.state.hash,this.state.name).call())
  }

  constructor(props) {
    super(props)

    this.state = {
      showHash: '',
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      name: null,
      hash: null,
      roll: null,
      user: null
    }
    this.captureFile2 = this.captureFile2.bind(this);
    this.onSubmit3 = this.onSubmit3.bind(this);
    this.showValidemsg = this.showValidemsg.bind(this);
    this.showValidemsg2 = this.showValidemsg2.bind(this);
    this.captureFile3 = this.captureFile3.bind(this);
    this.onSubmit4 = this.onSubmit4.bind(this);

  }
  captureFile2 = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit3 = (event) => {
    event.preventDefault()
    console.log("Checking File...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      //this.setState({ hash: result[0].hash })
      if (error) {
        console.error(error)
        return
      }
      this.state.contract.methods.CurrentHash(result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ hash: result[0].hash })
      })
      setTimeout(() => this.showValidemsg(), 15000)

    })
    //console.log(this.state.useraccount)
  }

  captureFile3 = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit4 = async (event) => {
    event.preventDefault()
    console.log("Checking File...")
    const Vname = event.target.name.value
    
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)

      if (error) {
        console.error(error)
        return
      }
      this.setState({ hash: result[0].hash })
      valid();

    })
    
    const valid = async () => {
      try {
        console.log('Hash:',this.state.hash);
        const CType = await this.state.contract.methods.CheckCertificate(this.state.hash,Vname).call({from: this.state.account,});
        var str = 'Certificate type: '+ CType
        window.alert(str)
        console.log('Certificate type:', CType);
      } catch (e) {
        console.error(e);
      }
    };
    
  }

  render() {
    return (
      <div>
            {/* <h1 className="mt-5 mr-auto ml-auto" >Validation</h1>
                <p>&nbsp;</p>
                <form className="mb-5" onSubmit={this.onSubmit3}>

                  <p><b>Certificate : </b></p>
                  <input type='file' onChange={this.captureFile2} />
                  <p><br></br></p>
                  <input type='submit' style={{ backgroundColor: '#00A884' }} />
                  <p><br></br></p>
                </form>


                <hr style={{
                  color: '#000000',
                  backgroundColor: '#000000',
                  height: .5,
                  borderColor: '#000000'
                }} /> */}


                <h1 className="mt-5 mr-auto ml-auto" >Validation</h1>
                <p>&nbsp;</p>
                <form className="mb-5" onSubmit={this.onSubmit4}>
                    <label>
                      <b>Versity Name : </b>
                      <select name="name" onChange={this.handleChange}>
                        <option value="">Select--</option>
                        <option value="Ahsanullah University">Ahsanullah University</option>
                      </select>
                    </label>
                  <p><br></br></p>


                  <p><b>Certificate : </b></p>
                  <input type='file' onChange={this.captureFile3}  required="required"/>
                  <p><br></br></p>
                  <input type='submit' style={{ backgroundColor: '#00A884' }} />
                  <p><br></br></p>
                </form>


                <hr style={{
                  color: '#000000',
                  backgroundColor: '#000000',
                  height: .5,
                  borderColor: '#000000'
                }} />
                <p><br></br></p>
        </div>
      );
  }
}

export default Validation;
