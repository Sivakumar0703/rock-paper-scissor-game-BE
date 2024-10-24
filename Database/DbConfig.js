import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const { Client } = pg

const client = new Client({
  host:process.env.DB_HOST,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
  database:process.env.DB_NAME,
  ssl:{
  rejectUnauthorized:false
  }
})

client.connect((error) => {
  if(error){
    console.error('connection error',error);
  } else {
    console.log('Connected to the databse');
  }
})

export default client
