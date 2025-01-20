import express from "express"
import { PORT } from './utils/config';


const app = express();

app.listen(PORT
  , () => {
  console.log("Server is running on port 3000")
})