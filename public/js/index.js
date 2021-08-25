async function changePassword() {
    document.getElementById('changePassword').addEventListener('click', event => event.preventDefault())
    const response = await fetch('/api/changepassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`

        }
    })
    response.json();
    localStorage.setItem('accessToken', `${response.accessToken}`)
}

async function signup() {
    document.getElementById('signup').addEventListener('click', event => event.preventDefault())
}

async function login() {
    document.getElementById('login').addEventListener('click', event => event.preventDefault())
    const accessToken = localStorage.getItem('accessToken')

    const loginData = new formData(document.getElementById('UserName').value, document.getElementById('Password').value)

    const response = await fetch(`/api/login`, {
        body: JSON.stringify({ userName: loginData.userName, password: loginData.Password }),
        method: 'POST',
        headers: {

            'Content-Type': 'application/json'
        }
    })
    response.json().then((data) => {
        console.log(data)
        localStorage.setItem('accessToken', `${data.accessToken}`)
    }).catch(err => { console.log(err) })
}

function formData(userName, Password) {

    this.userName = userName;
    this.Password = Password;
}
