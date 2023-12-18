import { Router } from "express";
import { body, param } from "express-validator";
import Controller from "./controller.js";

const routes = Router({ strict: true });

// Create Data
routes.post(
    "/data-spice/add",
    [
        body("name", "Must not be empty.").trim().not().isEmpty().escape(),
        body("price", "Must not be empty.").trim().not().isEmpty().escape(),
        body("noWA", "Must not be empty.").trim().not().isEmpty().escape(),
        body("description", "Must not be empty.").trim().not().isEmpty().escape(),
        body("image", "Must not be empty.").trim().not().isEmpty().isURL(),
        body("lat", "Must not be empty.").trim().not().isEmpty().escape(),
        body("lan", "Must not be empty.").trim().not().isEmpty().escape(),
    ],
    Controller.validation,
    Controller.add_rempah
);

// Read Data
routes.get("/data-spice/show", Controller.show_rempah);
routes.get(
    "/data-spice/spice/:id",
    [param("id", "Invalid ID.").exists().isNumeric().toInt()],
    Controller.validation,
    Controller.show_rempah
);

export default routes;
