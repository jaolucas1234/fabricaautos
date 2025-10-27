const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const read = async (req, res) => {
    const vendas = await prisma.venda.findMany();
    res.json(vendas);
}

module.exports = {
    read
};