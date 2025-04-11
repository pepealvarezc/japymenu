import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://developer:bl68eCqMdQSSOfue@cluster0.xmvs3hh.mongodb.net/';
const options = {};

if (!uri) {
  throw new Error("Falta MONGODB_URI en .env.local");
}

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
