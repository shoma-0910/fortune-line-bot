FROM node:18

# ffmpeg + 日本語フォントのインストール
RUN apt-get update && \
    apt-get install -y ffmpeg fonts-noto-cjk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /app

# パッケージ関連をインストール
COPY package*.json ./
RUN npm install

# 必要な全ファイルをコピー（ここが抜けてた）
COPY . .

# ポートを公開
EXPOSE 3000

# アプリ起動
CMD ["node", "index.js"]
