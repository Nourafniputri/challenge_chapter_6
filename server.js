const express = require('express');
const PostgresqlDB = require('./db/postgresql');
const app = express();

app.use(express.static (__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', (req,res) => {
    res.render('index');
});

app.get('/game-suit', (req,res) => {
    res.render('index-2');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.post('/login', async (req,res) => {
    try {
        const data = req.body;
        const userQuery = await PostgresqlDB.client.query('SELECT * FROM public.user WHERE username = $1', [data.username]);
        const userData = userQuery.rows;
        if (userData === null) {
            res.json({ data: 'Email atau password salah!' });
        } else {
            if (data.password === userData.password) {
            res.redirect('/');
        } else {
            res.json({data:'Email atau password salah!'});
        }
    }
} catch(error) {
    console.log('error');
    res.status(500).render('Internal server error');
   }
});

app.get('/user/list', async (req,res) => {
    const queryData = await PostgresqlDB.client.query(
        `
        SELECT *
        FROM public.user
        `
        )
        const userData = queryData.rows;
    res.json({ data: userData });
});



const port = 3000;
app.listen(port, () => {
    console.log(`Server started on PORT ${port}`)
});



// const user = users.find(user => user.email === email && user.password === password);
// const users = require('./db/users');