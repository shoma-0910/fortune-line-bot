FROM node:18

RUN apt-get update && \
    apt-get install -y ffmpeg fonts-noto-cjk && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install



EXPOSE 3000
CMD ["node", "index.js"]
