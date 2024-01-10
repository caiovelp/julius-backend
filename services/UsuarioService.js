const {Usuario, Carteira} = require("../models/Associations");
const { getAuth, deleteUser, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const CarteiraService = require("./CarteiraService");
const DespesaService = require("./DespesaService");
const CategoriaService = require("./CategoriaService");
const ReceitaService = require("./ReceitaService");

class UsuarioService {
    constructor() {

    }

    async createUser(email, senha, nome, username) {
        let usuario = await this.getUserByUsername(username);
        if(usuario) {
            throw new Error('Username já utilizado por outra conta.');
        }

        try {
            const auth = getAuth();
            const user = await createUserWithEmailAndPassword(auth, email, senha);
            await this.createDatabaseUser(nome, username, email);
            return await this.getUserByUsername(username);
        } catch (error) {
            if (error.code === 'auth/invalid-password') {
                throw new Error('A senha deve ter pelo menos 6 caracteres.');
            }
            if (error.code === 'auth/weak-password') {
                throw new Error('A senha deve ter pelo menos 6 caracteres.');
            }
            if (error.code === 'auth/email-already-exists') {
                throw new Error('Endereço de email já utilizado.');
            }
            throw new Error(error.message);
        }
    }

    async editUser(id, nome, username, email) {
        let updatedUser = await Usuario.update(
            { nome, username, email },
            { where: { id } }
        )

        if(updatedUser[0] !== 1) {
            throw new Error('Usuário não encontrado.');
        }
    }

    async deleteUser(id) {
        let user = await Usuario.findByPk(id);
        if(!user) {
            throw new Error('Usuário não encontrado.');
        }

        let carteira = await Carteira.findOne({
            where: {
                usuarioId: id
            }
        });
        if(carteira) {
            let despesaService = new DespesaService();
            let categoriaService = new CategoriaService();
            let receitaService = new ReceitaService();

            await despesaService.deleteAllDespesas(carteira.id);
            await categoriaService.deleteAllCategorias(carteira.id);
            await receitaService.deleteAllReceitas(carteira.id);

            carteira.destroy();
        }
        else {
            throw new Error('Carteira não encontrada.');
        }

        await user.destroy();

        const auth = getAuth();
        const userFirebase = auth.currentUser;
        deleteUser(userFirebase)
            .then(() => {
                console.log("Usuário deletado com sucesso no firebase.");
            })
            .catch((error) => {
                throw new Error(`Erro ao deletar usuário no firebase: ${error.message}`);
            });
    }

    async getUserById(id) {
        return await Usuario.findByPk(id);
    }

    async getUserByUsername(username){
        return await Usuario.findOne({
             where: {
                 username: username
             }
        });
    }

    async getUserByEmail(email) {
        return await Usuario.findOne({
            where: {
                email: email
            }
        })
    }

    async createDatabaseUser(nome, username, email) {
        let usuario = await Usuario.create({
            nome: nome,
            username: username,
            email: email,
        });
        let carteiraService = new CarteiraService();
        let carteira = await carteiraService.createCarteira(usuario.dataValues.id);

        let categoriaService = new CategoriaService();
        let categoriasPadrao = ["Alimentação", "Lazer", "Transporte"];
        await categoriaService.createCategorias(categoriasPadrao, carteira.dataValues.id, carteiraService);
    }

    async loginEmailAndPassword (email, senha){
        try {
            const auth = getAuth();
            const user = await signInWithEmailAndPassword(auth, email, senha);
            return await this.getUserByEmail(email);

        } catch (error) {
            if (error.code === 'auth/invalid-login-credentials') {
                throw new Error('Credenciais de login inválidas.');
            }
        }
    }
}


module.exports = UsuarioService;