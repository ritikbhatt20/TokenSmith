import { 
  clusterApiUrl,
  Connection,
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

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {

  const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed'
  );

  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  const toWallet = new PublicKey("G2k6ShTNEyJo84Gu6Dey6ubKagaFQzjBxffncNtPJuqR");

  let mint: PublicKey;
  let fromTokenAccount: Account;

  async function createToken() {
    const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirdropSignature);
    
    // Create new token mint
    mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null, 
      9
    );
    console.log(`Created token: ${mint.toBase58()}`);

    // Get the associated token accont or ATA of fromWallet address and if it does not exist, create it
    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );

    console.log(`Created Token Account: ${fromTokenAccount.address.toBase58()}`);
  }

  async function mintToken() {
    // Mint 1 token to the "fromTokenAccount" account we just created
    const signature = await mintTo(
      connection,                                         
      fromWallet,
      mint,                                               
      fromTokenAccount.address,
      fromWallet.publicKey,
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
