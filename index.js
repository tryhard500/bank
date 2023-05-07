let express = require(`express`);
let app = express();
let port = 3004;

app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})


// Раздача статики
app.use(express.static(`public`));


// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/money-app');


// Схемы
let accountsSchema = new mongoose.Schema({
    owner: String,        // Имя владельца карты
    creditcard: String,   // Номер кредитной карты
    ballance: Number      // Балланс счёта
});
let Account = mongoose.model('account', accountsSchema);

let transactionSchema = new mongoose.Schema({
    value: Number,        // Размер операции (положительное или отрицательное число)
    category: String,     // Категория расхода
    account: {            // С какого счёта совершена операция?
        type: mongoose.ObjectId,
        ref: 'account'
    }
});
let Transaction = mongoose.model('transaction', transactionSchema);


app.get('/accounts', async (req, res) => {
    let data = await Account.find();
    res.send(data);
});

app.get('/transactions/all', async (req, res) => {
    let account = req.query.account;
    let data = await Transaction.find({ account: account });
    res.send(data);
});

app.get('/transactions/income', async (req, res) => {
    let account = req.query.account;
    let data = await Transaction.find({
        account: account,
        value: {$gte: 0}
    })
    console.log(data);
});