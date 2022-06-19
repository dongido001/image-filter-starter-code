import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // filteredimage endpoint
  app.get("/filteredimage", async (req, res) => {
    let filteredpath: string | null = null

    try {
      const { image_url } = req.query

      if (!image_url) {
        throw new Error("image_url query param is required")
      }

      filteredpath = await filterImageFromURL(image_url as string)

      console.log(filteredpath)

      if (!filteredpath) {
        throw new Error(`could not filter ${image_url}`)
      }
    } catch (e: any) {
      res.status(400).json({ status: "error", message: e.message })
    }

    // req.on("close", function () {
    //   // if (filteredpath) deleteLocalFiles([filteredpath])
    // });

    res.sendFile(filteredpath)
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();