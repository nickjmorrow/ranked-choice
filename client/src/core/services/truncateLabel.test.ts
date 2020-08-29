import { truncateLabel } from '~/core/services/truncateLabel';

describe('truncate label', () => {
    it('truncates label down to size and then appends ellipsis if label is greater than size', () => {
        testMacro('sunshine', 4, 'suns...');
    });
    it('does nothing if size is greater than label', () => {
        testMacro('sunshine', 10, 'sunshine');
    });
    it('trims output before appending ellipsis', () => {
        testMacro('red blue', 4, 'red...');
    });
});

const testMacro = (label: string, size: number, expectedOutput: string): void => {
    expect(truncateLabel(label, size)).toBe(expectedOutput);
};
