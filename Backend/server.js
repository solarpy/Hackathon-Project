const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

// built-in middleware to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join('C:\Users\Admin\Documents\GitHub\Hackathon-Project', 'Frontend')));


app.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'pages-login.html'));
});

app.get('/', (req, res) => {
    res.redirect(301, '/login.html'); //302 by default 
});

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'Frontend' ,'pages-error-404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }  
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











