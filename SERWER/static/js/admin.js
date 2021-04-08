const html = document.querySelector('html');
const header = html.querySelector('h1');
const upload = document.querySelector('.upload-panel');
const list = document.querySelector('.list');

function uploadFiles(files) {
    const formData = new FormData();
    files.forEach(file => formData.append("file", file));

    return fetch('/upload', {
        method: 'POST',
        body: formData
    })
}

html.addEventListener('dragover', e => {
    header.innerHTML = 'Drop files here';
});

html.addEventListener('dragleave', () => {
    header.innerHTML = 'Drag files here';
});

upload.addEventListener('dragleave', e => {
    e.stopPropagation();
});

upload.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    header.innerHTML = 'Drop';
});

upload.addEventListener('drop', async e => {
    e.preventDefault();
    header.innerHTML = 'Upload';
    const res = await uploadFiles([...e.dataTransfer.files]);
    const files = await res.json();

    list.innerHTML = "";
    const frag = document.createDocumentFragment();
    files.forEach(file => {
        const div = document.createElement('div');
        div.innerHTML = file.name;
        div.classList.add('list-item');
        frag.appendChild(div);
    });
    list.appendChild(frag);
});

