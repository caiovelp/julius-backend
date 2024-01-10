const UsuarioService = require("../services/UsuarioService");

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();

        this.createUser = this.createUser.bind(this);
        this.editUser = this.editUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUserByUsername = this.getUserByUsername.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.postUser = this.postUser.bind(this);
    }
    async createUser(req, res) {
        try {
            const { nome, username, senha, senhaConfirmacao, email } = req.body;

            if (!nome || !username || !senha || !senhaConfirmacao || !email) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            if(senha !== senhaConfirmacao) {
                return res.status(400).json({ error: 'As senhas não conferem. '});
            }

            await this.usuarioService.createUser(email, senha, nome, username)
                .then(() => {
                    return res.status(200).json({message: 'Usuário criado com sucesso!'});
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao criar usuário: ${error}` })
                });
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao criar usuário: ' + e });
        }
    }

    async editUser(req, res) {
        try {
            const { id } = req.params;
            const { nome, username, email } = req.body;

            await this.usuarioService.editUser(id, nome, username, email)
                .then(() => {
                    return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao atualizar usuário: ${error}` });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar usuário: ' + e });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            await this.usuarioService.deleteUser(id)
                .then(() => {
                    return res.status(200).json({ message: 'Usuário deletado com sucesso. '});
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao deletar usuário: ${error}` });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao deletar o usuário: ' + e });
        }
    }

    async getUserByUsername(req, res) {
        try {
            const { username } = req.body;

            await this.usuarioService.getUserByUsername(username)
                .then((usuario) => {
                    return res.status(200).json(usuario);
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao recuperar informações do usuário: ${error}` });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar informações do usuário. '});
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;

            await this.usuarioService.getUserById(id)
                .then((usuario) => {
                    return res.status(200).json(usuario);
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao recuperar informações do usuário: ${error}` });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar informações do usuário: ', e});
        }
    }

    // Login
    async postUser(req, res) {
        try {
            const { email, senha } = req.body;

            if (!senha || !email) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            await this.usuarioService.loginEmailAndPassword(email, senha)
                .then((user) => {
                    return res.status(200).json({message: 'Usuário logado com sucesso!', user: user});
                })
                .catch((error) => {
                    return res.status(400).json({ error: `Erro ao logar usuário: ${error}` });
                });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro na autenticação do usuário: ' + e});
        }
    }
}

module.exports = UsuarioController
