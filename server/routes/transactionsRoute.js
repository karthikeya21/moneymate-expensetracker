const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();
const moment = require("moment");
const authMiddleware = require("../middleware/auth"); // JWT middleware
const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ dest: "uploads/" });

router.post("/upload-excel", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      raw: false,
      defval: "" // empty cells become ""
    });

    const userId = req.user._id.toString();
    const docs = [];

    for (const row of sheet) {
      const allValuesEmpty = Object.values(row).every(
        v => String(v).replace(/\u200B/g, "").trim() === ""
      );

      if (allValuesEmpty) {
        break; // stop reading when an entire row is blank
      }

      // Skip rows where all user-fillable columns are blank
      if (!row["Date"] && !row["Amount"] && !row["Category"] &&
          !row["Type"] && !row["Reference"] && !row["Description"]) {
        continue;
      }

      docs.push({
        userid: userId,
        date: row["Date"] ? new Date(row["Date"]) : new Date(),
        amount: Number(row["Amount"] || 0),
        category: row["Category"] || "uncategorized",
        type: row["Type"] ? row["Type"].toLowerCase() : "expense",
        reference: row["Reference"] || "N/A",
        description: row["Description"] || "No description",
      });
    }

    if (docs.length === 0) {
      return res.status(400).json({ message: "No valid data found in Excel" });
    }

    await Transaction.insertMany(docs);
    res.json({ message: "Excel uploaded successfully", count: docs.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});






router.post("/add-transaction", authMiddleware, async (req, res) => {
  try {
    const newTransaction = new Transaction({
      ...req.body,
      userid: req.user._id.toString(), // always set
    });
    await newTransaction.save();
    res.send("Transaction Added Successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// edit, delete, get-all-transactions
router.post("/edit-transaction", authMiddleware, async (req, res) => {
  try {
    await Transaction.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.send("Transaction Updated Successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/delete-transaction", authMiddleware, async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.body.transactionId });
    res.send("Transaction Deleted Successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/get-all-transactions", authMiddleware, async (req, res) => {
  const { frequency, selectedRange, type } = req.body;
  try {
    const transactions = await Transaction.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedRange[0],
              $lte: selectedRange[1],
            },
          }),
      userid: req.user._id.toString(),
      ...(type !== "all" && { type }),
    });

    res.send(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
