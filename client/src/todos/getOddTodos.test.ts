import { getOddTodos } from './getOddTodos';

describe('', () => {
    it('base', () => {
        const input = [
            { todoId: 2, description: '' },
            { todoId: 3, description: '' },
            { todoId: 4, description: '' },
        ];
        const actualOddTodoIds = getOddTodos(input).map(t => t.todoId);
        const expectedOddTodoIds = [3];
        expect(actualOddTodoIds).toEqual(expectedOddTodoIds);
    });
});
