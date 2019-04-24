FROM node:8.4-stretch
WORKDIR /home
RUN npm i -g sails grunt bower
RUN mkdir sailsjs
WORKDIR /home/sailsjs
RUN mkdir src
COPY src /home/sailsjs/src
WORKDIR /home/sailsjs/src
RUN yarn install
#RUN npm install
RUN yarn add sails-disk --save
VOLUME /home/sailsjs/src
VOLUME /var/run/docker.sock
EXPOSE 1337
CMD sails lift --dev --silly
#CMD tail -f /dev/null
