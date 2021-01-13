function signup() {
    axios({
        method: 'post',
        url: 'http://localhost:5000/signup',
        data: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            gender: document.getElementById('gender').value,
        }
    }).then((response) => {
        console.log(response);
        alert(response.data.message)
    }, (error) => {
        console.log(error);
    });
    return false
}
function login() {
    axios({
        method: 'post',
        url: 'http://localhost:5000/login',
        data: {
            email: document.getElementById('lemail').value,
            password: document.getElementById('lpassword').value,
        }, withCredentials: true
    }).then((response) => {
        console.log(response);
        alert(response.data.message)
        location.href = "./profile.html"
    }, (error) => {
        console.log(error);
    });
    return false
}

function getProfile() {
axios({
    method: 'get',
    url: 'http://localhost:5000/profile',
    credentials: 'include',
}).then((response) => {
    console.log(response);
    document.getElementById('pName').innerHTML = response.data.profile.name
    document.getElementById('pEmail').innerHTML = response.data.profile.email
    document.getElementById('pPhone').innerHTML = response.data.profile.phone
    document.getElementById('pGender').innerHTML = response.data.profile.gender
}, (error) => {
    console.log(error.message);
    location.href = "./login.html"
});
return false
}
function logout(){
    axios({
        method: 'post',
        url: 'http://localhost:5000/logout',
    }).then((response) => {
        console.log(response);
        location.href = "./login.html"
    }, (error) => {
        console.log(error);
    });
    return false
}
