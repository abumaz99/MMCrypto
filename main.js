// Function to reset the connection
async function resetConnection() {
    const addressElement = document.getElementById('address');
    const balanceElement = document.getElementById('balance');
    const walletInfo = document.getElementById('walletInfo');
    const transactionList = document.getElementById('transactionList');
    

    try {
        // Request access to the user's Ethereum accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // MetaMask is now connected, you can access user's accounts
        const accounts = await window.ethereum.send('eth_accounts');
        const address = accounts.result[0];
        addressElement.textContent = address;

        // Fetch the user's ETH balance and convert Wei to Ether
        const balance = await window.ethereum.send('eth_getBalance', [address, 'latest']);
        const balanceInWei = BigInt(balance.result);
        const balanceInEther = parseFloat(Number(balanceInWei) / 1e18).toFixed(4);
        balanceElement.textContent = balanceInEther;

        // Show the wallet info
        walletInfo.style.display = 'block';

        // Fetch the 5 most recent transactions
        // Fetch recent transactions using the Etherscan API
        const etherscanApiKey = '74N6TZB7UHFY7VPRYFXJ97SZZGM6WPEXGZ';
        const etherscanEndpoint = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`;
        
        const response = await fetch(etherscanEndpoint);
        const data = await response.json();
        const transactions = data.result.slice(0, 5); // Get the 5 most recent transactions

        for (const transaction of transactions) {
            const listItem = document.createElement('li');
            listItem.textContent = `Transaction Hash: ${transaction.hash}, Value: ${parseFloat(transaction.value / 1e18).toFixed(2)} ETH`;
            transactionList.appendChild(listItem);
        }
    } catch (error) {
        console.error(error);
        alert('Error connecting to MetaMask.');
    }
}

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    const connectButton = document.getElementById('connectButton');

    // Add a click event listener to the button
    connectButton.addEventListener('click', resetConnection);

    // Reset the connection when the page is loaded or refreshed
    // window.addEventListener('load', resetConnection);
} else {
    alert('MetaMask is not installed. Please install it to use this feature.');
}