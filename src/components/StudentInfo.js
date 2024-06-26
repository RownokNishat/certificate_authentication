import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Authenticate from '../abis/Authenticate.json';

const ipfsClient = require('ipfs-http-client')
const projectId = '2H7jMnviMZjZB4fq4w0leaswjCQ';
const projectSecret = 'e508e5b9f5e92b15c0f02a871e4b5524';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {authorization: auth,},}) // leaving out the arguments will default to these values

class StudentInfo extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        this.setState({visible: 'hidden'})
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
          user: '',
          visible: 'hidden'
        }
        this.setuseraddress = this.setuseraddress.bind(this);
      }

      setuseraddress = async (event) => {
        event.preventDefault()
        const Vname = event.target.name.value
        const roll = event.target.roll.value
        const acc = this.state.account
          try {
            const user = await this.state.contract.methods.UserInfo(roll, Vname).call({from: acc,});
            this.setState({user : user})
            console.log('UserInfo :',user)
            this.setState({showHash : this.state.user[2]})
            this.setState({visible: 'visible'})
            //window.open(`https://infura-ipfs.io/ipfs/${this.state.showHash}`)
            window.open(`https://ipfs.io/ipfs/${this.state.showHash}`)
            

          } catch (e) {
            console.error(e);
          }


        //setTimeout(() => this.showUserInfo(), 15000)
        //setTimeout(() => this.showUserInfo2(), 15300)
        //setTimeout(() => this.showUserInfo3(), 15600)
      }


      


      render() {
        return (
          <div>
            <h2 className="mb-5 mt-5 mr-auto ml-auto">Student Info</h2>
                <form className="mb-5" onSubmit={this.setuseraddress}>

                <label>
                      <b>Versity Name : </b>
                      <select name="name" onChange={this.handleChange}>
                        <option value="">Select--</option>
                        <option value="Ahsanullah University">Ahsanullah University</option>
                      </select>
                    </label>
                  <p><br></br></p>

                  <label>
                    <b>Student ID:</b>
                    <input className="ml-3" type="text" name="roll" placeholder="Enter Student Roll" />

                  </label>
                  <p><br></br></p>

                  
                  <button type='submit'>Show User Certificate</button>
                  <p><br></br></p>
                  
                </form>
                <div style={{ visibility: `${this.state.visible}` }}>
                  <h2 className="mb-5 mt-5 mr-auto ml-auto">Certificate Info</h2>
                    <label>
                        <b>Versity Name : </b>
                        <i>{`${this.state.user[0]}`}</i>
                    </label>
                    <p><br></br></p>

                    <label>
                      <b>Student ID : </b>
                      <i>{`${this.state.user[1]}`}</i>
                    </label>
                    <p><br></br></p>
                    <label>
                      <b>Certificate Issue Date : </b>
                      <i>{`${new Date(this.state.user[3] * 1000).toLocaleDateString('en-GB')}`}</i>
                    </label>
                    <p><br></br></p>
                    <label>
                      <b>Certificate Expire Date : </b>
                      <i>{`${new Date(this.state.user[4] * 1000).toLocaleDateString('en-GB')}`}</i>
                    </label>
                    <p><br></br></p>
                </div>
                <hr style={{
                  color: '#000000',
                  backgroundColor: '#000000',
                  height: .5,
                  borderColor: '#000000'
                }} />
                <p><br></br></p>
                <p><br></br></p>
                <p><br></br></p>
        </div>
          );
  }
}

export default StudentInfo;

