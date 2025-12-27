import { CreateDocument } from "../config/Load&Split/TextSplitter.js";

export const FetchTranscript = async (transcriptId) => {
  try {
    console.log(transcriptId);

    const res = await fetch("https://www.youtube-transcript.io/api/transcripts", {
      method: "POST",
      headers: {


        Authorization: `Basic ${process.env.YT_TRANSCRIPT_API_KEY}`,
        
        "Content-Type": "application/json",
      },
      body: JSON.stringify({




        ids: [transcriptId]

      }),
    }).then((res) => res.json());

  
    console.log(res);
   const result=await CreateDocument({text:res[0].text});
    return res[0];
  } catch (error) {
    console.log("Error fetching transcript:", error);
    throw error; // Re-throw to handle in controller
  }
};

export const FetchYoutubeScriptController = async (req, res) => {
  try {
    const { transcriptId } = req.params;
    if (!transcriptId) {
      return res.status(400).json({ error: "Missing transcriptId in request params" });
    }

    const data = await FetchTranscript(transcriptId);
    res.status(200).json(data);
  } catch (error) {
    console.log("Error in FetchYoutubeScriptController:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
