import { useMutation } from '@tanstack/react-query';
import { createPoll } from 'src/api/polls';

export default function useCreatePoll() {
  return useMutation({ mutationFn: createPoll });
}
