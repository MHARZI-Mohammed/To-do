export interface ITodo {
    id: number;
    text: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    priority: 'low' | 'medium' | 'high';
}

export class Todo implements ITodo {
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        public id: number,
        public text: string,
        public description: string = '',
        public completed: boolean = false,
        public priority: 'low' | 'medium' | 'high' = 'medium'
    ) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    update(text: string, priority: 'low' | 'medium' | 'high'): void {
        this.text = text;
        this.priority = priority;
        this.updatedAt = new Date();
    }
}