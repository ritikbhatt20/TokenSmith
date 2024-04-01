import { 
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

import { 
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount
} from "@solana/spl-token";

import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {

  // const connection = new Connection(
  //   clusterApiUrl('devnet'),
  //   'confirmed'
  // );
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  const toWallet = new PublicKey("G2k6ShTNEyJo84Gu6Dey6ubKagaFQzjBxffncNtPJuqR");
  let mint: PublicKey;
  let fromTokenAccount: Account;

  async function createToken() {
    // const publicKey = await fromWallet?.publicKey;
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);

    let  publicKey = wallet?.publicKey;
    if (!publicKey) {
      // Handle the case where fromWallet is undefined or does not have a publicKey
      console.error("fromWallet is undefined or does not have a publicKey");
      return; // Or throw an error, return an error message, etc.
    }
    
    // Create new token mint
    mint = await createMint(
      connection,
      fromWallet,
      publicKey,
      null, 
      9
    );
    console.log(`Created token: ${mint.toBase58()}`);

    // Get the associated token accont or ATA of fromWallet address and if it does not exist, create it
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      publicKey
    );

    console.log(`Created Token Account: ${fromTokenAccount.address.toBase58()}`);
  }

  async function mintToken() {
    let publicKey = wallet?.publicKey;
    if (!publicKey) {
      // Handle the case where fromWallet is undefined or does not have a publicKey
      console.error("fromWallet is undefined or does not have a publicKey");
      return; // Or throw an error, return an error message, etc.
    }
    // Mint 1 token to the "fromTokenAccount" account we just created
    const signature = await mintTo(
      connection,                                         
      fromWallet,
      mint,                                               
      fromTokenAccount.address,
      publicKey,
      10000000000
    );
    console.log(`Mint Signature: ${signature}`);
  }

  async function checkBalance() {
    // get the supply of tokens we have minted till existence
    const mintInfo = await getMint(
      connection,
      mint
    )
    console.log(mintInfo.supply);
    
    // get the balnce of tokens left in ATA
    const tokenAccountInfo = await getAccount(
      connection,
      fromTokenAccount.address
    )
    console.log(tokenAccountInfo.amount);
  }

  async function sendToken() {
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);

    const signature = await transfer(
      connection,
      fromWallet,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      1000000000
    );
    console.log(`Finished transfer with ${signature}`);
  }

  return (
    <div>
      Mint Token Section
      <div>
        <button onClick={createToken}>Create Token</button>
        <button onClick={mintToken}>Mint Token</button>
        <button onClick={checkBalance}>Check Balance</button>
        <button onClick={sendToken}>Send Token</button>
      </div>
    </div>
  );
}

export default MintToken;
