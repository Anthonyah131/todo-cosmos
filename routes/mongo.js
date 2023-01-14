var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://miservermongotony:MB63EXR6L8YcO3Gj73cnwwZkmHo1SldEbKGRljN8F7wzZL4WVy3m21nYp6e1yq4lTn9jR4kiOEijACDbeTewkA%3D%3D@miservermongotony.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@miservermongotony@", function (err, client) {
  client.close();
});