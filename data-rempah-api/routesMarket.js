import { Router } from "express";
import { body, param } from "express-validator";
import Controller from "./controllerMarket.js";

const routes = Router({ strict: true });

// Create Data
routes.post(
    "/add",
    [
        body("name", "Must not be empty.").trim().not().isEmpty().escape(),
        body("price", "Must not be empty.").trim().not().isEmpty().escape(),
        body("noWA", "Must not be empty.").trim().not().isEmpty(),
        body("description", "Must not be empty.").notEmpty(),
        body("image", "Must be URL.").trim().not().isEmpty().isURL(),
        body("lat", "Must not be empty.").trim().not().isEmpty(),
        body("lan", "Must not be empty.").trim().not().isEmpty(),
    ],
    Controller.validation,
    Controller.add
);

// Read Data
routes.get("/show", Controller.show);
routes.get(
    "/spiceID/:id",
    [param("id", "Invalid ID.").exists().isNumeric().toInt()],
    Controller.validation,
    Controller.show
);
routes.get(
    "/spiceName/:name",
    [param("name", "Invalid name.").exists().isString().trim()],
    Controller.validation,
    Controller.show
);

export default routes;
