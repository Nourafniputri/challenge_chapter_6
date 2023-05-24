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
        if (!email || !password) {
            res.send({ data: 'Mohon isi Email dan Password !'});
        }
        const userData = await user.findOne({ where: {email} })
        if(userData) {
            if (userData.password === password) {
                res.redirect('/');
            } else {
                res.send({ data: 'Email atau Password salah !'})
            }
        } else {   
            res.send({ data: 'User tidak terdaftar !' });
        }   
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
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
    res.render('user_upsert', { isUpdate: false})
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
            include: [
                {
                    model: biodataUser,
                    attributes: []
                }
            ]
        })
        res.render('user_upsert', {user: userData.toJSON(), isUpdate: true})
    }catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.post('/user/update', async (req,res) => {
    const transaction = await sequelize.transaction()
    try {
        const id = req.query.id;
        const {username,email,password, ...sisa } = req.body;
        const userData = await user.update({ username,email,password }, {where: {id}, transaction});
        await biodataUser.update({ ...sisa, userId: userData.id},{where: {userId: id}, transaction});
        await transaction.commit();
        
        res.redirect('/user')
    }catch(error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.post('/user/delete', async (req,res) => {
    const transaction = await sequelize.transaction()
    try {
        const id = req.query.id;
        await history.destroy({where: {userId: id}, transaction});
        await biodataUser.destroy({where: {userId: id}, transaction});
        await user.destroy({ where: {id}, transaction});
        await transaction.commit();
        res.redirect('/user')
        
        res.render('index')
    }catch(error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
});

app.get('/user/detail', async (req,res) => {
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
        include: [
            {
                model: biodataUser,
                attributes: []
            }
        ]
        })
        res.render('detail', {user: userData.toJSON()})
     }catch(error) {
         console.log(error);
         res.status(500).send('Internal Server Error!');
     }
});


app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT ${process.env.PORT}`)
});




