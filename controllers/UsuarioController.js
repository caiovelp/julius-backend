const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
        this.getUserById = this.getUserById.bind(this);
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const usuario = await this.usuarioService.getUserById(id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            return res.status(200).json(usuario);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao recuperar informações do usuário: ' + e });
        }
    }
}

module.exports = UsuarioController;
