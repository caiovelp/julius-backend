const BancoService = require("../services/BancoService");

class BancoController {
    constructor() {
        this.bancoService = new BancoService();

        this.createBanco = this.createBanco.bind(this);
        this.getBancoById = this.getBancoById.bind(this);
        this.getBancoGroupByUserId = this.getBancoGroupByUserId.bind(this);
    }

    async createBanco(req, res) {
        try {
            const { usuarioId } = req.params;
            const { nome } = req.body;

            await this.bancoService.createBanco(nome, usuarioId)
                .then(() => {
                    res.status(200).json({ message: `Banco criado com sucesso.` });
                })
                .catch((error) => {
                    res.status(404).json({ error: 'Erro ao criar o Banco: ' + error});
                });

        }
        catch(e) {
            res.status(500).json({ error: 'Erro ao criar a Banco: ' + e});
        }
    }

    async getBancoById(req, res) {
        try {
            const { id } = req.params;

            const banco = await this.bancoService.getBancoById(id);
            if(!banco) {
                return res.status(400).json({ error: 'Banco não encontrado. '});
            }

            res.status(200).json(banco);
        }
        catch(e) {
            res.status(500).json({ error: 'Erro ao recuperar informações do Banco: ' + e});
        }
    }

    async getBancoGroupByUserId(req, res){
        try {
            const { usuarioId } = req.params;

            await this.bancoService.getBancoGroupByUserId(usuarioId)
                .then(bancosAgrupadosPorUsuario => {
                    res.status(200).json({
                        bancosAgrupadosPorUsuario: bancosAgrupadosPorUsuario
                    })
                })
                .catch((error) => {
                    res.status(400).json({ error: `Erro ao buscar bancos: ${error}` });
                });

        }
        catch (error) {
            res.status(500).json({ error: 'Erro ao buscar bancos e agrupá-los por usuário: ' + error });
        }
    }
}

module.exports = BancoController