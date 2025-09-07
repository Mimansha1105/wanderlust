const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing");
const mongourl = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to database");
    initdb(); // ✅ only after connection
}).catch(err => {
    console.log("DB Connection Error:", err);
});

async function main() {
    await mongoose.connect(mongourl);
}

const initdb = async () => {
    try {
        await listing.deleteMany({});
        initdata.data=initdata.data.map((obj)=>({...obj,owner:"68979302be0984f6af0a0fd8"}));
        await listing.insertMany(initdata.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Data init failed:", err); // Add helpful debug
    }
};
