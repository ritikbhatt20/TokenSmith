import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction
} from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount,
  createSetAuthorityInstruction,
  AuthorityType
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintNft() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Generate a new wallet keypair and airdrop SOL
  const fromWallet = Keypair.generate();
  const toWallet = new PublicKey(
    "G2k6ShTNEyJo84Gu6Dey6ubKagaFQzjBxffncNtPJuqR"
  );

  let mint: PublicKey;
  let fromTokenAccount: Account;

  async function createNft() {
    const fromAirdropSignature = await connection.requestAirdrop(
      fromWallet.publicKey,
      LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirdropSignature);

    // Create new NFT mint
    mint = await createMint(
      connection,
      fromWallet,
      fromWallet.publicKey,
      null,
      0 // only allow whole tokens
    );
    console.log(`Created NFT: ${mint.toBase58()}`);

    fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet,
      mint,
      fromWallet.publicKey
    );
    console.log(`Created NFT holding Account: ${fromTokenAccount.address.toBase58()}`);
  }

  async function mintNft() {
    // Mint 1 token(NFT) to the TokenAccount that we have created
    const signature = await mintTo(
        connection,                                         
        fromWallet,
        mint,                                               
        fromTokenAccount.address,
        fromWallet.publicKey,
        1
      );
      console.log(`Mint NFT Signature: ${signature}`);
  }

  async function lockNft() {
    // Create our transaction to change minting permissions
    let transaction = new Transaction().add(createSetAuthorityInstruction(
        mint,
        fromWallet.publicKey,
        AuthorityType.MintTokens,
        null
    ));

    //Send Transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    console.log(`Lock Signature: ${signature}`);
  }

  return (
    <div style={{ marginTop: 50 }}>
      Mint NFT Section
      <div>
        <button onClick={createNft}>Create NFT</button>
        <button onClick={mintNft}>Mint NFT</button>
        <button onClick={lockNft}>Lock NFT</button>
      </div>
    </div>
  );
}

export default MintNft;
