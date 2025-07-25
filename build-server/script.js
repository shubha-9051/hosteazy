const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const { Kafka } = require('kafkajs')

const PROJECT_ID = process.env.PROJECT_ID
const DEPLOYEMENT_ID = process.env.DEPLOYEMENT_ID

const kafka=new Kafka({

    clientId:`docker-build-server-${DEPLOYEMENT_ID}`,
    brokers:[process.env.KAFKA_BROKER_URL],
    ssl:{
        ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')]
    },
    sasl:{
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
        mechanism: 'plain'
    }
})


const producer=kafka.producer()

async function publishLog(log){
   
   await producer.send({topic:`container-logs`,messages:[{key:'log',value:JSON.stringify({PROJECT_ID,DEPLOYEMENT_ID,log})}]})
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})





async function init() {

    await producer.connect()
    console.log('Executing script.js')

    await publishLog('build started')

    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', async function (data) {
        console.log(data.toString())
        await publishLog(`${data.toString()}`)
     
    })

    p.stdout.on('error', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`${data.toString()}`)
    
    })

    p.on('close', async function () {
        console.log('Build Complete')
        await publishLog(`build-completed`)
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

      
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            await publishLog(`uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME || 'vercel-project-op',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            
            console.log('uploaded', filePath)
            await publishLog(`uploaded ${file}`)
        }
        
        console.log('Done...')
        await publishLog('done')
        process.exit(0)
    })
}

init()