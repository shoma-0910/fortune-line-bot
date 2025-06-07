const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 引数チェック
const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

if (!inputPath || !outputPath) {
  console.error("❌ 引数エラー: inputPath と outputPath を指定してください");
  process.exit(1);
}

// 出力ディレクトリが存在しない場合は作成
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  const text = fs.readFileSync(inputPath, "utf-8");

  // テキスト内の特殊文字をエスケープ
  const safeText = text
    .replace(/'/g, "\\'")       // シングルクォート
    .replace(/"/g, '\\"')       // ダブルクォート
    .replace(/\n/g, '\\n');     // 改行

  // 使用フォントのパス（Render環境で有効なものに修正が必要な場合あり）
  const fontPath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

  // FFmpeg コマンド
  const command = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=10 -vf "drawtext=fontfile='${fontPath}':fontsize=30:fontcolor=white:x=50:y=50:text='${safeText}'" -y ${outputPath}`;

  console.log("📽️ 実行コマンド:", command);
  execSync(command, { stdio: "inherit" });

  console.log(`🎞️ 動画生成完了: ${outputPath}`);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err.message);
  console.error(err.stack);
  process.exit(1);
}
