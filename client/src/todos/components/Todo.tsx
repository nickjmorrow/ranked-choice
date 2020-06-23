import * as React from 'react';
import styled from 'styled-components';
import { Todo as TodoType } from '~/todos/types/Todo';

export const Todo: React.FC<{ todo: TodoType }> = ({ todo }) => {
    return <Container>{todo.description}</Container>;
};

const Container = styled.div``;
