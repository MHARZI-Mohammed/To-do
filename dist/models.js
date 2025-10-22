export class Todo {
    constructor(id, text, description = '', completed = false, priority = 'medium') {
        this.id = id;
        this.text = text;
        this.description = description;
        this.completed = completed;
        this.priority = priority;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    update(text, priority) {
        this.text = text;
        this.priority = priority;
        this.updatedAt = new Date();
    }
}
