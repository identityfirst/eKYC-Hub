import {Db, MongoClient} from "mongodb";

export class DbClient {
    private client: MongoClient;

    connect(): Promise<any> {
        if(this.client && this.client.isConnected()){
            return Promise.resolve(this.client.db(process.env.MONGO_DB));
        }
        return MongoClient.connect(process.env.MONGO_URL)
        .then(client => {
            this.client = client;
            return this.client.db(process.env.MONGO_DB);
        })
        .catch(err => {
            console.log(err);
        });
    }
}

export default new DbClient();