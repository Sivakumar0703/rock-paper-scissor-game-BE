import express from "express";
import "dotenv/config";
import {createServer} from "http";
import { Server } from "socket.io";
import { nanoid } from "nanoid/non-secure";
import cors from "cors";
import rpsGameRouter from "./Routes/rpsgame.router.js";

const app = express();
const server = createServer(app);
const port = process.env.SERVER_PORT;
// variables
let playersChoice = {player1:null , player2:null};
let playersName = {player1:"" , player2:""};
let scoreBoard = [];
let allowedPlayers;

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/rps",rpsGameRouter);

const socketIO = new Server(server , {
    cors:{
        origin:"*"
    }
})

 function countGamePoints(scoreArray){
    let gamer1 = [];
    let gamer2 = [];
    scoreArray.forEach((gameResult) => { // tie is ommited
        if(gameResult == "player1"){
            gamer1.push(gameResult);
        }
        if(gameResult == "player2"){
            gamer2.push(gameResult);
        }
    })

    if(scoreArray.length == 6 && gamer1.length == gamer2.length){
        return "tie"
    } 
     if(scoreArray.length == 6 && gamer1.length > gamer2.length){
        return "p1"
    } 
    if(scoreArray.length == 6){
        return "p2"
    }       
    
 }


 function findWinner(choices,roomId){
    if(playersChoice.player1 && playersChoice.player2){
        let winner = "";

        if(choices.player1 == choices.player2){
        winner = "tie"    
        } else if(choices.player1 == "rock"){
            choices.player2 == "paper" ? winner = "player2" : winner = "player1" 
        } else if(choices.player1 == "paper"){
            choices.player2 == "scissor" ? winner = "player2" : winner = "player1" 
        } else if(choices.player1 == "scissor"){
            choices.player2 == "rock" ? winner = "player2" : winner = "player1" 
        }
        playersChoice = {player1:null , player2:null}; // after sending each game result empty player choice 
        scoreBoard.push(winner); // push every game result for final score calculation
        if(scoreBoard.length == 6){
            socketIO.sockets.to(roomId).emit("result" , winner , countGamePoints(scoreBoard) );
            // reset data after 6th game
            scoreBoard = [];
            playersChoice = {player1:null , player2:null};
        } else {
            socketIO.sockets.to(roomId).emit("result" , winner)
        }
        return winner
    }  
 }

 socketIO.on("connection" , (socket)=>{
    console.log("socket connected");

 // player1 who started the game creates and joins the room also generates the access code
    socket.on("start-game" , (name,id) => {
    allowedPlayers = new Set([]);
    allowedPlayers.add(id);
    playersName.player1 = name;
    let code = nanoid(5);
    socket.join(code); // creator joining a room (code)
    let data = {code}
    socket.emit("newGame" , data )
 })

 //  player2 with the code joins to the room which was created by player 1
    socket.on("joinGame" , (payload) => {
    let room = payload.joinCode;
    if(!(allowedPlayers.has(payload.id)) && allowedPlayers.size < 2){
        allowedPlayers.add(payload.id);  
    }
    const allowedPlayersArray = Array.from(allowedPlayers)
    playersName.player2 = payload.playerName; // new
    if(room){
        if(allowedPlayersArray[1] == payload.id) { // p2-id
         socket.join(room); // the other player joins the room.where the creator is already waiting (code)
         let msg = `${payload.playerName} Joined`;
         socket.to(room).emit("playersReady", msg , playersName.player2,room); // send to the player1
         socket.emit("getOpponentName" , playersName.player1,room);
        } else {
         socket.emit('room-full');
        }
        // socket.join(room); // the other player joins the room.where the creator is already waiting (code)
        // let msg = `${payload.playerName} Joined`;
        // socket.to(room).emit("playersReady", msg , playersName.player2,room); // send to the player1
        // socket.emit("getOpponentName" , playersName.player1,room); 
    } else {
        console.log("no joining code")
    }
 })


  socket.on("player1Choice" , (payload) => {
    playersChoice[payload.player] = payload.choiceMade;
    socket.to(payload.roomId).emit("player1MadeHisChoice" , payload.choiceMade )
    console.log("player1MadeHisChoice - line - 144")
    if(playersChoice.player2 != null){
        findWinner(playersChoice,payload.roomId);
    }
  })

  socket.on("player2Choice" , (payload) => {
    playersChoice[payload.player] = payload.choiceMade;
    socket.to(payload.roomId).emit("player2MadeHisChoice" , payload.choiceMade )
    if(playersChoice.player1 != null){
        findWinner(playersChoice,payload.roomId);
    }
  })

})

server.listen(port , () => {
    console.log(`server is running at port ${port}`)
})

