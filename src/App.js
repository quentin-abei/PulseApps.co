import React, { useEffect, useState } from "react";
import "./App.css";
import { ConnectButton, Modal } from "web3uikit";
import logo from "./images/plsalogo.jpg";
import Coin from "./components/Coin";
import {abouts} from "./about";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

const App = () => {
  const [btc, setBtc] = useState(80);
  const [pls, setPls] = useState(30);
  const [plsx, setPlsx] = useState(60);
  const [phiat, setPhiat] = useState(30);
  const [loan, setLoan] = useState(30);
  const [hex, setHex] = useState(30);
  const [modalPrice, setModalPrice] = useState();
  const Web3Api = useMoralisWeb3Api();
  const {Moralis, isInitialized} = useMoralis();
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState();


  async function getRatio(tick, setPerc){

    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const results = await query.first();
    if(results){ 
    let up =  Number(results.attributes.up);
    let down =  Number(results.attributes.down);
    let ratio = Math.round(up/(up+down)*100);
    setPerc(ratio);
    }
  }


  useEffect(() => {
    if(isInitialized){
    getRatio("BTC", setBtc);
    getRatio("PLS", setPls);
    getRatio("PLSX", setPlsx);
    getRatio("PHIAT", setPhiat);
    getRatio("LOAN", setLoan);
    getRatio("HEX", setHex);



    async function createLiveQuery(){
      let query = new Moralis.Query('Votes');
      let subscription = await query.subscribe();
      subscription.on('update', (object) => {
        
        if(object.attributes.ticker === "PLS"){
          getRatio("PLS", setPls);
        }else if(object.attributes.ticker === "PLSX"){
          getRatio("PLSX", setPlsx);
        }else if(object.attributes.ticker === "BTC"){
          getRatio("BTC", setBtc);
        }else if(object.attributes.ticker === "PHIAT"){
          getRatio("PHIAT", setPhiat);
        }else if(object.attributes.ticker === "LOAN"){
          getRatio("LOAN", setLoan);
        }else if(object.attributes.ticker === "HEX"){
          getRatio("HEX", setHex);
        }

      });
    }


    createLiveQuery();
    }

  }, [isInitialized]);

  useEffect(() => {

    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await Web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if(modalToken){
    fetchTokenPrice()
  }
    
  }, [modalToken]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50px" />
          PulseApps
        </div>
        <ConnectButton />
      </div>
      <div className="instructions">
        Where do you think these Projects are going? Bull or Bear?
      </div>
      <div className="list">
        <Coin 
          perc={btc} 
          setPerc={setBtc} 
          token={"BTC"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin 
          perc={pls} 
          setPerc={setPls} 
          token={"PLS"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin 
          perc={plsx} 
          setPerc={setPlsx} 
          token={"PLSX"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin 
          perc={phiat} 
          setPerc={setPhiat} 
          token={"PHIAT"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin 
          perc={loan} 
          setPerc={setLoan} 
          token={"LOAN"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin 
          perc={hex} 
          setPerc={setHex} 
          token={"HEX"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
      </div>

      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={modalToken}
      >
        <div>
          <span style={{ color: "blue" }}>{`Price: `}</span>
          {modalPrice}$
        </div>


         <div>
          <span style={{ color: "blue" }}>{`About`}</span>
        </div>
        <div>
          {modalToken &&
            abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>
       
      </Modal>
    </>
  );
};

export default App;