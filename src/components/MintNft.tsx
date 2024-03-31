import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  Account,
  getMint,
  getAccount,
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

  return (
    <div style={{ marginTop: 50 }}>
      Mint NFT Section
      <div>
        <button onClick={createNft}>Create NFT</button>
        <button>Mint NFT</button>
        <button>Lock NFT</button>
      </div>
    </div>
  );
}

export default MintNft;
