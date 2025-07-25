const express = require('express');
const httpProxy = require('http-proxy');
const {PrismaClient}=require('@prisma/client')

const app = express();

const PORT = 8000;

const BASE_PATH = process.env.S3_BASE_URL || 'https://vercel-project-op.s3.ap-south-1.amazonaws.com/__outputs';

const prisma=new PrismaClient();

const proxy = httpProxy.createProxy();
app.use(async (req, res) => {
    const hostname = req.hostname;
    const subd = hostname.split('.')[0];

    const project = await prisma.project.findFirst({
        where: { subdomain: subd },
        select: { id: true },
      });

    const projectId=project.id;

    const resolvesTo = `${BASE_PATH}/${projectId}`;

    proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(PORT, () => console.log(`Reverse proxy running on port ${PORT}`));