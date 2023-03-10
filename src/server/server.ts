import cors from "cors";
import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
// import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
import authRouter from "../auth/auth.router";
import childRouter from "../REST-entities/child/child.router";
import taskRouter from "../REST-entities/task/task.router";
import habitRouter from "../REST-entities/habit/habit.router";
import giftRouter from "../REST-entities/gift/gift.router";
import userRouter from "../REST-entities/user/user.router";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const swaggerDocument = require("../../swagger.json");
const firebaseConfig = {
  apiKey: "AIzaSyChR9sx8Vni4fcT14KaMj9LjAbC_WfQnNQ",
  authDomain: "my-first-projet-anchm.firebaseapp.com",
  projectId: "my-first-projet-anchm",
  storageBucket: "my-first-projet-anchm.appspot.com",
  messagingSenderId: "363226553667",
  appId: "1:363226553667:web:afe56f3e4fc5e65ac6e3f6",
  measurementId: "G-MGSH2V29FW"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default class Server {
  app: Application;

  constructor() {
    this.app = express();
  }

  async start() {
    this.initMiddlewares();
    // await this.initDbConnection();
    this.initRoutes();
    this.initErrorHandling();
    this.initListening();
  }

  startForTesting() {
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
    return this.app;
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
  }

  // private async initDbConnection() {
  //   try {
  //     await mongoose.connect(process.env.MONGODB_URL as string, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //       useCreateIndex: true,
  //     });
  //     console.log("Database connection is successful");
  //   } catch (error) {
  //     console.log("Database connection failed", error);
  //     process.exit(1);
  //   }
  // }

  private initRoutes() {
    this.app.use("/auth", authRouter);
    this.app.use("/child", childRouter);
    this.app.use("/task", taskRouter);
    this.app.use("/habit", habitRouter);
    this.app.use("/gift", giftRouter);
    this.app.use("/user", userRouter);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use("/privacy-policy", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../public/privacy-policy.html"));
    });
  }

  private initErrorHandling() {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction): Response => {
        let status = 500;
        if (err.response) {
          status = err.response.status;
        }
        return res.status(status).send(err.message);
      }
    );
  }

  private initListening() {
    this.app.listen(process.env.PORT || 3000, () =>
      console.log("Started listening on port", process.env.PORT)
    );
  }
}
