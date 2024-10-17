import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const { Client } = pg

const client = new Client({
  connectionString:process.env.DB_CONNECTION_URL
})

client.connect((error) => {
  if(error){
    console.error('connection error',error);
  } else {
    console.log('Connected to the databse');
  }
})

export default client
