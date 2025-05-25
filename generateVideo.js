const { execSync } = require("child_process");
const fs = require("fs");

const filePath = process.argv[2];
if (!filePath || !fs.existsSync(filePath)) {
  console.error("⛔ テキストファイルが指定されていません。");
  process.exit(1);
}

const inputText = fs.readFileSync(filePath, "utf-8");
const lines = inputText.split("\n").map((line) => line.trim()).filter(Boolean);

let drawTextFilters = lines.map((line, index) => {
  const escaped = line.replace(/:/g, "\\\\:").replace(/'/g, "\\\\'");
  return `drawtext=text='${escaped}':fontfile='/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc':fontsize=32:fontcolor=white:x=(w-text_w)/2:y=${100 + index * 50}`;
}).join(",");

const command = `ffmpeg -y -i "assets/占いbot.mp4" -vf "${drawTextFilters}" -c:a copy output/output.mp4`;

try {
  execSync(command, { stdio: "inherit" });
  console.log("✅ 占い動画を生成しました！");
} catch (err) {
  console.error("❌ ffmpeg 実行エラー:", err.message);
}
