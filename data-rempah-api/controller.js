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

    static addr = async (req, res, next) => {
        const { name, description, image } = matchedData(req);
        try {
            const [result] = await DB.execute(
                "INSERT INTO `rempah` (`name`,`description`,`image`) VALUES (?,?,?)",
                [name, description, image]
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

    static showr = async (req, res, next) => {
        try {
            let sql = "SELECT * FROM `rempah`";
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

    static editr = async (req, res, next) => {
        try {
            const data = matchedData(req);
            const [row] = await DB.query("SELECT * FROM `rempah` WHERE `id`=?", [
                data.id,
            ]);

            if (row.length !== 1) {
                return res.json({
                    ok: 0,
                    statu: 404,
                    message: "Invalid ID.",
                });
            }
            const spice = row[0];
            const date = new Date().toISOString();
            const name = data.name || spice.name;
            const description = data.description || spice.description;
            const image = data.image || spice.image;
            await DB.execute(
                "UPDATE `rempah` SET `name`=?, `description`=?,`image`=? WHERE `id`=?",
                [name, description, image, data.id]
            );
            res.json({
                ok: 1,
                status: 200,
                message: "Spice Updated Successfully",
            });
        } catch (e) {
            next(e);
        }
    };

    static deleter = async (req, res, next) => {
        try {
            const [result] = await DB.execute(
                "DELETE FROM `rempah` WHERE `id`=?",
                [req.description.id]
            );
            if (result.affectedRows) {
                return res.json({
                    ok: 1,
                    status: 200,
                    message: "Spice has been deleted successfully.",
                });
            }
            res.status(404).json({
                ok: 0,
                status: 404,
                message: "Invalid ID.",
            });
        } catch (e) {
            next(e);
        }
    };
}

export default Controller;
