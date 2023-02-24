const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const expensesRoute = require("./routes/expenses");
const expenseTypesRoute = require("./routes/expenseTypes");
const expenseMetadataRoute = require("./routes/expenseMetadata");

// Create Express app
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use("/api/expenses", expensesRoute);
app.use("/api/expensetypes", expenseTypesRoute);
app.use("/api/expensemetadata", expenseMetadataRoute);

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://yasmikash:yoQnDqvik6x9zFVd@cluster0.8ljxq8a.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    // Start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((error) => console.error("Could not connect to MongoDB", error));
