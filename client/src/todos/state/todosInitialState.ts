import { Todo } from '../types/Todo';

const todos: Todo[] = [
    { todoId: 1, description: 'todo 1' },
    { todoId: 2, description: 'todo 2' },
    { todoId: 3, description: 'todo 6' },
];

export const todosInitialState = {
    todos: todos,
};
