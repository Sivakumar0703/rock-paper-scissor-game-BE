import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const { Client } = pg

const client = new Client({
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password:process.env.DB_PASSWORD,
  port:process.env.PORT,
  database:process.env.DB_NAME 
})

client.connect((error) => {
  if(error){
    console.error('connection error',error);
  } else {
    console.log('Connected to the databse');
  }
})

export default client
