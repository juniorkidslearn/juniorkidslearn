// notices.js

document.addEventListener('DOMContentLoaded', function() {
    const noticeForm = document.getElementById('notice-form');
    const noticeIdInput = document.getElementById('notice-id');
    const noticeTitleInput = document.getElementById('notice-title');
    const noticeContentInput = document.getElementById('notice-content');
    const noticesList = document.getElementById('notices-list');
    const cancelEditButton = document.getElementById('cancel-edit');

    // Load notices from localStorage or use initial data if none exist
    let notices = JSON.parse(localStorage.getItem('notices'));
    if (!notices) { // If localStorage is empty or invalid JSON
        notices = [
            { id: 1, title: 'Admissions Open for 2025-26', content: 'Enroll your child now for the upcoming academic year. Limited seats available.' },
            { id: 2, title: 'Annual Sports Day - Nov 15th', content: 'Join us for a day of fun, games, and healthy competition!' },
            { id: 3, title: 'Annual Sports Day - Aug 16th', content: 'Joigfdhdfhompetition!' },
            { id: 4, title: 'Important Update', content: 'This is notification 2 content.' },
            { id: 5, title: 'hjbkj', content: '' },
            { id: 6, title: 'fgsgs', content: '' },
            { id: 7, title: 'sfhdhdfg', content: '' },
            { id: 8, title: 'song', content: '' }
        ];
        saveNotices(); // Save the default notices to localStorage on first load
    }
    let nextId = notices.length > 0 ? Math.max(...notices.map(n => n.id)) + 1 : 1;

    // Save notices to localStorage
    function saveNotices() {
        localStorage.setItem('notices', JSON.stringify(notices));
    }

    function renderNotices() {
        if (noticesList) {
            noticesList.innerHTML = '';
            notices.forEach(notice => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${notice.title}</h3>
                    <p>${notice.content}</p>
                    <button class="edit-button" data-id="${notice.id}">Edit</button>
                    <button class="delete-button" data-id="${notice.id}">Delete</button>
                `;
                noticesList.appendChild(listItem);
            });
        }
    }

    function addNotice(title, content) {
        const newNotice = { id: nextId++, title, content, submittedAt: new Date().toISOString() };
        notices.push(newNotice);
        saveNotices(); // Save after adding
        renderNotices();
    }

    function editNotice(id, title, content) {
        const index = notices.findIndex(notice => notice.id === id);
        if (index !== -1) {
            notices[index] = { id, title, content, submittedAt: new Date().toISOString() };
            saveNotices(); // Save after editing
            renderNotices();
        }
    }

    function deleteNotice(id) {
        notices = notices.filter(notice => notice.id !== id);
        saveNotices(); // Save after deleting
        renderNotices();
    }

    noticeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = parseInt(noticeIdInput.value);
        const title = noticeTitleInput.value;
        const content = noticeContentInput.value;

        if (id) {
            editNotice(id, title, content);
        } else {
            addNotice(title, content);
        }
        noticeForm.reset();
        noticeIdInput.value = '';
        cancelEditButton.style.display = 'none';
    });

    noticesList.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            const id = parseInt(event.target.dataset.id);
            const noticeToEdit = notices.find(notice => notice.id === id);
            if (noticeToEdit) {
                noticeIdInput.value = noticeToEdit.id;
                noticeTitleInput.value = noticeToEdit.title;
                noticeContentInput.value = noticeToEdit.content;
                cancelEditButton.style.display = 'inline-block';
                document.getElementById('notice-form-section').scrollIntoView({ behavior: 'smooth' });
            }
        } else if (event.target.classList.contains('delete-button')) {
            const id = parseInt(event.target.dataset.id);
            if (confirm('Are you sure you want to delete this notice?')) {
                deleteNotice(id);
            }
        }
    });

    cancelEditButton.addEventListener('click', function() {
        noticeForm.reset();
        noticeIdInput.value = '';
        cancelEditButton.style.display = 'none';
    });

    // Initial render
    renderNotices();

    const downloadButton = document.getElementById('download-notices');
    downloadButton.addEventListener('click', downloadNotices);

    function downloadNotices() {
        let tableRows = '';
        notices.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        notices.forEach(notice => {
            const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
            const contentWithLinks = notice.content.replace(urlRegex, function(url) {
                let href = url;
                if (!href.startsWith('http')) {
                    href = 'http://' + href;
                }
                return '<a href="' + href + '" target="_blank" style="color:blue;">Link</a>';
            });
            const submittedAt = notice.submittedAt ? new Date(notice.submittedAt).toLocaleString() : 'N/A';
            tableRows += `<tr><td>${notice.title.toUpperCase()}</td><td>${contentWithLinks}</td><td>${submittedAt}</td></tr>`;
        });

        let tableHTML = `
            <html>
            <head>
                <link rel=\"stylesheet\" href=\"style1.css\">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    caption {
                        font-size: 1.5em;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    @media screen and (max-width: 600px) {
                        table, thead, tbody, th, td, tr {
                            display: block;
                        }
                        thead tr {
                            position: absolute;
                            top: -9999px;
                            left: -9999px;
                        }
                        tr {
                            border: 1px solid #ccc;
                            margin-bottom: 5px;
                        }
                        td {
                            border: none;
                            border-bottom: 1px solid #eee;
                            position: relative;
                            padding-left: 50%;
                        }
                        td:before {
                            position: absolute;
                            top: 6px;
                            left: 6px;
                            width: 45%;
                            padding-right: 10px;
                            white-space: nowrap;
                        }
                        td:nth-of-type(1):before { content: \"Title\"; }
                        td:nth-of-type(2):before { content: \"Description\"; }
                        td:nth-of-type(3):before { content: \"Submitted At\"; }
                    }
                </style>
            </head>
            <body>
                <header class=\"main-header\">
                    <div class=\"container header-content\">
                        <nav class=\"main-nav\">
                            <ul>
                                <li><a href=\"index.html\">Home</a></li>
                            </ul>
                        </nav>
                        <button class=\"menu-toggle\" aria-label=\"Toggle navigation\">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </header>
                <table>
                    <caption>Notices</caption>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <script>
                    document.querySelector('.menu-toggle').addEventListener('click', function() {
                        window.location.href = 'index.html';
                    });
                </script>
            </body>
            </html>
        `;

        const blob = new Blob([tableHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notices.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});