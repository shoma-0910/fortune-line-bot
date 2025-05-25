// index.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const storage = new Storage({
  keyFilename: "firebase-key.json", // FirebaseサービスアカウントのJSONファイル名
});
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET);

async function getFortuneFromGPT() {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "12星座すべての今日の恋愛運を、1星座あたり40文字以内で1行ずつ出力してください。",
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data.choices[0].message.content.trim();
    } catch (err) {
      if (err.response?.status === 429) {
        console.log("⚠️ レート制限。2秒後に再試行...");
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.error("❌ GPTエラー:", err.message);
        throw err;
      }
    }
  }
  throw new Error("OpenAI API に3回試しても失敗しました。");
}

app.post("/webhook", async (req, res) => {
  const event = req.body.events?.[0];

  if (event?.type === "message" && event.message.text === "今日の運勢") {
    const replyToken = event.replyToken;
    try {
      const fortune = await getFortuneFromGPT();
      console.log("🎯 GPTからの占い文:", fortune);

      const tempTextPath = path.join("/tmp", "temp_fortune.txt");
      fs.writeFileSync(tempTextPath, fortune);

      exec(`node generateVideo.js "${tempTextPath}"`, async (err, stdout, stderr) => {
        if (err) {
          console.error("❌ 動画生成エラー:", err.message);
          return;
        }
        console.log("🎥 動画生成成功:", stdout);

        const filePath = "/tmp/output.mp4";
        const filename = `videos/${Date.now()}.mp4`;

        await bucket.upload(filePath, {
          destination: filename,
          public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${filename}`;

        await axios.post(
          "https://api.line.me/v2/bot/message/reply",
          {
            replyToken,
            messages: [
              {
                type: "video",
                originalContentUrl: publicUrl,
                previewImageUrl: "https://dummyimage.com/640x360/000/fff&text=占い動画",
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      });
    } catch (err) {
      console.error("❌ 全体エラー:", err.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
