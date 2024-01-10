const UsuarioService = require("./UsuarioService");
const Banco = require("../models/Banco");

class BancoService {
    constructor() {
    }

    async createBanco(nomeBanco, usuarioId){
        let usuarioService = new UsuarioService();
        let usuario = await usuarioService.getUserById(usuarioId);
        if(!usuario) {
            throw new Error("Usuario não encontrado");
        }
        return await Banco.create({
         saldo: 0,
         nome: nomeBanco,
         usuarioId: usuarioId,
         });
    }

    async getBancoById(bancoId) {
        return await Banco.findByPk(bancoId);
    }

    async getBancoGroupByUserId(usuarioId) {
        return await Banco.findAll({
            where: {
                usuarioId: usuarioId
            },
        });
    }
}

module.exports = BancoService;