//View any profile
//Can update info
//Cannot be same certificate for different users
//Simulation if block is corrupted
//None can modify
//Ban list for malicious nodes____Done
//Fetch Data____Done
//Connect with Rinkeby network (truffle migrate --reset --network=rinkeby)_____Done

import React, { Component } from 'react';
import Web3 from 'web3';
import img2 from '../logo.png';
import './App.css';
import Authenticate from '../abis/Authenticate.json';
import Nav from 'react-bootstrap/Nav';
import { BrowserRouter as Router, Route , Link , Routes, Navigate} from 'react-router-dom';
import StudentInfo from './StudentInfo';
import Validation from './Validation';
import Admin from './Admin';
import Restrict from './Restrict';
import Home from './Home';
import Notice from './Notice';
import APanel from './APanel';
import ProtectedRoutes from "./ProtectedRoutes.jsx";

const ipfsClient = require('ipfs-http-client')
const projectId = '2H7jMnviMZjZB4fq4w0leaswjCQ';
const projectSecret = 'e508e5b9f5e92b15c0f02a871e4b5524';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {authorization: auth,},}) // leaving out the arguments will default to these values

class App extends Component {

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
  async adminCheck() {
    const CA = await this.state.contract.methods.CAaddress().call()
    console.log(CA)
    for (let i = 0; i < CA.length; i++) {
      if (CA[i]==this.state.account) {
        return true
      }
    }
    return false 
  }


  async showUserInfo() {

    console.log('UserInfo :', await this.state.contract.methods.UserInfo().call())
  }
  async showUserInfo2() {

    this.setState({user : await this.state.contract.methods.UserInfo().call()})
  }
  async showUserInfo3() {
    this.setState({showHash : this.state.user[2]})
    window.open(`https://infura-ipfs.io/ipfs/${this.state.showHash}`)
  }
  async showValidemsg() {

    console.log('Certificate Status :', await this.state.contract.methods.CheckCertificate().call())
  }

  async showValidemsg2() {

    console.log('Certificate Status :', await this.state.contract.methods.CheckCertificate3(this.state.hash,this.state.name).call())
  }

  async VRL() {

    console.log('Ban Status :', await this.state.contract.methods.ViewRevocationList().call())
  }
  setuseraddress = (event) => {
    event.preventDefault()
    const Vname = event.target.name.value
    const roll = event.target.roll.value
    const acc = this.state.account
    this.state.contract.methods.SetCurrentUser(roll, Vname).send({ from: acc })
    setTimeout(() => this.showUserInfo(), 15000)
    setTimeout(() => this.showUserInfo2(), 15300)
    setTimeout(() => this.showUserInfo3(), 15600)
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
    this.setuseraddress = this.setuseraddress.bind(this);
    this.showUserInfo = this.showUserInfo.bind(this);
    this.showUserInfo2 = this.showUserInfo2.bind(this);
    this.showUserInfo3 = this.showUserInfo3.bind(this);
    this.VRL = this.VRL.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.captureFile2 = this.captureFile2.bind(this);
    this.onSubmit3 = this.onSubmit3.bind(this);
    this.showValidemsg = this.showValidemsg.bind(this);
    this.showValidemsg2 = this.showValidemsg2.bind(this);
    this.captureFile3 = this.captureFile3.bind(this);
    this.onSubmit4 = this.onSubmit4.bind(this);
    this.adminCheck = this.adminCheck.bind(this);

  }


  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    const Vname = event.target.name.value
    const roll = event.target.roll.value
    this.setState({ name: Vname })
    this.setState({ roll: roll })
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result[0])
      this.setState({ hash: result[0].hash })
      if (error) {
        console.error(error)
        return
      }
      /*
       this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
         return this.setState({ memeHash: result[0].hash }),this.setState({ useraccount: useraccount })
         ,this.setState({ name: name }),this.setState({ roll: roll }),this.setState({ key: key })
         ,this.setState({ hash: result[0].hash })
       })
       */
      this.state.contract.methods.CreateUser(Vname, roll, result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ hash: result[0].hash })
      })
      console.log('Confirming....')
    })
    //console.log(this.state.useraccount)
  }

  onSubmit2 = (event) => {
    event.preventDefault()
    const roll = event.target.BanAccount.value
    console.log(roll)
    this.setState({ roll: roll })
    this.state.contract.methods.RevocationList(roll).send({ from: this.state.account })
    console.log('Banning....')

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
      //this.setState({ hash: result[0].hash })
      if (error) {
        console.error(error)
        return
      }
      this.state.contract.methods.CurrentHashandVN(result[0].hash,Vname).send({ from: this.state.account }).then((r) => {
        return this.setState({ hash: result[0].hash })
      })
      setTimeout(() => this.showValidemsg2(), 15000)
      //console.log('Certificate Status :', await this.state.contract.methods.CheckCertificate2().call())
      //setTimeout(() => console.log(), 15000)

    })
    //console.log(this.state.useraccount)
  }



  render() {
    return (
      <div>
        <Router>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 col-lg-2 mr-0"
            href="/"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <img src={img2} class="img mr-2" style={{width:'20px',height:'20px',}}/>
            Certificate Authentication
          </a>
          
            <Nav.Link as={Link} to={"/Admin"}>Admin</Nav.Link>
            <Nav.Link as={Link} to={"/StudentInfo"}>Student Info</Nav.Link>
            <Nav.Link as={Link} to={"/Validation"}>Validation</Nav.Link>
          
            
          
          <ul className="navbar-nav px-3 ">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <p className="text-white">Account Address : </p><small className="text-white">{this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Routes>
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route path="/Home" element={<Home/>}></Route>
                <Route element={<ProtectedRoutes />}>
                  <Route path="/Admin" element={<Admin/>}></Route>
                </Route>
                <Route path="/StudentInfo" element={<StudentInfo/>}></Route>
                <Route path="/Notice" element={<Notice/>}></Route>
                <Route path="/APanel" element={<APanel/>}></Route>
                <Route path="/Restrict" element={<Restrict/>}></Route>
                <Route path="/Validation" element={<Validation/>}></Route>
              </Routes>
                {/* <h1 className="mt-5 mr-auto ml-auto" >Admin(Student Registration)</h1>
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  { //<img src={`https://ipfs.infura.io/ipfs/${this.state.memeHash}`} /> 
                  }
                </a> 
                <p>&nbsp;</p>
                <h2 className="mb-5 mr-auto ml-auto">Student form</h2>
                <form className="mb-5" onSubmit={this.onSubmit}>

                  <label>
                    <b>Versity Name :</b>
                    <input className="ml-3" type="text" name="name" placeholder="Enter Versity Name" />

                  </label>
                  <p><br></br></p>

                  <label>
                    <b>Roll No :</b>
                    <input className="ml-3" type="text" name="roll" placeholder="Enter Student Roll" />

                  </label>
                  <p><br></br></p>

                  <input type='file' onChange={this.captureFile} />
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




                {/* <h2 className="mb-5 mr-auto ml-auto">Student Info</h2>
                <form className="mb-5" onSubmit={this.setuseraddress}>

                  <label>
                    <b>Versity Name :</b>
                    <input className="ml-3" type="text" name="name" placeholder="Enter Versity Name" />

                  </label>
                  <p><br></br></p>

                  <label>
                    <b>Roll No :</b>
                    <input className="ml-3" type="text" name="roll" placeholder="Enter Student Roll" />

                  </label>
                  <p><br></br></p>

                  
                  <button type='submit'>Show User Certificate</button>
                  <p><br></br></p>
                  
                </form> 



                 <hr style={{
                  color: '#000000',
                  backgroundColor: '#000000',
                  height: .5,
                  borderColor: '#000000'
                }} />*/}





                {/*<h1 className="mt-5 mr-auto ml-auto" >Admin(Ban List)</h1>
                <p>&nbsp;</p>
                <form className="mb-5" onSubmit={this.onSubmit2}>
                  <label>
                    <b>Address to Ban :</b>
                    <input className="ml-3" type="text" name="BanAccount" placeholder="Account Address" />
                  </label>
                  <p><br></br></p>

                  <input type='submit' style={{ backgroundColor: '#00A884' }} />
                  <p><br></br></p>
                </form>

                <button onClick={() => { this.setuseraddress(); setTimeout(() => this.VRL(), 15000); }}>Show Ban List</button> */}


                {/* <a
                  href="../../public/index2.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button>Verify</button>
                </a> 


                <hr style={{
                  color: '#000000',
                  backgroundColor: '#000000',
                  height: .5,
                  borderColor: '#000000'
                }} />*/}




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
                }} />


                <h1 className="mt-5 mr-auto ml-auto" >Validation 2</h1>
                <p>&nbsp;</p>
                <form className="mb-5" onSubmit={this.onSubmit4}>
                  <label>
                    <b>Versity Name :</b>
                    <input className="ml-3" type="text" name="name" placeholder="Enter Versity Name" />

                  </label>
                  <p><br></br></p>


                  <p><b>Certificate : </b></p>
                  <input type='file' onChange={this.captureFile3} />
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

              </div>
            </main>
          </div>
        </div>
        <div class="footer-basic bg-dark" style={{position:'relative',left:'0',bottom:'0',right:'0',height:'80px'}}>
        <footer>
            <div class="social text-center">
              <a href="#"><i class="icon ion-social-instagram"></i></a>
              <a href="#"><i class="icon ion-social-snapchat"></i></a>
              <a href="#"><i class="icon ion-social-twitter"></i></a>
              <a href="#"><i class="icon ion-social-facebook"></i></a>
            </div>
            <ul class="list-inline text-center">
                <li class="list-inline-item"><a href="#">Home</a></li>
                <li class="list-inline-item"><a href="#">Services</a></li>
                <li class="list-inline-item"><a href="#">About</a></li>
                <li class="list-inline-item"><a href="#">Terms</a></li>
                <li class="list-inline-item"><a href="#">Privacy Policy</a></li>
            </ul>
            <p class="text-white text-center">Certificate Authentication © 2022</p>
        </footer>
        </div>
        </Router>
      </div>
    );
  }
}

export default App;
