const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

// 使用するフォントパス（DockerでNotoSansCJKを使う）
const fontPath = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf";

try {
  const text = fs.readFileSync(inputPath, "utf-8");

  // 一時テキストファイルを作成（drawtextのtextfile用）
  const tempTextFile = path.join("/tmp", "ffmpeg_text.txt");
  fs.writeFileSync(tempTextFile, text);

  // ffmpegコマンド（textfileオプションを使用）
  const ffmpegCmd = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 -vf "drawtext=fontfile='${fontPath}':fontsize=40:fontcolor=white:x=50:y=50:textfile='${tempTextFile}'" -y ${outputPath}`;

  console.log("🎬 実行コマンド:", ffmpegCmd);
  execSync(ffmpegCmd, { stdio: "inherit" });

  console.log(`✅ 動画生成完了: ${outputPath}`);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err);
  process.exit(1);
}
