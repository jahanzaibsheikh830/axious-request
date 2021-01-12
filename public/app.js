// var url = "https://mongodb-signup.herokuapp.com"
var url = "http://localhost:3000"
function signup() {
    axios({
        method: 'post',
        url: 'http://localhost:3000/signup',
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
        url: 'http://localhost:3000/login',
        data: {
            lemail: document.getElementById('lemail').value,
            lpassword: document.getElementById('lpassword').value,
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
    url: 'http://localhost:3000/profile',
    withCredentials: true
}).then((response) => {
    console.log(response);
    alert(response.data.message)
    // location.href = "./profile.html"
}, (error) => {
    console.log(error.message);
});
return false
}
// function logout(){
//     localStorage.removeItem('userToken')
//     href.location = "./login.html"
// }
