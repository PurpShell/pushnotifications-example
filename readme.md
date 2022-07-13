# Push Notifications Example
Node.js & Vanilla HTML/JS Push API example so you & I can understand it better!

## Usage
Download the .zip file and extract it (GUI) or run `git clone <..repo url..>.git`, needs [Git](https://git-scm.com)

Then:

```
cd pushnotifications-example
npm install
```

### Before you run this app:
Rename the file called `.env.example` to `.env`.

Run `npx web-push generate-vapid-keys`, note the public and private keys and update the following in the `.env` file:

`VAPID_PUBLIC_KEY` to the public key

`VAPID_PRIVATE_KEY` to the private key

then open `./public/index.js`
and edit the first line variable to equal the public key.


### Run the app:

```
npm start
```
Note: go to http://localhost/broadcast.html to test send a message to all subscribers
## Contributing
You are free to update this repo with a pull request or creating an issue if any changes are made to the components of this proof of concept (the Push API)

If you feel like this repository made you understand Push Notifications better, follow me on [GitHub page](https://github.com/PurpShell) or donate to my [PayPal](https://paypal.com/RajehTaher)

Made by [PurpShell](https://github.com/PurpShell) with ❤.
