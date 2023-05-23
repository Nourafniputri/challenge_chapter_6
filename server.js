const { user,biodataUser,history,sequelize } = require('./models');
const { col } = require('sequelize');
const express = require('express');

const app = express();

app.use(express.static (__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', (req,res) => {
    res.render('index-2');
});

app.get('/game-suit', (req,res) => {
    res.render('index-3');
});

app.get('/login', (req,res) => {
    res.render('login');
});

app.post('/login', async (req,res) => {
    try {
        const { email,password } = req.body;
        const userData = await user.create({ email,password })
        // const userQuery = await PostgresqlDB.client.query('SELECT * FROM public.user WHERE username = $1', [data.username]);
        // const userData = userQuery.rows;
        if (userData === null) {
            res.send({ data: 'Email atau password salah!' });
        } else {
            if (userData === password) {
            res.redirect('/');
        } else {
            res.json({data:'Email atau password salah!'});
        }
    }
} catch(error) {
    console.log(error);
    res.status(500).send('Internal server error');
   }
});

app.get('/user', async (req,res) => {
    try {
       let userData = await user.findAll();
       userData = userData.map
       ( (data) => {
        return data.toJSON()
       })
       res.render('index', { user: userData })
    }catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.get('/user/add', (req,res) => {
    res.render('user_upsert')
});

app.post('/user/add', async (req,res) => {
    const transaction = await sequelize.transaction()
    try {
        const {username,email,password,...sisa } = req.body;
        const userData = await user.create({ username,email,password }, {transaction});
        await biodataUser.create({ ...sisa, userId: userData.id},{transaction});
        await history.create({...sisa, userId: userData.id},{transaction});
        await transaction.commit();
       
        res.redirect('/user')
    } catch(error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).send('Internal server error');
    }
}); 

app.get('/user/update', async (req,res) => {
    try {
        const id = req.query.id;
        const userData = await user.findOne({
            where: {id},
            attributes: [
                'id',
                'username',
                'email',
                'password',
                [col('"biodataUser"."umur"'), "umur"],
                [col('"biodataUser"."city"'), "city"],
                [col('"biodataUser"."country"'), "country"]
            ],
            include: [{
                    model: biodataUser,
                    attributes: []
                }]
                // include: 
                // [{ 
                //     model: history 
                // }]
        })
        res.render('user_upsert', {user: userData.toJSON(), isUpdate: true})
    }catch(error) {
        
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.post('/user/update', (req,res) => {

});

app.get('/user/delete', async (req,res) => {
    const transaction = await sequelize.transaction()
    try {
        const {username,email,password,...sisa } = req.query.id;
        const userData = await user.create({ username,email,password }, {transaction});
        await biodataUser.delete({ ...sisa,userId: userData.id},{transaction});
        await history.delete({...sisa,userId: userData.id},{transaction});
        await transaction.commit();
        res.redirect('/user')
        console.log(userData.toJSON());
        res.render('user_upsert')
    }catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.get('/user/detail', async (req,res) => {
    // res.render('detail')
    try {
        let userData = await user.findAll();
        await biodataUser.findAll();
        await history.findAll();
        userData = userData.map( (data) => {
         return data.toJSON()
        })
        res.render('detail', { user: userData, biodataUser: userData, history: userData})
     }catch(error) {
         console.log(error);
         res.status(500).send('Internal Server Error!');
     }
});


// app.post('/user/detail', async (req,res) => {
//     try {

//     }catch(error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error!');
//     }
// });


app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`)
});


// 
// const user = users.find(user => user.email === email && user.password === password);
// const users = require('./db/users');

// ('"biodata_users"."umur"')],
//                 [col('"biodataUser"."city"'), ('"biodata_users"."city"')],
//                 [col('"biodataUser"."country"'), ('"biodata_users"."country"')