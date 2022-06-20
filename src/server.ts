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

  interface Error {
    message: string
  }

  interface QueryParams {
    image_url: string
  }

  // filteredimage endpoint
  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    let filteredpath: string | null | undefined = null

    try {
      const { image_url }: QueryParams = req.query

      if (!image_url) {
        throw new Error("image_url query param is required")
      }

      filteredpath = await filterImageFromURL(image_url as string)

      if (!filteredpath) {
        throw new Error(`could not filter ${image_url}`)
      }
    } catch (e) {
      const error: Error = e as Error
      return res.status(400).json({ status: "error", message: error.message })
    }

    req.on("close", function () {
      if (filteredpath) deleteLocalFiles([filteredpath])
    });

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