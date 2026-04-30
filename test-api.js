const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
    try {
        // Fixed user ID from seeded database
        const userId = 'b1a996da-ae72-4dc8-a9b7-da543e8ff96b';
        const walletId = 'f57a3e95-d46e-48a0-9434-b7ffcf558143';
        
        console.log('Using User ID:', userId);
        console.log('Using Wallet ID:', walletId);

        // 3. Criar categorias
        console.log('\n3. Creating categories...');
        const categories = [
            { nome: 'Alimentação' },
            { nome: 'Transporte' },
            { nome: 'Moradia' },
            { nome: 'Terceiros' }
        ];
        
        const categoryIds = {};
        for (const cat of categories) {
            const catResponse = await axios.post(
                `${BASE_URL}/category/createCategoria/${walletId}`,
                { nome: cat.nome }
            ).catch(err => {
                console.log(`Category ${cat.nome} error:`, err.response?.data || err.message);
                return null;
            });
            if (catResponse?.data?.categoria) {
                categoryIds[cat.nome] = catResponse.data.categoria.id;
                console.log(`Created ${cat.nome}: ${categoryIds[cat.nome]}`);
            }
        }

        // 4. Criar lançamentos de teste
        console.log('\n4. Creating test lancamentos...');
        const lancamentos = [
            {
                data: '2026-04-05',
                carteiraId: walletId,
                categoriaId: categoryIds['Alimentação'],
                valor: 50.00,
                tag: 'Caio',
                observacao: 'Almoço no restaurante',
                conferido: false
            },
            {
                data: '2026-04-10',
                carteiraId: walletId,
                categoriaId: categoryIds['Transporte'],
                valor: 25.00,
                tag: 'Metro',
                observacao: 'Passagem de ônibus',
                conferido: false
            },
            {
                data: '2026-04-15',
                carteiraId: walletId,
                categoriaId: categoryIds['Moradia'],
                valor: 1200.00,
                tag: 'Aluguel',
                observacao: 'Aluguel do apartamento',
                parcela: '1/1',
                conferido: true
            },
            {
                data: '2026-04-20',
                carteiraId: walletId,
                categoriaId: categoryIds['Alimentação'],
                valor: -500.00,
                tag: 'Salário',
                observacao: 'Salário mensal',
                conferido: true
            }
        ];

        for (const lancamento of lancamentos) {
            const lancResponse = await axios.post(
                `${BASE_URL}/lancamentos/${walletId}`,
                lancamento
            ).catch(err => {
                console.log(`Lancamento error:`, err.response?.data || err.message);
                return null;
            });
            if (lancResponse?.data?.lancamento) {
                console.log(`Created lancamento:`, lancResponse.data.lancamento.id);
            }
        }

        // 5. Testar GET lancamentos do mês
        console.log('\n5. Testing GET lancamentos/mes...');
        const mesResponse = await axios.get(
            `${BASE_URL}/lancamentos/mes/${walletId}?month=2026-04`
        ).catch(err => {
            console.log('Get lancamentos error:', err.response?.data || err.message);
            return null;
        });
        if (mesResponse?.data?.lancamentos) {
            console.log(`Found ${mesResponse.data.lancamentos.length} lancamentos`);
            console.log('First lancamento:', mesResponse.data.lancamentos[0]);
        }

        // 6. Testar agregações
        console.log('\n6. Testing agregações...');
        const agregResponse = await axios.get(
            `${BASE_URL}/lancamentos/agregacoes/${walletId}?month=2026-04`
        ).catch(err => {
            console.log('Get agregacoes error:', err.response?.data || err.message);
            return null;
        });
        if (agregResponse?.data?.agregacoes) {
            console.log('Agregações:', JSON.stringify(agregResponse.data.agregacoes, null, 2));
        }

        // 7. Criar grupo de divisão
        console.log('\n7. Creating divisão group...');
        const grupoResponse = await axios.post(
            `${BASE_URL}/divisao-grupos/${walletId}`,
            {
                valorOriginal: 300.00,
                numParcelas: 3,
                descricao: 'Compra dividida'
            }
        ).catch(err => {
            console.log('Create grupo error:', err.response?.data || err.message);
            return null;
        });
        if (grupoResponse?.data?.grupo) {
            console.log('Created group:', grupoResponse.data.grupo.id);
        }

        console.log('\n✅ API tests completed!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();
