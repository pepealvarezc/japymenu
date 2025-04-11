import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) throw new Error("Falta MONGODB_URI en .env.local");

if (process.env.NODE_ENV === "development") {
  // Usamos la promesa global solo en desarrollo para evitar múltiples conexiones
  if (!globalThis.mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis.mongoClientPromise = client.connect();
  }
  clientPromise = globalThis.mongoClientPromise;
} else {
  // En producción, siempre creamos una nueva conexión
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
