const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 占いテキストファイルのパスを受け取る
const args = process.argv.slice(2);
const inputPath = args[0];

// /tmp ディレクトリに出力
const outputPath = "/tmp/output.mp4";

try {
  const text = fs.readFileSync(inputPath, "utf-8");

  // 動画生成の処理（例: FFmpeg 使用）
  const fontPath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; // Linux 上でよく使えるフォントパス
  const command = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 -vf "drawtext=fontfile=${fontPath}:fontsize=30:fontcolor=white:x=50:y=50:text='${text.replace(/\n/g, '\\n')}'" -y ${outputPath}`;

  execSync(command, { stdio: "inherit" });

  console.log(`🎞️ 動画生成完了: ${outputPath}`);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err);
  process.exit(1);
}
