const express = require("express");
const {getAllBanks, createBank, getBankById, updateBank, getBankTotal} = require('./controller/Bank')
const Jwtauthentication = require("../../middleware/Jwtauthentication");

const bankRouter = express.Router();

bankRouter.use(Jwtauthentication.isAdmin);

// Bank CRU
bankRouter.post("/", createBank);
bankRouter.get("/", getAllBanks);
bankRouter.get("/:bankId", getBankById);
bankRouter.put("/:bankId", updateBank);
bankRouter.get("/:bankId/banktotal", getBankTotal);

module.exports = { bankRouter };
