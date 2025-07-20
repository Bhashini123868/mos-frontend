const users = {
    'admin': 'admin123',
};

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] === password) {
        if (username === 'admin') {
            window.location.href = './home.html';
        } else {
            window.location.href = './cashier_interface.html';
        }
    } else {
        alert('Invalid credentials');
    }
}

function btnHomeOnAction(){
    window.location.assign('./index.html');

  
}