const express = require("express");
const router = express.Router();
const cryptoController = require("../contoller/cryptoController");


router.get("/getallcrypto", cryptoController.getAllcrypto);
// router.post("/addcrypto", cryptoController.addcrypto);
router.get("/fetch-crypto-updates", async (req, res) => {
    try {
      const cryptosData = await cryptoController.getCryptoUpdates();
      res.json({ cryptosData });
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Failed to fetch cryptocurrency updates." });
    }
  });


module.exports = router;