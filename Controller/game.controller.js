import client from "../Database/DbConfig.js";

// get all gamers data
export const getAllData = async(req,res) => {
    try {
        const data = await client.query(`SELECT * FROM ${process.env.TABLE_NAME}`)
        res.status(200).json({message:"received all data" , totalData:data.rows.length  , data:data.rows})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// get particular gamers data by id
export const getGamerById = async(req,res) => {
  const {gamerId} = req.params;
  try {
    const data = await client.query(`SELECT * FROM ${process.env.TABLE_NAME} WHERE id=$1` , [gamerId])
    res.status(200).json({message:"received gamer data" , data:data.rows[0]})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// create and save new gamer data
export const createGamer = async (req, res) => {
  const { name } = req.body;
  try {
    const data = await client.query(
      `INSERT INTO ${process.env.TABLE_NAME} (name) VALUES($1) RETURNING *`,
      [name]
    );
    res.status(200).json({ message: "gamer creater.ID is generated", data: data.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update gamer data => save access code,is-player-1,opponent-name
export const updateGamerData = async (req, res) => {

  const {
    id,
    code,
    is_player1,
    opponent_name,
  } = req.body;

  try {
    const data = await client.query(
      `UPDATE ${process.env.TABLE_NAME} SET code=$1, is_player1=$2, opponent_name=$3  WHERE id=$4`,
      [code,is_player1,opponent_name,id]
    );
    res.status(200).json({ message: "updated gamer data", data: data.rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update choice
export const updateChoice = async(req,res) => {
  try {
    const {id,my_choice,is_opponent_made_his_choice} = req.body;
    let column;
    let value;
    if(my_choice){
      column = "choice_made",
      value = my_choice
    } else {
      column = "is_opponent_made_his_choice",
      value = is_opponent_made_his_choice
    }
    await client.query(`UPDATE ${process.env.TABLE_NAME} SET ${column}=$1 WHERE id=$2` , [value,id] );
    res.status(200).json({message:"choice is updated"});
  } catch (error) {
    console.log("error in updating choice", error);
    res.status(400).json({ error: error.message });
  }
}

// update score array
export const updateScore = async(req,res) => {
  try {
    const {id,score,playerName,opponent_name,endResult} = req.body; 
    
    if(score.length == 6 && endResult == "tie"){ // final result - game draw
      const onDraw = playerName+"/"+opponent_name;
      await client.query(`UPDATE ${process.env.TABLE_NAME} SET score=$1,choice_made=NULL,is_opponent_made_his_choice=NULL,winner=$2  WHERE id=$3` , [score,onDraw,id]);
      return  res.status(200).json({message:"score updated"});
    } 
    else if(score.length == 6 && endResult == "won"){ // final result -  won
      await client.query(`UPDATE ${process.env.TABLE_NAME} SET score=$1,choice_made=NULL,is_opponent_made_his_choice=NULL,winner=$2  WHERE id=$3` , [score,playerName,id]);
      return  res.status(200).json({message:"score updated"});
    } 
    else if(score.length == 6 && endResult == "loss"){ // final result -  lose
      await client.query(`UPDATE ${process.env.TABLE_NAME} SET score=$1,choice_made=NULL,is_opponent_made_his_choice=NULL,winner=$2  WHERE id=$3` , [score,opponent_name,id]);
      return  res.status(200).json({message:"score updated"});
    } else { // update score on end of each game ends
     await client.query(`UPDATE ${process.env.TABLE_NAME} SET score=$1,choice_made=NULL,is_opponent_made_his_choice=false  WHERE id=$2` , [score,id]);
     res.status(200).json({message:"score updated"});
    }  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get winners list
export const winnerList = async(req,res) => {
  try {
    const winnersData = await client.query(`SELECT * FROM ${process.env.TABLE_NAME} WHERE name=winner ORDER BY created_at DESC`);
    res.status(200).json({message:"fetching winners list done" , winnerList:winnersData.rows}) 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
 


