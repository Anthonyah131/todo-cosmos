const CosmosClient = require('@azure/cosmos').CosmosClient;
const debug = require('debug')('todo-cosmos:task');

const partitionKey = '0';

// Este es el modelo de datos
class Task {
    /**
     * Lee, añade y actualiza tareas en Cosmos DB
     * @param {CosmosClient} cosmosClient 
     * @param {string} databaseID 
     * @param {string} containerID 
     */
    constructor(cosmosClient, databaseID, containerID) {
        this.client = cosmosClient;
        this.databaseID = databaseID;
        this.containerID = containerID;

        this.database = null;
        this.container = null;

    }

    async init() {
        debug("Inicializando BD");
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseID
        });

        this.database = dbResponse.database;

        debug("Inicializando contenedor...");
        const contResponse = await this.database.containers.createIfNotExists({
            id: this.containerID
        });
        this.container = contResponse.container;
    }

    /**
     *  Crea el Item en Cosmos BD
     * @param {*} item 
     * @returns {resource} Item creado en la BD
     */
    async addItem(item) {
        debug("Añadiendo item a la BD");
        item.date = Date.now();
        item.completed = false;
        const { resource: doc } = await this.container.items.create(item);

        return doc;
    }

    /**
     *  Elimina el Item en Cosmos BD
     * @param {*} itemId 
     * @returns
     */
    async deleteItem(itemId) {
        debug("Eliminando ITEM");
        const { resource: replaced } = await this.container.item(itemId).delete();

        return replaced;
    }

    /**
     * 
     * @param {string} itemId 
     * @returns 
     */
    async updateItem(itemId) {
        debug("Actualizando ITEM");
        const doc = await this.getItem(itemId);
        if(!doc.completed) doc.completed = true;
        else doc.completed = false;

        const { resource: replaced } = await this.container.item(itemId).replace(doc);

        return replaced;
    }

    /**
     * 
     * @param {string} itemId 
     * @returns 
     */
    async getItem(itemId) {
        debug("Buscando ITEM en la BD");
        const { resource } = await this.container.item(itemId).read(); // Partition key esta en null

        return resource;
    }

    /**
     * Encuentra un objeto en la BD
     * @param {string} querySpec 
     */
    async find(querySpec) {
        debug("Buscando en la base de datos");
        if(!this.container) {
            throw new Error("El contenedor no se a inicializado");
        }
        const { resources } = await this.container.items.query(querySpec).fetchAll();
        
        return resources;
    }
}

module.exports = Task;