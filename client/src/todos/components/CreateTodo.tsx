import * as React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Input } from '~/core/Input';
import { Button } from '~/core/Button';
import { todoActions } from '~/todos/state/todoActions';
import { Typography } from '~/core/Typography';

export const CreateTodo: React.FC = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = React.useState('');
    const handleClick = (): void => {
        dispatch(todoActions.addTodo(description));
        setDescription('');
    };

    return (
        <Container>
            <Typography>Create Todo</Typography>
            <Input
                value={description}
                onChange={(e): void => setDescription(e.currentTarget.value)}
                data-test={'create-todo-input'}
            />
            <Button onClick={handleClick}>Submit</Button>
        </Container>
    );
};

const Container = styled.div``;
