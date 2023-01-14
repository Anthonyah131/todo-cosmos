const Task = require("../models/task");

// Este es el controlador
class TaskList {
  /**
   * Manejar APIS, despliega y maneja los task
   * @param {Task} taskObjeto
   */
  constructor(taskObjeto) {
    this.taskObjeto = taskObjeto;
  }

  async addTask(req, res) {
    const item = req.body;

    await this.taskObjeto.addItem(item);
    res.redirect("/all");
  }

  async deleteTask(req, res) {
    // console.log("entra completeTask")
    const completedTasks = Object.keys(req.body);
    console.log(completedTasks);

    const tasks = [];

    completedTasks.forEach((task) => {
      tasks.push(this.taskObjeto.deleteItem(task));
    });

    await Promise.all(tasks);

    console.log(completedTasks);

    res.redirect("/complete");
  }

  async completeTask(req, res) {
    //console.log("entra completeTask")
    const completedTasks = Object.keys(req.body);

    const tasks = [];

    completedTasks.forEach((task) => {
      tasks.push(this.taskObjeto.updateItem(task));
    });
    await Promise.all(tasks);

    res.redirect("/all");
  }

  async showTasks(req, res) {
    const querySpec = {
      query: "SELECT * FROM root r WHERE r.completed=@completed",
      parameters: [
        {
          name: "@completed",
          value: false,
        },
      ],
    };

    const items = await this.taskObjeto.find(querySpec);
    res.render("index", {
      title: "Mi lista de pendientes",
      tasks: items,
    });
  }

  async showCompleteTasks(req, res) {
    const querySpec = {
      query: "SELECT * FROM root r WHERE r.completed=@complete",
      parameters: [
        {
          name: "@complete",
          value: true,
        },
      ],
    };

    const items = await this.taskObjeto.find(querySpec);
    res.render("index", {
      title: "Mi lista de pendientes",
      tasks: items,
    });
  }

  async showAllTasks(req, res) {
    const querySpec = {
      query: "SELECT * FROM root",
    };

    const items = await this.taskObjeto.find(querySpec);
    res.render("index", {
      title: "Mi lista de pendientes",
      tasks: items,
    });
  }
}

module.exports = TaskList;
