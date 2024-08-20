const express = require("express");
const app = express();
const port = 3000;

const getFBInfo = require("@xaviabot/fb-downloader");
const idl = require("i-downloader");
const cors = require("cors");

app.use(cors());

// Stream Facebook video directly to client
app.get("/fb", async (req, res) => {
  const video = req.query.video;

  try {
    const result = await getFBInfo(video);

    if (result && result.download) {
      const videoUrl = result.download.hd || result.download.sd; // Prefer HD if available

      res.header("Content-Disposition", 'attachment; filename="video.mp4"');
      res.header("Content-Type", "video/mp4");

      // Stream the video to the client
      const response = await fetch(videoUrl);
      response.body.pipe(res);
    } else {
      res.status(404).send("Video not found or could not be downloaded.");
    }
  } catch (error) {
    console.error("Error downloading Facebook video:", error);
    res.status(500).send("Error processing your request.");
  }
});

// Instagram API (no changes needed for direct download)
app.get("/insta", async (req, res) => {
  const link = req.query.link;
  let resData = await idl(link);
  res.json(resData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
