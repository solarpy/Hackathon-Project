const { ethers } = require("hardhat");
// For Hardhat
const contract = require("./artifacts/contracts/Auth.sol/Auth.json");
// Provider
const provider = new ethers.providers.WebSocketProvider("ws://localhost:9545");
// Signer
const signer = new ethers.Wallet("06b91f40bafe25bb97844ca576675d475ad4c197a4acab0f00a7dabf8326d480", provider);
// Contract
const auth = new ethers.Contract("0x0d8cc4b8d15D4c3eF1d70af0071376fb26B5669b", contract.abi, signer);

const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 1000;

// custom middleware logger 
app.use(logger);

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/assets', express.static(path.join(__dirname, '../Frontend/assets')));

app.get('/signup(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'SignUp.html'));
});

app.post('/login(.html)?', async (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    // Wait for all of the client's login Information to be stored
    const pass = await auth.usersList(username);
    console.log(`${pass[2]} = ${password}`);
    if (pass[2] == password) {
        res.redirect(301, './home.html');
    }
    else {
        res.redirect(301, './login.html');
    }
});

app.post('/signup(.html)?', async (req, res) => {
    // Insert Sign Up Code here
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    
    // Wait for all of the Client Information to be stored
    const txc = await auth.createUser(username, email, password);
    const receipt = await txc.wait()
    console.log(receipt.events);
    res.redirect(301, './home.html');
})

app.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Login.html'));
});

app.get('/', (req, res) => {
    res.redirect(301, './signup.html'); //302 by default 
});

app.get('/home(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Home.html'));
});

app.get('/profile(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'profile.html'));
})

app.get('/cpfContribution(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'cpfContribution.html'));
})

app.get('/travelDoc(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'travelDoc.html'));
})

app.get('/health(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'health.html'));
})

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'Frontend', 'pages-error-404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }  
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











