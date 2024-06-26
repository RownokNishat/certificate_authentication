import React, { Component, useEffect, useState} from 'react';
import Web3 from 'web3';
import axios from 'axios';
import DatePicker from 'react-date-picker';
import {Link , useNavigate}  from "react-router-dom";
import './App.css';
import Authenticate from '../abis/Authenticate.json';

const ipfsClient = require('ipfs-http-client')
const projectId = '2H7jMnviMZjZB4fq4w0leaswjCQ';
const projectSecret = 'e508e5b9f5e92b15c0f02a871e4b5524';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' ,headers: {authorization: auth,},}) // leaving out the arguments will default to these values

class Table extends Component {
  render() {
      var heading = this.props.heading;
      var body = this.props.body;
      console.log(typeof heading,typeof body[0])
      return (
          <table>
              <thead style={{textAlign:"center"}}>
                  <tr >
                      {heading.map(head => <th>{head}</th>)}
                  </tr>
              </thead>
              <tbody>
                  {body.map(row => <TableRow row={row} />)
                  }
              </tbody>
          </table>
      );
  }
}

class TableRow extends Component {
  render() {
      var row = this.props.row;
      console.log(row)
      return (
          <tr>
              {row.map(val => <td style={{fontSize : "15px"}}>{val}</td>)}
          </tr>
      )
  }
}

class APanel extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
        this.setState({CDate : `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`})
        var a = await this.fetchData()
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
      async fetchData() {
        var Allusers = await this.state.contract.methods.AllUser().call({from: this.state.account,})
        for (var i=0; i < Allusers.length; i++) {
          Allusers[i][2] = `${new Date(Allusers[i][2] * 1000).toLocaleDateString('en-GB')}`
          Allusers[i][3] = `${new Date(Allusers[i][3] * 1000).toLocaleDateString('en-GB')}`
          if(Allusers[i][5]==true){
            Allusers[i][5]='Certified'
          }
          else{
            Allusers[i][5]='Revoked'
          }
        }
        this.setState({Allusers : Allusers})
        
        for (var i=0; i < Allusers.length; i++) {
          Allusers[i] = [Allusers[i][0],Allusers[i][1],Allusers[i][2],Allusers[i][3],Allusers[i][4],Allusers[i][5]]
        }
        this.setState({ArrayUser : Allusers})
        console.log(this.state.ArrayUser)
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
          CDate : null,
          Allusers : null,
          ArrayUser : null
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


        try {
          for (var i=0; i < this.state.Allusers.length; i++) {
            if(this.state.Allusers[i][5]!='Revoked' && this.state.Allusers[i][0]==Vname && this.state.Allusers[i][1]==roll){
            await this.state.contract.methods.BanUser( roll,Vname).send({from: this.state.account,});
            }
        }
          //await testing();
        } catch (e) {
          console.error(e);
        }
        window.alert('Already Revoked')
        
        //console.log(this.state.useraccount)
      }

    render() {
      const datas = this.state.ArrayUser;
      var heading = ['Versity Name', 'Student ID', 'Start Date', 'End Date', 'Hash','Status'];
      let msg;
      if (datas) {
        msg = this.state.ArrayUser;
      } else {
        msg = [[true]];
      }
        return (
            <div>
                <h1 className="mt-5 mr-auto ml-auto" >Admin</h1>
                    <p>&nbsp;</p>
                    <select name="Doctype" onChange={this.ChangeDoc} className='text-center mb-2 mr-auto ml-auto' style={{fontSize: '30px', width : '400px' ,fontWeight: 'bold'} }>
                        <option value="/APanel"> ADMIN PANEL </option>
                        <option value="/Admin"> STUDENT CERTIFICATE </option>
                        <option value="/Notice"> DOCUMENT </option>
                    </select>
                    <hr style={{
                    color: '#000000',
                    backgroundColor: '#000000',
                    height: .5,
                    borderColor: '#000000'
                    }} />

                    <h1 className="mt-5 mr-auto ml-auto" >All Users</h1>


                    <Table heading={heading} body={msg} />



                    

                    <form className="my-5" onSubmit={this.onSubmit} style={{display : "inline-flex",ali : "auto"}}>

                    <label>
                      <b>Versity Name : </b>
                      <select name="name">
                        <option value="">Select--</option>
                        <option value="Ahsanullah University">Ahsanullah University</option>
                      </select>
                    </label>

                    <p><br></br></p>

                    <label class="mx-5">
                        <b>Student ID :</b>
                        <input className="ml-3" type="text" name="roll" placeholder="Enter Student Roll" required="required"/>

                    </label>
                    <p><br></br></p>
                    

                    <input type='submit' value="Revoke Certificate" style={{ backgroundColor: '#f75252' }} />
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

export default APanel;