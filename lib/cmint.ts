// Crossmint's API key
const apiKey = "sk_staging...";

/**
 * Creates a Solana MPC wallet.
 * @param {string} apiKey - Crossmint API key.
 * @returns {Promise<object>} Response from Crossmint API.
 */
export async function createWallet(apiKey) {
    const response = await fetch("https://staging.crossmint.com/api/v1-alpha2/wallets", {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            type: "solana-mpc-wallet",
            linkedUser: "email:arthur-weasley@ministryofmagic.com",
        }),
    });
    return await response.json();
}

/**
 * Funds a Solana MPC wallet.
 * @param {string} apiKey - Crossmint API key.
 * @param {string} walletLocator - Wallet locator address.
 * @returns {Promise<object>} Response from Crossmint API.
 */
export async function fundWallet(apiKey, walletLocator) {
    const response = await fetch(`https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/balances`, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: 5,
            currency: "usdc",
        }),
    });
    return await response.json();
}

/**
 * Retrieves the balance of a Solana MPC wallet.
 * @param {string} apiKey - Crossmint API key.
 * @param {string} walletLocator - Wallet locator address.
 * @returns {Promise<object>} Wallet balance details.
 */
export async function getWalletBalance(apiKey, walletLocator) {
    const response = await fetch(`https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/balances?currency=usdc`, {
        method: "GET",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
    });
    return await response.json();
}

/**
 * Creates a serialized Solana transaction for transferring USDC.
 * @param {string} senderAddress - Sender wallet address.
 * @param {string} recipientAddress - Recipient wallet address.
 * @param {number} amount - Amount of USDC to transfer.
 * @returns {Promise<string>} Base58 encoded transaction string.
 */
export async function createUSDCTransferTransaction(senderAddress, recipientAddress, amount) {
    const { TransactionMessage, PublicKey, VersionedTransaction, Connection } = await import("@solana/web3.js");
    const { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, ASSOCIATED_TOKEN_PROGRAM_ID } = await import("@solana/spl-token");
    const bs58 = (await import("bs58")).default;

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
    const senderPublicKey = new PublicKey(senderAddress);
    const recipientPublicKey = new PublicKey(recipientAddress);
    const senderTokenAccount = await getAssociatedTokenAddress(USDC_MINT, senderPublicKey);
    const recipientTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipientPublicKey);

    const amountInBaseUnits = amount * 1_000_000;
    const instructions = [];

    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    if (!recipientAccountInfo) {
        instructions.push(
            createAssociatedTokenAccountInstruction(
                senderPublicKey,
                recipientTokenAccount,
                recipientPublicKey,
                USDC_MINT,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )
        );
    }

    instructions.push(
        createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            senderPublicKey,
            amountInBaseUnits,
            [],
            TOKEN_PROGRAM_ID
        )
    );

    const message = new TransactionMessage({
        instructions,
        recentBlockhash: "11111111111111111111111111111111",
        payerKey: new PublicKey("11111111111111111111111111111112"),
    }).compileToV0Message();

    const transaction = new VersionedTransaction(message);
    return bs58.encode(transaction.serialize());
}

/**
 * Creates a transaction using the Crossmint API.
 * @param {string} apiKey - Crossmint API key.
 * @param {string} walletLocator - Wallet locator address.
 * @param {string} serializedTransaction - Base58 encoded transaction string.
 * @returns {Promise<object>} Response from Crossmint API.
 */
export async function createTransaction(apiKey, walletLocator, serializedTransaction) {
    const response = await fetch(`https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/transactions`, {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            params: { transaction: serializedTransaction },
        }),
    });
    return await response.json();
}

/**
 * Retrieves transaction details using the Crossmint API.
 * @param {string} apiKey - Crossmint API key.
 * @param {string} walletLocator - Wallet locator address.
 * @param {string} transactionId - Transaction ID.
 * @returns {Promise<object>} Transaction details.
 */
export async function getTransaction(apiKey, walletLocator, transactionId) {
    const response = await fetch(
        `https://staging.crossmint.com/api/v1-alpha2/wallets/${walletLocator}/transactions/${transactionId}`,
        {
            method: "GET",
            headers: {
                "X-API-KEY": apiKey,
            },
        }
    );
    return await response.json();
}
