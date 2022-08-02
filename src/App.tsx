/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const { formatEther } = ethers.utils;

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "multiple-providers-web3modal", // Required
      infuraId: "2943713c7b254b5eb3d4f68a10ea05c3", // Required unless you provide a JSON RPC url; see `rpc` below
    },
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      appName: "multiple-providers-web3modal", // Required
      infuraId: "2943713c7b254b5eb3d4f68a10ea05c3", // required
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [wallet, setWallet] = useState<string>("");
  const [connection, setConnection] = useState<any>();
  const [balance, setBalance] = useState("");

  const connectWallet = async (): Promise<void> => {
    try {
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection, "any");
      const signer = provider.getSigner(0);
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setWallet(address);
      setConnection(connection);
      setProvider(provider);
      setBalance(formatEther(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = () => {
    web3Modal.clearCachedProvider();
    setWallet("");
    setProvider(undefined);
    setBalance("");
  };

  useEffect(() => {
    if (connection && provider) {
      connection.on("accountsChanged", async ([currentAccount]: string[]) => {
        console.log("accountsChanged: ", currentAccount);
        const balance = await provider.getBalance(currentAccount);
        setWallet(currentAccount);
        setBalance(formatEther(balance));
      });
      connection.on("chainChanged", () => {
        window.location.reload();
      });

      connection.on("connect", (info: { chainId: number }) => {
        console.log(info);
      });

      connection.on(
        "disconnect",
        (error: { code: number; message: string }) => {
          console.log(error);
        }
      );
    }
  }, [connection, provider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multiple wallets</h1>
        {!wallet ? (
          <button onClick={connectWallet}>Connect</button>
        ) : (
          <button onClick={disconnectWallet}>Disconnect</button>
        )}
        <ul>
          {wallet && (
            <li>
              <strong>Account:</strong> {wallet}
            </li>
          )}
          {balance && (
            <li>
              <strong>Balance:</strong> {parseFloat(balance).toFixed(4)} ETH
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;
