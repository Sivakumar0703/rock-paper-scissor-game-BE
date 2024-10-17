
# ROCK-PAPER-SCISSOR

I have created real time rock-paper-scissor game using socket.io and expressjs. postgres is used for storing player's data and their result.

## API Reference
Base URL: https://rock-paper-scissor-game-be.onrender.com/api/rps

#### GET REQUESTS

```http
                         GET ALL PLAYER DATA
  GET /api/rps
```
It will return every player's data in an array (data). In addition to this, we also receive the total count of the data within the array (data.


```http
                         FIND PLAYER BY ID
  GET /search/:gamerId
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `gamerId` | `string` |  Id of the player |

It will return the data of particular player.


```http
                        GET THE LIST OF WINNERS
  GET /get/winners_list
```

It will return the array of data that contains the details of the winner including his/her score,opponent player's name,at what time they played etc.

#### POST REQUEST 
```http
                    CREATE AND SAVE PLAYER DATA
  POST /create_gamer

```
| Request Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` |  Name of the player |

A new row is created and saved with an ID and a name. The name of the player is received from the request body. 

#### PUT REQUESTS
```http
                UPDATE PLAYER'S CHOICE OR OPPONENT'S ACTION
  PUT /update_choice

```
| Request Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |  Id of the player |
| `my_choice` | `string` |  Choice made by the player |
| `is_opponent_made_his_choice` | `boolean` |  Choice made by the opponent |

'id' is used to find the player for updating the choice.

Either you can provide 'my_choice' or 'is_opponent_made_his_choice' to update.This endpoint is used to recognize whether your opponent made his choice or not and also to update the player's choice.

```http
                    UPDATE THE PLAYER SCORE
  PUT /update_score

```
| Request Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` |  Id of the player |
| `score` | `array` |  Score of the player |
| `playerName` | `string` |  Name of the player |
| `opponent_name` | `string` |  Opponent name of the player |
| `endResult` | `string` |  Final result of the game |

Totally the player has 6 rounds to play. End of each round score of the player is pushed into the 'score' array.

'id' is used to find the player for updating the score.

'endResult' contain the final result(win/loss/tie) based on this the final winner is announced. 

'playerName' or 'opponent_name' is used to store name of the final winner.





## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SERVER_PORT` - to run the server on desired port

`DB_CONNECTION_URL` - to connect with postgres database remotely

`TABLE_NAME` - the table whcih is going to save all the data

