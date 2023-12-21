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

    static add = async (req, res, next) => {
        const { name, price, noWA, description, image, lat, lan} = matchedData(req);
        const ximage = image !== null ? image : 'https://storage.googleapis.com/gambar-rempah-spicefy/deff.jpg';
        const xdescription = description !== null ? description : '-';
        
        if (!name || !price || !noWA || !description || !image || !lat || !lan) {
            return res.status(422).json({
                ok: 0,
                status: 422,
                message: "Required parameters are missing or undefined"
            });
        }
        
        try {
            const [result] = await DB.execute(
                "INSERT INTO market (`name`, `price`, `noWA`, `description`,`image` ,`lat` ,`lan`) VALUES (?,?,?,?,?,?,?)",
                [name, price, noWA, xdescription, ximage, lat, lan]
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

    static show = async (req, res, next) => {
        try {
            let sql = "SELECT * FROM market";
            if (req.params.id) {
                sql = `SELECT * FROM market WHERE id=${req.params.id}`;
            } else if (req.params.name) {
                const partialName = `%${req.params.name}%`;
                sql = `SELECT * FROM market WHERE name LIKE '${partialName}'`;
            }
            const [row] = await DB.query(sql);
            if (row.length === 0 && (req.params.id || req.params.name)) {
                return res.status(404).json({
                    ok: 0,
                    status: 404,
                    message: req.params.id ? "Invalid ID." : "No matching name found.",
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
