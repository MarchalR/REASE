FROM node:8.4-stretch
WORKDIR /home
RUN mkdir API
WORKDIR /home/API
COPY package.json /home/API/package.json
RUN npm install
RUN mkdir src
COPY src /home/API/src
VOLUME src
VOLUME /var/run/docker.sock
EXPOSE 3000
CMD npm start