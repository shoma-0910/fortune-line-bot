
FROM node:18

# ffmpeg + 日本語フォントをインストール
RUN apt-get update && \
    apt-get install -y ffmpeg fonts-noto-cjk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ
WORKDIR /app

# パッケージをコピーしてインストール
COPY package*.json ./
RUN npm install

# ファイルをコピー
COPY . .

# ポートと起動
EXPOSE 3000
CMD ["node", "index.js"]

