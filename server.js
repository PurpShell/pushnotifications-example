// Initialization
require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const {Low, JSONFile} = require('lowdb');
const _ = require('lodash');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./public"));

const db = new Low(new JSONFile('./db.json'));

db.read().then(async () => {
    if (!db.data) {
        db.data = {subscriptions: []};
        await db.write();
    }
    db.chain = _.chain(db.data);
});

const vapidDetails = {
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY,
    subject: process.env.VAPID_SUBJECT
};
  

// Subscription Endpoints
app.post('/subscribe/', async (req, res) => {
    console.log(`Subscribing ${req.body.endpoint}`);
    db.chain.get('subscriptions')
      .push(req.body)
      .value();
    await db.write();
    res.send();
});

app.post('/unsubscribe/', async (req, res) => {
    console.log(`Unsubscribing ${req.body.endpoint}`);
    db.chain.get('subscriptions')
      .remove({endpoint: req.body.endpoint})
      .value();
    await db.write();
    res.send();
});

// Sending the push notifications
app.post('/broadcast/', (req, res) => {
    console.log('Notifying all subscribers');
    const subscriptions =
      db.chain.get('subscriptions').cloneDeep().value();
    if (subscriptions.length > 0) {
      broadcast(subscriptions, req.body.title, req.body.body);
      res.send();
    } else {
        res.status(409).send();
    }
})

// Broadcast logic
function broadcast(subscriptions, title, body) {
    // Create the notification content.
    const notification = JSON.stringify({
      title: title,
      options: {
        body: title
      }
    });
    // Customize how the push service should attempt to deliver the push message.
    // And provide authentication information.
    const options = {
      TTL: 10000,
      vapidDetails: vapidDetails
    };
    // Send a push message to each client specified in the subscriptions array.
    subscriptions.forEach(subscription => {
      const endpoint = subscription.endpoint;
      const id = endpoint.substr((endpoint.length - 8), endpoint.length);
      console.log(notification)
      webpush.sendNotification(subscription, notification, options)
        .then(result => {
          console.log(`Endpoint ID: ${id}`);
          console.log(`Result: ${result.statusCode}`);
        })
        .catch(error => {
          console.log(`Endpoint ID: ${id}`);
          console.log(`Error: ${error} `);
        });
    });
}

app.get('/', (req, res) => {
    res.redirect(303, '/index.html');
});

app.listen(80, () => console.log('listening on port 80 http://localhost'));