import React, { Component, useState} from 'react';
import Web3 from 'web3';
import DatePicker from 'react-date-picker';
import {Link , useNavigate}  from "react-router-dom";
import './App.css';
import Authenticate from '../abis/Authenticate.json';

const ipfsClient = require('ipfs-http-client')
const projectId = '2H7jMnviMZjZB4fq4w0leaswjCQ';
const projectSecret = 'e508e5b9f5e92b15c0f02a871e4b5524';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {authorization: auth,},}) // leaving out the arguments will default to these values



class Admin extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        this.setState({CDate : `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`})
        const CAaddress = await this.state.contract.methods.CAaddress().call({from: this.state.account,});
        var check= false;
        for (var i=0; i < CAaddress.length; i++) {
          if(CAaddress[i]===this.state.account){
            check = true;
          }
        }
        if(check===false){
          window.location = "\Restrict"
        }
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
          user: null,
          date: null,
          CDate : null
        }
        this.handleChange = this.handleChange.bind(this);
        this.ChangeDoc = this.ChangeDoc.bind(this);
        //this.onSubmit3 = this.onSubmit3.bind(this);
    
      }
      ChangeDoc = (event) => {
        event.preventDefault()
        var link = event.target.value
        window.location = link
      }

      handleChange = (event) => {
        event.preventDefault()
        var date = event.target.value
        console.log(date)
        // var currentDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
        // console.log(currentDate)
        console.log(this.state.CDate)
        date = new Date(date);
        //console.log('date', Math.floor(date.getTime() / 1000))
          
        var unixTimeStamp = Math.floor(date.getTime() / 1000);
        
        this.setState({date: unixTimeStamp})
        
        console.log(`${unixTimeStamp}`)
        //console.log(this.state.date)
        //console.log('name1', event.target.name1.value)
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
    
      onSubmit = async (event) => {
        event.preventDefault()
        console.log("Submitting file to ipfs...")
        const Vname = event.target.name.value
        const roll = event.target.roll.value
        this.setState({ name: Vname })
        this.setState({ roll: roll })


        var date = event.target.date.value
        date = new Date(date);
        var unixTimeStamp = Math.floor(date.getTime() / 1000);
        this.setState({date: unixTimeStamp})
        const Edate = this.state.date
        var message; 

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
          Check();
          //testing();
          
          
          
          
        })
        const testing = async () => {
          try {
            if(2 === message.toNumber()){
              window.alert('Student Info is Being Added.....')
              console.log(Vname, roll,Edate, this.state.hash)
              await this.state.contract.methods.CreateUser(Vname, roll,Edate, this.state.hash).send({from: this.state.account,});
            }
            else if(1 === message.toNumber()){
              window.alert('Student Info Already Exists!!')
            }
            else if(0 === message.toNumber()){
              window.alert('Duplicate Certificate Cannot be Used!!')
            }
          
            
          } catch (e) {
            console.error(e);
          }
        };
        const Check = async () => {
          try {
            message = await this.state.contract.methods.CreateUser(Vname, roll,Edate, this.state.hash).call({from: this.state.account,});
            console.log(message.toNumber())

            await testing();
          } catch (e) {
            console.error(e);
          }
        };
        
        //console.log(this.state.useraccount)
      }

    render() {
        return (
            <div>
                <h1 className="mt-5 mr-auto ml-auto" >Admin</h1>
                    <p>&nbsp;</p>
                    <select name="Doctype" onChange={this.ChangeDoc} className='text-center mb-2 mr-auto ml-auto' style={{fontSize: '30px', width : '400px' ,fontWeight: 'bold'} }>
                        <option value="/Admin"> STUDENT CERTIFICATE </option>
                        <option value="/APanel"> ADMIN PANEL </option>
                        <option value="/Notice"> DOCUMENT </option>
                    </select>
                    <hr style={{
                    color: '#000000',
                    backgroundColor: '#000000',
                    height: .5,
                    borderColor: '#000000'
                    }} />
                    <p><br></br></p>


                    <form className="mb-5" onSubmit={this.onSubmit}>

                    <label>
                      <b>Versity Name : </b>
                      <select name="name">
                        <option value="">Select--</option>
                        <option value="Ahsanullah University">Ahsanullah University</option>
                      </select>
                    </label>

                    {/* <label>
                        <b>Versity Name :</b>
                        <input className="ml-3" type="text" name="name1" placeholder="Enter Versity Name" />

                    </label> */}
                    <p><br></br></p>

                    <label>
                        <b>Student ID :</b>
                        <input className="ml-3" type="text" name="roll" placeholder="Enter Student Roll"  required="required"/>

                    </label>
                    <p><br></br></p>
                    
                    <label>
                      <b>Expiration :</b>
                      <input className="ml-3" min={this.state.CDate} type="date" name="date" onChange={this.handleChange}/>
                    </label>
                    <p><br></br></p>
                    
                    <p><b>Certificate : </b></p>
                    <input type='file' onChange={this.captureFile}  required="required"/>
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

export default Admin;