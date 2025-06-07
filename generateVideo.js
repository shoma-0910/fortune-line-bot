const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const inputPath = process.argv[2];
const outputPath = process.argv[3];

const tmpDir = os.tmpdir();
const fontPath = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.otf";

try {
  const text = fs.readFileSync(inputPath, "utf-8").trim();
  const lines = text.split("\n");

  const imageList = [];

  lines.forEach((line, index) => {
    const textFile = path.join(tmpDir, `text_${index + 1}.txt`);
    fs.writeFileSync(textFile, line);

    const imagePath = path.join(tmpDir, `line_${index + 1}.png`);
    const ffmpegCmd = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=3 -vf drawtext=fontfile='${fontPath}':fontsize=40:fontcolor=white:x=50:y=360:textfile='${textFile}' -y ${imagePath}`;

    execSync(ffmpegCmd, { stdio: "inherit" });
    imageList.push(`file '${imagePath}'`);
  });

  const concatListPath = path.join(tmpDir, "images.txt");
  fs.writeFileSync(concatListPath, imageList.join("\n"));

  const concatCmd = `ffmpeg -f concat -safe 0 -i ${concatListPath} -vsync vfr -pix_fmt yuv420p -y ${outputPath}`;
  execSync(concatCmd, { stdio: "inherit" });

  console.log("🎞️ 動画生成完了:", outputPath);
} catch (err) {
  console.error("❌ generateVideo.js エラー:", err);
  process.exit(1);
}
