FROM node

RUN mkdir /app

WORKDIR /app

RUN git clone https://github.com/MetaMask/mm-plugin
RUN cd mm-plugin
RUN npm i -g mm-plugin

COPY . /app

RUN mm-plugin build

EXPOSE 8081

CMD ["mm-plugin", "serve"]