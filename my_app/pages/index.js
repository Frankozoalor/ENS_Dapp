import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [walletConnected, setWalletConnected] = useState(false);
    const Web3ModalRef = useRef();
    const [ens, setEns] = useState("");
    const [address, setAddress] = useState("");

     /**
   * Sets the ENS, if the current connected address has an associated ENS or else it sets
   * the address of the connected account
   */

     const setENSOrAddress= async(address, web3Provider) => {
       var _ens = await web3Provider.lookupAddress(address);
       if(_ens){
         setEns(_ens)
       } else{
         setAddress(address);
       }
     };

     const getProviderOrSigner = async() => {
       const provider = await Web3ModalRef.current.connect();
       const web3Provider = new providers.Web3Provider(provider);
       const { chainId } = await web3Provider.getNetwork();
       if(chainId !== 4){
         window.alert("change network to Rinkeby");
         throw new Error("chnage network to Rinkeby");
       }
       const signer = web3Provider.getSigner();
       const address = await signer.getAddress();
       await setENSOrAddress(address, web3Provider);
       return signer;
     }

     const connectWallet = async() => {
       try{
         await getProviderOrSigner(true);
         setWalletConnected(true);
       }catch(err){
         console.error(err);
       }
     };

     const renderButton =() =>{
       if(walletConnected){
         <div> Wallet Connect</div>
       } else{
         return(
           <button onClick={connectWallet} className ={styles.button}>
             connect your wallet
           </button>
         );
       }
     }

     useEffect(() => {
       if(!walletConnected){
         Web3ModalRef.current = new Web3Modal({
           network: "rinkeby",
           providerOptions: {},
           disableInjectedProvider: false
         })
         connectWallet();
       }
     },[walletConnected]);

     return(
       <div>
         <head>
           <title> ENS Dapp </title>
           <meta name="description" content="ENS-Dapp"/>
           <link rel = "icon" href="/favicon.ico"/>
         </head>
         <div className={styles.main}>
         <div>
           <h1 className={styles.title}>
             Welcome to LearnWeb3 punks {ens ? ens : address}!
           </h1>
           <div className={styles.description}>
           Its an NFT collection for Ethereum Name Service Users.
           </div>
           {renderButton()}
         </div> 
         <div>
           <img className={styles.image} src="./learnweb3punks .png"/>
         </div>
         </div>
         <footer className={styles.footer}>
         Made with &#10084; by Frank
         </footer>
       </div>
     );
}
