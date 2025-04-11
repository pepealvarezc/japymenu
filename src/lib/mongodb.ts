import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Falta MONGODB_URI en .env.local");
}

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;
