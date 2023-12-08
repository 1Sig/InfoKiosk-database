// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const fileForm = document.getElementById('fileForm');
    const fileList = document.getElementById('fileList');

    fileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileName = document.getElementById('fileName').value;
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                appendFileToList(data);
            } else {
                console.error('File upload failed.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Fetch and display existing files on page load
    fetch('/files')
        .then(response => response.json())
        .then(data => {
            data.forEach(file => appendFileToList(file));
        });

    // Helper function to add a file to the list
    function appendFileToList(file) {
        const listItem = document.createElement('li');
        listItem.textContent = file.fileName;
        fileList.appendChild(listItem);
    }
});