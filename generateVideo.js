const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const [inputPath, outputPath] = process.argv.slice(2);

try {
  const text = fs.readFileSync(inputPath, "utf-8");

  const fontPath = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf";

  const safeText = text.replace(/'/g, "\\'").replace(/\n/g, "\\n");

  const ffmpegCmd = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 -vf "drawtext=fontfile='${fontPath}':fontsize=40:fontcolor=white:x=50:y=360:text='${safeText}'" -y ${outputPath}`;

  execSync(ffmpegCmd, { stdio: "inherit" });

  console.log(`🎞️ 動画生成完了: ${outputPath}`);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err);
  process.exit(1);
}
