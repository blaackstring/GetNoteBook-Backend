import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const edgeTTSUniversal = require("edge-tts-universal");
const { Communicate } = edgeTTSUniversal;
import { uploadFileToS3 } from "../../controller/S3UploadController.js";


import 'dotenv/config';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../../");

// 1. Read Summary
function getSummaryText() {
  const summaryPath = path.join(rootDir, "summary.txt");
  console.log("📂 Looking for summary.txt at:", summaryPath);

  if (!fs.existsSync(summaryPath)) {
    throw new Error(`summary.txt not found at ${summaryPath}`);
  }
  return fs.readFileSync(summaryPath, "utf8");
}

// 2. Generate Audio (Edge TTS Universal)
async function generateAudio(text) {
  console.log("🔊 Generating Audio (Edge TTS Communicator)...");

  const comm = new Communicate(text, 'en-US-AriaNeural');

  const audioPath = path.join(rootDir, "input.mp3");

  const audioBuffer = await comm.stream();

  const chunks = [];
  for await (const chunk of audioBuffer) {
    if (chunk.type === 'audio') {
      chunks.push(chunk.data);
    }
  }
  const finalBuffer = Buffer.concat(chunks);
  fs.writeFileSync(audioPath, finalBuffer);

  console.log("✅ Audio saved:", audioPath);
  return audioPath;
}

async function getImages() {
  console.log("📂 Using existing images from src/images...");

  const imagesDir = path.join(rootDir, "src", "images");

  if (!fs.existsSync(imagesDir)) {
    throw new Error(`Images directory not found at: ${imagesDir}`);
  }

  return imagesDir;
}


async function getAudioDuration() {
  const currentDir = rootDir;
  const dockerProbe = `docker run --rm -v "${currentDir}:/config" --entrypoint ffprobe linuxserver/ffmpeg -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 /config/input.mp3`;

  return new Promise((resolve) => {
    exec(dockerProbe, (error, stdout) => {
      if (error || !stdout) 
        {
        console.warn("⚠️ Could not probe audio duration. Defaulting to -shortest.");
        resolve(null);
      } 
      
      
      else
        
        
        {
        const seconds = parseFloat(stdout.trim());
        console.log(`⏱️ Audio Duration detected: ${seconds}s`);
        resolve(seconds);
      }
    });
  });
}


async function createVideo(imagesDir) {
  console.log("🎬 Creating Video with ffmpeg (Docker)...");

  const currentDir = rootDir;
  const outputPath = "output.mp4";

  const duration = await getAudioDuration();


  const durationOption = duration ? `-t ${Math.ceil(duration)}` : "-shortest";


  const dockerCommand = `docker run --rm -v "${currentDir}:/config" -w /config linuxserver/ffmpeg -loop 1 -framerate 1/10 -i src/images/%d.png -i input.mp3 -c:v libx264 -pix_fmt yuv420p ${durationOption} output.mp4 -y`;

  return new Promise((resolve, reject) => {
    exec(dockerCommand, (error, stdout, stderr) => {
      if (error)
         {
        console.error("Error executing docker ffmpeg:", error);
        console.error("Stderr:", stderr);
        
        resolve(null);
      } 
      else 
        {
        console.log("ffmpeg output:", stderr);
        console.log("✅ Video created: output.mp4");
        resolve(path.join(currentDir, outputPath));
      }
    });
  });
}






export const summary = async (req, res) => {
  try {
    console.log("🚀 Starting Pipeline...");


    const text = getSummaryText();

  
    await generateAudio(text);


    const imagesDir = await getImages();

  
    const videoPath = await createVideo(imagesDir);

    if (videoPath && fs.existsSync(videoPath)) 
      {
  console.log("☁️ Uploading to S3...");
const videoBuffer = fs.readFileSync(videoPath);
      const uniqueKey = `video_summary_${Date.now()}.mp4`;

      if (!process.env.S3_BUCKET_NAME)
         {
        console.warn("⚠️ S3_BUCKET_NAME not set. Attempting to load from src/.env manual check or fail.");
 
      }

      const uploadResult = await uploadFileToS3(videoBuffer, uniqueKey, "video/mp4");
      console.log("✅ Uploaded to S3:", uploadResult.url);

      if (res) {
        res.json({
          videoId: uploadResult.key
        });
      }
      return uploadResult.url;
    } else {
      throw new Error("Video creation failed");
    }

  } catch (error) {
    console.error("❌ Pipeline Error:", error);
    if (res) res.status(500).json({ success: false, error: error.message });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) 
  {
  summary(
    {},
    {
      status: (c) => ({ json: (d) => console.log("Response:", d), send: (d) => console.log("Response:", d) }),
      json: (d) => console.log("Response:", d),
      send: (d) => console.log("Response:", d)
    }
  );
}
