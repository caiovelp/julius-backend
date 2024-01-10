const express = require('express');
const cors = require('cors');

const {sequelize} = require('../config/db');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/carteiraRoutes');
const categoryRoutes = require('./routes/categoriaRoutes');
const expenseRoutes = require('./routes/despesaRoutes');
const creditRoutes = require('./routes/receitaRoutes');
const bankRoutes = require('./routes/bancoRoutes');
const financialObjectiveRoutes = require('./routes/objetivoFinanceiroRoutes');

const { initializeApp } = require('firebase/app');

const firebaseConfig = {
    apiKey: "AIzaSyAMKSJi2z6HLqx_CPUUWoz-9Oa49-BSP-w",
    authDomain: "julius-57188.firebaseapp.com",
    projectId: "julius-57188",
    storageBucket: "julius-57188.appspot.com",
    messagingSenderId: "670111963101",
    appId: "1:670111963101:web:e3dcc4b789563ad0560834",
    measurementId: "G-35P9DM34JF"
};

const app = express();
app.use(cors());
const port = 3000;

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch((error) => {
        console.error('Error syncing database: ', error);
    });

// Rotas
app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);
app.use('/category', categoryRoutes);
app.use('/expense', expenseRoutes);
app.use('/credit', creditRoutes);
app.use('/bank', bankRoutes);
app.use('/financialObjective', financialObjectiveRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})