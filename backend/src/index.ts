import express from "express"
import cors from "cors";
import { AppDataSource } from "./config/data-source";
import peopleRoutes from "./routes/peopleRoutes";
import eprRoutes from "./routes/eprRoutes"

const app=express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("server is running");
});

app.use("/api/people",peopleRoutes);
app.use("/api/epr",eprRoutes);


AppDataSource.initialize()
  .then(()=>{
    console.log("dataase connected");

    app.listen(PORT,()=>{
      console.log(`server running on port-${PORT}`);
    })
  })
  .catch((err)=>{
    console.log("server init failed due to:")
    console.log(err);
  })

