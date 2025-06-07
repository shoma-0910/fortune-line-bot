const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 入力・出力パスを取得
const inputPath = process.argv[2];
const outputPath = process.argv[3];

const tmpDir = path.dirname(outputPath);
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// 占い文を1行ずつ読み込む
const lines = fs.readFileSync(inputPath, "utf-8").split("\n");

// 使用フォント（Render や Linux で使えるパス）
const fontPath = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

// 1行ずつ画像を生成
const imagePaths = [];
lines.forEach((line, index) => {
  const imagePath = path.join(tmpDir, `line_${index + 1}.png`);
  const safeText = line.replace(/'/g, "\\'");
  const ffmpegCmd = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=3 -vf "drawtext=fontfile='${fontPath}':fontsize=40:fontcolor=white:x=50:y=360:text='${safeText}'" -y ${imagePath}`;
  execSync(ffmpegCmd);
  imagePaths.push(imagePath);
});

// 画像を動画として結合
const concatListPath = path.join(tmpDir, "images.txt");
fs.writeFileSync(concatListPath, imagePaths.map(p => `file '${p}'`).join("\n"));

const concatCmd = `ffmpeg -f concat -safe 0 -i ${concatListPath} -vsync vfr -pix_fmt yuv420p -y ${outputPath}`;
execSync(concatCmd);

console.log("🎞️ 動画生成完了:", outputPath);
