FROM node:18

# ffmpeg + 日本語フォント（Noto Sans CJK）をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    fonts-noto-cjk && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ作成
WORKDIR /app

# パッケージ関連コピーしてインストール
COPY package*.json ./
RUN npm install

# プロジェクトファイルをコピー
COPY . .

# ポートを公開
EXPOSE 3000

# アプリを起動
CMD ["node", "index.js"]
