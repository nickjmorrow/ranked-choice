import * as React from 'react';
import styled from 'styled-components';
import { Todo } from '~/todos/components/Todo';
import { useSelector } from 'react-redux';
import { todosSelectors } from '~/todos/state/todosSelectors';

export const TodoList: React.FC = () => {
    const todos = useSelector(todosSelectors.getTodos);
    return (
        <Container>
            {todos.map(t => (
                <Todo key={t.todoId} todo={t} />
            ))}
        </Container>
    );
};

const Container = styled.div``;
