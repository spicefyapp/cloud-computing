import { validationResult, matchedData } from "express-validator";
import DB from "./dbConnection.js";

const validation_result = validationResult.withDefaults({
    formatter: (error) => error.msg,
});

class Controller {
    static validation = (req, res, next) => {
        const errors = validation_result(req).mapped();
        if (Object.keys(errors).length) {
            return res.status(422).json({
                ok: 0,
                status: 422,
                errors,
            });
        }
        next();
    };

    static add_rempah = async (req, res, next) => {
        const { name, price, noWA, description, image, lat, lan} = matchedData(req);
        try {
            const [result] = await DB.execute(
                "INSERT INTO `data_rempah` (`id`, `name`, `price`, `noWA`, `description`,`image` ,`lat` ,`lan`) VALUES (?,?,?,?,?,?,?)",
                [0, name, price, noWA, description, image, lat, lan]
            );
            res.status(201).json({
                ok: 1,
                status: 201,
                message: "Spice has been added successfully",
                id: result.insertId,
            });
        } catch (e) {
            next(e);
        }
    };

    static show_rempah = async (req, res, next) => {
        try {
            let sql = "SELECT * FROM `data_rempah`";
            if (req.params.id) {
                sql = `SELECT * FROM rempah WHERE id=${req.params.id}`;
            }
            const [row] = await DB.query(sql);
            if (row.length === 0 && req.params.id) {
                return res.status(404).json({
                    ok: 0,
                    status: 404,
                    message: "Invalid ID.",
                });
            }
            const spice = req.params.id ? { spice: row[0] } : { rempah: row };
            res.status(200).json({
                ok: 1,
                status: 200,
                ...spice,
            });
        } catch (e) {
            next(e);
        }
    };
}

export default Controller;
