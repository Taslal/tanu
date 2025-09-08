import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let phoneStore: string[] = [];

function isValidPhone(p: string): boolean {
  return /^\d{8}$/.test(p);
}

app.post("/api/phones", (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!isValidPhone(phone)) {
    return res.status(400).json({ success: false, message: "8 оронтой зөв дугаар оруулна уу." });
  }
  if (phoneStore.includes(phone)) {
    return res.status(409).json({ success: false, message: "Өгөгдөл өмнө нь хадгалагдсан байна." });
  }
  phoneStore.push(phone);
  return res.json({ success: true, message: "Дугаар амжилттай хадгаллаа.", phone });
});

app.get("/api/phones", (req: Request, res: Response) => {
  res.json({ success: true, phones: phoneStore });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
