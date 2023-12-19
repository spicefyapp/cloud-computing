import { Router } from "express";
import { body, param } from "express-validator";
import Controller from "./controller.js";

const routes = Router({ strict: true });

// Create Data
routes.post(
    "/add",
    [
        body("name", "Must not be empty.").trim().not().isEmpty().escape(),
        body("description", "Must not be empty.").trim().not().isEmpty().escape(),
        body("image", "Must not be empty.").trim().not().isEmpty().isURL(),
    ],
    Controller.validation,
    Controller.addr
);

// Read Data
routes.get("/show", Controller.showr);
routes.get(
    "/spiceID/:id",
    [param("id", "Invalid ID.").exists().isNumeric().toInt()],
    Controller.validation,
    Controller.showr
);
routes.get(
    "/spiceName/:name",
    [param("name", "Invalid name.").exists().isString().trim()],
    Controller.validation,
    Controller.showr
);

// Update Data
routes.put(
    "/edit",
    [
        body("id", "Invalid ID").isNumeric().toInt(),
        body("name", "Must not be empty.")
            .optional()
            .trim()
            .not()
            .isEmpty()
            .escape(),
        body("description", "Must not be empty.")
            .optional()
            .trim()
            .not()
            .isEmpty()
            .escape(),
        body("image", "Must not be empty.")
            .optional()
            .trim()
            .not()
            .isEmpty()
            .isURL(),
    ],
    Controller.validation,
    Controller.editr
);

// Delete Data
routes.delete(
    "/delete",
    [
        body("id", "Please provide a valid ID.")
            .exists()
            .isNumeric()
            .toInt(),
    ],
    Controller.validation,
    Controller.deleter
);

export default routes;
