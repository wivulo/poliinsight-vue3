export default {
    root: ({ props }) => ({
        class: [
            //Font
            'text-xs font-semibold',

            //Alignments
            'inline-flex items-center justify-center',

            //Spacing
            'px-2',

            //Shape
            {
                'rounded-md': !props.rounded,
                'rounded-full': props.rounded
            },

            //Colors
            'dark:text-white text-surface-500 border border-surface-500',
            {
                'border-0 !text-surface-100 bg-primary-500 dark:bg-primary-400': props.severity == null || props.severity == 'primary',
                'border-0 !text-surface-100 bg-green-500 dark:bg-green-400': props.severity == 'success',
                'border-0 !text-surface-100 bg-blue-500 dark:bg-blue-400': props.severity == 'info',
                'border-0 !text-surface-100 bg-orange-500 dark:bg-orange-400': props.severity == 'warning',
                'border-0 !text-surface-100 bg-primary-500 dark:bg-red-400': props.severity == 'danger'
            }
        ]
    }),
    value: {
        class: 'leading-normal'
    },
    icon: {
        class: 'mr-1 text-sm'
    }
};
