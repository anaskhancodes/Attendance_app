function userName() {
    // Get the value from the input field
    const newName = document.getElementById('firstName').value;

    // Update the content of the element in index.html
    const userNameElement = window.opener.document.getElementById('userName');
    
    if (userNameElement) {
        userNameElement.textContent = `${newName}`;
    } else {
        console.error('Element with id "userName" not found in index.html');
    }
}



