export const truncateLabel = (label: string, size: number): string => {
    if (label.length <= size) {
        return label;
    }

    const first = label.substr(0, size).trim();
    return `${first}...`;
};
