/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Resource } from "./models/resource.model";
dotenv.config();

/**
 * Import database functions
 */

const { startDatabase } = require("./database/mongo");
const {
  insertWork,
  getWorks,
  deleteWork,
  updateWork,
} = require("./database/works");

/**
 * App Variables
 */

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const ads = [
  { title: "Hello, world (again)!" },
  { title: "All work and no play makes Jack a dull boy." },
]; // Todo: Temporary database, remove this

const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("combined"));

/**
 * Authentication
 */

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_API_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: `${AUTH0_API_IDENTIFIER}`,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

/**
 * Endpoints
 */

app.get("/", async (req, res) => {
  res.send(await getWorks());
});

app.get("/secret/home", checkJwt, async (req, res) => {
  res.send("This is a secret page.");
});

app.post("/", checkJwt, async (req, res) => {
  const newWork = req.body;
  await insertWork(newWork);
  res.send({ message: "New work inserted." });
});

app.delete("/:id", checkJwt, async (req, res) => {
  await deleteWork(req.params.id);
  res.send({ message: "Work removed." });
});

app.put("/:id", checkJwt, async (req, res) => {
  const updatedWork = req.body;
  await updateWork(req.params.id, updatedWork);
  res.send({ message: "Work updated." });
});

/**
 * Server Activation
 */

let server: any = null;

startDatabase().then(async () => {
  await insertWork({ title: "Hello, now from the in-memory database!" });
  await insertWork({ title: "All work and no play makes Jack a dull boy." });
  await insertWork({ title: "All play and no work makes Jack a mere toy." });
  await insertWork({
    metadata: "metadata",
    dateBegin: new Date(),
    dateEnd: new Date(),
    resources: "slot",
  });

  server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

/**
 * Webpack HMR Activation
 */

type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

declare const module: WebpackHotModule;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.close());
}
