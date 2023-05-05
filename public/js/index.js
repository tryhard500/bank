loadAccounts();

async function loadAccounts() {
    let response = await axios.get('/accounts');
    let accounts = response.data;
    renderAccounts(accounts);
}

function renderAccounts(accounts) {
    let accountsNode = document.querySelector(`#accounts`);
    for (let i = 0; i < accounts.length; i++) {
        let account = accounts[i];
        accountsNode.innerHTML += `
            <button type="button" class="list-group-item list-group-item-action">
                <span>${account.owner}</span>
                <span>${account.creditcard}</span>
            </button>
        `;
    }
    let nodes = document.querySelectorAll(`button`);
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let account = accounts[i];
        node.addEventListener('click', () => {
            renderBalance(account);
            loadTransactions(account);
        });
    }
}

function renderBalance(account) {
    let balanceNode = document.querySelector(`#balance`);
    let income = document.querySelector(`#income`);
    let expences = document.querySelector(`#expences`);

    income.classList.remove('collapse');
    expences.classList.remove('collapse');

    income.addEventListener('click',()=>{
        loadTransactions(account,'income')
    });

    balanceNode.innerHTML = account.balance;
}

async function loadTransactions(account,typeOfTransactions) {
    if (typeOfTransactions=='income') {
        let response = await axios.get('/transactions/icome', {
            params: {
                account: account._id
            }
        });
        let transactions = response.data;
        renderTransactions(transactions);
    } else {
        let response = await axios.get('/transactions/all', {
            params: {
                account: account._id
            }
        });
        let transactions = response.data;
        renderTransactions(transactions);
    }
}

function renderTransactions(transactions) {
    let transactionsNode = document.querySelector(`#transactions`);
    transactionsNode.innerHTML = ``;
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        let className = ``;
        if (transaction.value > 0) {
            className = `list-group-item-success`
        } else {
            className = `list-group-item-danger`
        }
        transactionsNode.innerHTML += `
            <button type="button" class="list-group-item ${className}">
                <span>${transaction.value}</span>
                <span>${transaction.category}</span>
            </button>
        `;
    }
}