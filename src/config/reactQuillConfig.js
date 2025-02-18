export const formats = [
    'font',
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'color',
    'background',
    'align',
];

export const modules = {
    toolbar: [
        [{ 'font': [] }],
        [{ 'header': [1, 2, false] }],
        [{ 'align': [] }], 
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }],
        [{ 'background': [] }],
        ['clean'],
    ]
};
