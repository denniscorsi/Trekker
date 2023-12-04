const express = require('express');
const app = express();
require('dotenv').config()
const PORT = process.env.BILLING_PORT;
const Orders = require('./OrdersSchema');
const billConsume = require('./consumer');
const billPublisher = require('./publisher');

app.use(express.json());

// billConsume();
// const msg = {
//     method: 'attempt-charge',
//     stage: 'pre-charge',
//     body: {
//         cardNum: '1111111111111111', 
//         total: 123.50,
//         user: {username: 'Cheri'},
//     }
// }
// billPublisher('Bill', msg);

app.use('/attempt-charge', async (req, res) => {
    const {cardNum, total, user} = req.body;
    if (cardNum === '1111111111111111') {
        const last4Digits = cardNum.slice(-4);
        const maskedNumber = last4Digits.padStart(cardNum.length, '*');

        const orderToStore = {
            total: total,
            cardNum: maskedNumber,
            user: user.userName
        }
        try {
            const storeOrder = await Orders.create(orderToStore);
            const orderID = storeOrder.id;
            res.status(200).json({orderID: orderID}).end();
        }
        catch (err) {
            console.log(err.message);
            res.sendStatus(400);
        }
    }
    else res.sendStatus(400);
});

app.use((req, res, err, next) => {
    const defaultError = {
        log: 'There was an unknown middleware error in billing',
        status: 500,
        message: 'Housten, there\'s been a billing issue',
    };
    const errObj = Object.assign(defaultError, err)
    res.status(errObj.status).json(errObj.message)
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
