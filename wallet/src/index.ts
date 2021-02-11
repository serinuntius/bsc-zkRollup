import * as zksync from 'zksync';
import * as ethers from 'ethers';
import { parseEther } from 'ethers/lib/utils';

// THIS IS TEST MENEMONIC
const MNEMONIC = 'fine music test violin matrix prize squirrel panther purchase material script deal';
const ethersProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');

const ethWallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(ethersProvider);


const sendBnb = async () => {
    await ethWallet.sendTransaction({
        from: ethWallet.address,
        to: '0x52312AD6f01657413b2eaE9287f6B9ADaD93D5FE',
        value: parseEther('1')
    });
}

const depositL2 = async () => {

    // const deposit = await syncWallet.depositToSyncFromEthereum({
    //     depositTo: syncWallet.address(),
    //     token: 'ETH',
    //     amount: ethers.utils.parseEther('1.0')
    // });
}

const setupSiningKey = async () => {
    const syncProvider = await zksync.getDefaultProvider('localhost');

    // Derive zksync.Signer from ethereum wallet.
    const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);



    if (!(await syncWallet.isSigningKeySet())) {
        if ((await syncWallet.getAccountId()) == undefined) {
            throw new Error('Unknown account');
        }

        // As any other kind of transaction, `ChangePubKey` transaction requires fee.
        // User doesn't have (but can) to specify the fee amount. If omitted, library will query zkSync node for
        // the lowest possible amount.

        const changePubkey = await syncWallet.setSigningKey({ feeToken: 'ETH' });

        // Wait until the tx is committed
        await changePubkey.awaitReceipt();
    }
}

const getTokens = async () => {
    const syncProvider = await zksync.getDefaultProvider('localhost');


    const tokens = await syncProvider.getTokens();
    console.log(tokens);
}
const getGasPrice = async () => {
    const gas = await ethWallet.getGasPrice();
    console.log(`gas: ${gas}`);
}

(async () => {
    await getTokens();

    // await setupSiningKey();
    // await getGasPrice();

})();

