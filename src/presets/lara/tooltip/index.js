export default {
    root: ({ context, props }) => ({
        class: [
            // Position and Shadows
            'absolute',
            'shadow-md',
            'p-fadein',
            // Spacing
            {
                'py-0 px-1': context?.right || context?.left || (!context?.right && !context?.left && !context?.top && !context?.bottom),
                'py-1 px-0': context?.top || context?.bottom
            }
        ]
    }),
    arrow: ({ context, props }) => ({
        class: [
            // Position

            'absolute',

            // Size
            'w-0',
            'h-0',

            // Shape
            'border-transparent',
            'border-solid',
            {
                'border-y-[0.25rem] border-r-[0.25rem] border-l-0 border-r-zinc-200': context?.right || (!context?.right && !context?.left && !context?.top && !context?.bottom),
                'border-y-[0.25rem] border-l-[0.25rem] border-r-0 border-l-zinc-200': context?.left,
                'border-x-[0.25rem] border-t-[0.25rem] border-b-0 border-t-zinc-200': context?.top,
                'border-x-[0.25rem] border-b-[0.25rem] border-t-0 border-b-zinc-200': context?.bottom
            },

            // Spacing
            {
                '-mt-1 ': context?.right || (!context?.right && !context?.left && !context?.top && !context?.bottom),
                '-mt-1': context?.left,
                '-ml-1': context?.top || context?.bottom
            }
        ]
    }),
    text: {
        class: ['p-2', 'bg-zinc-200 dark:bg-surface-700', 'text-black', 'leading-none', 'rounded-md', 'whitespace-pre-line', 'break-words', 'text-sm']
    }
};
