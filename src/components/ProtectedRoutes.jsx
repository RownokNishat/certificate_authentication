import React, { Component } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import Web3 from 'web3';
import Authenticate from '../abis/Authenticate.json';
import App from './App';

const useAuth = async () => {
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
  const web3 = window.web3
  const accounts = await web3.eth.getAccounts()
  const networkId = await web3.eth.net.getId()
  const networkData = Authenticate.networks[networkId]
  const contract = web3.eth.Contract(Authenticate.abi, networkData.address)

  const CAaddress = await contract.methods.CAaddress().call({from: accounts[0],});
  
  for (var i=0; i < CAaddress.length; i++) {
    if(CAaddress[i]===accounts[0]){
      console.log(accounts[0])
      console.log(CAaddress)
      return true;
    }
  }
  return false;
};

const ProtectedRoutes =  () => {
  try {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/Restrict" />;
  } catch (error) {}
  
};

export default ProtectedRoutes;