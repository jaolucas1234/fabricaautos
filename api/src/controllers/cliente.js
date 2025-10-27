const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const read = async (req, res) => {
    const clientes = await prisma.cliente.findMany();
    res.json(clientes);
}

module.exports = {
    read
};