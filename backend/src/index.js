import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { graphqlUploadExpress } from "graphql-upload";
import graphqlHTTP from "express-graphql";
import decodeJWT from "./utils/decodeJWT";
import { createConnection } from "typeorm";
import connectionOptions from "./ormConfig";
import schema from "./schema";
import parseHeaderAuthorization from "./utils/parseHeaderAuthorization";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(helmet());
app.use(cookieParser());

app.use(
  "/",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP(async (request, response, graphQLParams) => {
    let user = undefined;

    const token =
      request.cookies["X-JWT"] || parseHeaderAuthorization(request) || "";
    if (token) {
      user = await decodeJWT(token);
    }

    return {
      schema,
      graphiql: true,
      context: { request, user }
    };
  })
);

createConnection(connectionOptions)
  .then(() => {
    app.listen(4000, () => console.log("> http://localhost:4000 is listening"));
  })
  .catch(err => console.log(err));
