const express = require("express");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const app = express();
const JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZjhmNTk0Mi1mMmQwLTQxYTYtODA2MS05OTdhMzcxOTFiMTUiLCJlbWFpbCI6InZpbmF5NTUyMDIyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4MjRkZDgxZjUyMTBkNzhjMmYxNSIsInNjb3BlZEtleVNlY3JldCI6IjkzYWE0ZTI3MzA5MzU1MTJiMTY2Y2ZhMTJkZDEyYTEwM2VmZjBkZGFlZmE2Y2FmZDFhYWY3OTQ1ZWEzNGRlY2EiLCJpYXQiOjE3MDkxMjQ1ODd9.wCUYVd34tBBJrB7azFABn6NTyjtoKTx8jJD3PcfAtA8"
app.use(cors({
  origin: ["http://localhost:3001"],
  methods: ["get", "post"],
  credentials: true
}));

app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const pinataMetadata = JSON.stringify({
      name: "blockbusters",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", pinataOptions);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
          ...formData.getHeaders(), // Include headers for form data
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    console.log("IPFS Hash:", ipfsHash);

    // Send the IPFS hash back to the frontend
    res.json({ ipfsHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/retrieve", async (req, res) => {
  try {
    const { ipfsHashes } = req.body;

    if (!ipfsHashes || !Array.isArray(ipfsHashes)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    const files = await Promise.all(ipfsHashes.map(async (hash) => {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
      const fileBuffer = await response.buffer(); // Fetch file as a Buffer
      return { hash, fileBuffer };
    }));

    res.json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(4005,()=>{
  console.log("app running on 4005")
})