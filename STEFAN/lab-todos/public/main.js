fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json())
    .then(json => giveTable(json))


function giveTable(arr) {
    tableId.innerHTML = `
            <thead>
                <tr>
                    <th>id</th>
                    <th>userId</th>
                    <th>title</th>
                    <th>completed</th>
                </tr>
            </thead>
            <tbody id="tbodyId"></tbody>
            <tfoot>
                <tr>
                    <th>id</th>
                    <th>userId</th>
                    <th>title</th>
                    <th>completed</th>
                </tr>
            </tfoot> `;
    for (const item of arr) {
        let newRow = tbodyId.insertRow();
        newRow.insertCell().innerHTML= item.id;
        newRow.insertCell().innerHTML= item.userId;
        newRow.insertCell().innerHTML= item.title;
        newRow.insertCell().innerHTML= item.completed;
    }    
}