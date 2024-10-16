import express from "express";
import { createGamer , getAllData, getGamerById , updateGamerData , updateScore, updateChoice, winnerList } from "../Controller/game.controller.js";

const rpsGameRouter = express.Router()

rpsGameRouter.get("/" , getAllData);
rpsGameRouter.get("/search/:gamerId" , getGamerById);
rpsGameRouter.post("/create_gamer" , createGamer);
rpsGameRouter.put("/update_gamer" , updateGamerData);
rpsGameRouter.put("/update_choice" , updateChoice); 
rpsGameRouter.put("/update_score" , updateScore); 
rpsGameRouter.get("/get/winners_list" , winnerList); 

export default rpsGameRouter