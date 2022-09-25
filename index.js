// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


const FROM_SECRET_KEY = new Uint8Array(
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);

// console.log("Public Key of the generated keypair", getPublicKey);

// Get Keypair from Secret Key
const from = Keypair.fromSecretKey(FROM_SECRET_KEY);

// Generate another Keypair (account we'll be sending to)
const to = Keypair.generate();

// Exact the public and private key from the keypair (senderWallet)
const fromPublicKey = new PublicKey(from._keypair.publicKey).toString();
var fromBalance = 0;

// Exact the public and private key from the keypair (getWallet)
const toPublicKey = new PublicKey(to._keypair.publicKey).toString();
var toBalance = 0;

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Make a wallet (keypair) from privateKey and get its balance
        // const myWallet = await Keypair.fromSecretKey(privateKey);
        const fromWalletBalance = await connection.getBalance(
            new PublicKey(fromPublicKey)
        );
        fromBalance = fromWalletBalance;
    
        const toWalletBalance = await connection.getBalance(
            new PublicKey(toPublicKey)
        );
        toBalance = toWalletBalance;
    
        console.log(`From Wallet balance: ${parseInt(fromBalance) / LAMPORTS_PER_SOL} SOL`);
        console.log(`To Wallet balance: ${parseInt(toBalance) / LAMPORTS_PER_SOL} SOL`);

    } catch (err) {
        console.log(err);
    }

};

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log(fromBalance);
    // Transfer 50% of the sender balance to toWallet  
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: Math.floor(fromBalance * 0.5)
        })
    );
    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );

    console.log('Signature is ', signature);
};

const mainFunction = async () => {
    await getWalletBalance();
    await transferSol();
    await getWalletBalance();
};

mainFunction();
