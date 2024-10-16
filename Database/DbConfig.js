import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();
const { Pool , Client } = pg
 
// const pool = new Pool({
//   host: process.env.HOST,
//   user: process.env.USER_NAME,
//   password:process.env.DB_PASSWORD,
//   port:process.env.PORT,
//   database:process.env.DB_NAME 
// })

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



// pool.connect((error,client,release) => {
//   if(error){
//     return console.log("Error in Connecting DB",error);
//   }
//   client.query('SELECT NOW()', (err,result) => {
//     release()
//     if(err){
//       return console.log("Error in executiong query")
//     }
//     console.log("Database connected");
//   })
// })

export default client
// export default pool