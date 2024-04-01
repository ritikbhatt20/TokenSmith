import "./App.css";
import Header from "./components/Header";
import MintNft from "./components/MintNft";
import MintToken from "./components/MintToken";
import { useMemo } from "react"; //react hook
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
  const endpoint =
    "https://fluent-little-sun.solana-devnet.quiknode.pro/371c43da2c0c0ea39a2d68d940b83d1c7a0a05b5/";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Header />
          <div className="App">
            <header className="App-header">
              <MintToken />
              <MintNft />
            </header>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
