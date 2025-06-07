# Node.js + ffmpeg が入っている環境をベースにする
FROM node:18-slim

# ffmpegや日本語フォントをインストール
RUN apt-get update && apt-get install -y \
    ffmpeg \
    fonts-noto-cjk \
 && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを作成
WORKDIR /app

# ローカルのファイルを全部コンテナ内へコピー
COPY . .

# 依存関係をインストール
RUN npm install

# 環境変数が必要ならここで受け取れるようにしておく
ENV PORT=3000

# アプリの起動コマンド
CMD ["node", "index.js"]
