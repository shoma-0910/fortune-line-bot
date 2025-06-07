app.post("/webhook", async (req, res) => {
    const event = req.body.events?.[0];
  
    // すぐにLINEに200を返しておく
    res.sendStatus(200);
  
    // あとの処理は非同期で実施（遅くてもOK）
    if (event?.type === "message" && event.message.text === "今日の運勢") {
      const replyToken = event.replyToken;
      try {
        const fortune = await getFortuneFromGPT();
        console.log("🎯 GPTからの占い文:", fortune);
  
        const tempTextPath = path.join(os.tmpdir(), "temp_fortune.txt");
        fs.writeFileSync(tempTextPath, fortune);
  
        const outputPath = path.join(os.tmpdir(), `output_${Date.now()}.mp4`);
  
        exec(`node generateVideo.js "${tempTextPath}" "${outputPath}"`, async (err, stdout, stderr) => {
          if (err) {
            console.error("❌ 動画生成エラー:", err.message);
            console.error(stderr);
            return;
          }
  
          const destination = `videos/${Date.now()}.mp4`;
          await storage.bucket(bucketName).upload(outputPath, {
            destination,
            public: true,
            metadata: {
              cacheControl: "public, max-age=31536000",
            },
          });
  
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
  
          await axios.post(
            "https://api.line.me/v2/bot/message/reply",
            {
              replyToken,
              messages: [
                {
                  type: "text",
                  text: `🎬 占い動画はこちら！\n${publicUrl}`,
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
  });
  