import { TodosState } from '~/todos/types/TodosState';
import { todoActions } from '~/todos/state/todoActions';
import { todosReducer } from '~/todos/state/todosReducer';
import { ActionType } from 'typesafe-actions';

interface TestArgument {
    beforeState: TodosState;
    action: ActionType<typeof todoActions>;
    expectedState: TodosState;
}

const testMacro = ({ beforeState, action, expectedState }: TestArgument): void => {
    const actualState = todosReducer(beforeState, action);

    expect(actualState).toEqual(expectedState);
};

describe('todos reducer', () => {
    it('add todo', () => {
        testMacro({
            beforeState: {
                todos: [],
            },
            action: todoActions.addTodo('Hello, world!'),
            expectedState: {
                todos: [{ todoId: 1, description: 'Hello, world!' }],
            },
        });
    });
});
