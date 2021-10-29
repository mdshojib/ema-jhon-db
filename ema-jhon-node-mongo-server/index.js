const expres = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');


const app = expres();
const port = process.env.PORT || 5000;

// middle war 
app.use(cors());
app.use(expres.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njvzx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('onlineShope');
        const productCollection = database.collection('product')
        // get product api
        app.get('/products', async (req, res) => {
            // console.log(req.query);
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();
            
            if(page) {
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                const products = await cursor.toArray();
            }
           
            
            res.send({
                count,
                products});
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req ,res) => {
    res.send('ema jhon server is running ');
})

app.listen(port, () =>{
    console.log('server is running success', port);
})