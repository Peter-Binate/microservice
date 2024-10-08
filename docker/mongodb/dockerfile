FROM mongo:4.4

COPY ./src/mongodb/mongod.conf /etc/mongod.conf

EXPOSE 27017

CMD ["mongod", "--config", "/etc/mongod.conf"]
