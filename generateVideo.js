const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 占いテキストファイルのパスを受け取る
const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

// フォントパス（RenderやDockerで使える日本語対応フォント）
const fontPath = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf";

try {
  const text = fs.readFileSync(inputPath, "utf-8");

  // 🎥 ffmpeg コマンドを文字列に直接埋め込む（textfile は使わない）
  const ffmpegCmd = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=3 -vf "drawtext=fontfile='${fontPath}':fontsize=40:fontcolor=white:x=50:y=360:text='${text.replace(/\n/g, '\\n').replace(/'/g, "\\'")}'" -y ${outputPath}`;

  console.log("実行コマンド:", ffmpegCmd); // ←デバッグ用に出力

  execSync(ffmpegCmd, { stdio: "inherit" });

  console.log(`🎞️ 動画生成完了: ${outputPath}`);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err);
  process.exit(1);
}
