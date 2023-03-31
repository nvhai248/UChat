// Lấy giá trị của biến divState từ Local Storage
var divState = localStorage.getItem('divState');

if (divState === "login-form") {
    $('#login-form').removeClass("displayNone");
    $('#register-form').addClass("displayNone");
}
else {
    $('#login-form').addClass("displayNone");
    $('#register-form').removeClass("displayNone");
}

// Hàm chuyển đổi giữa div A và div B
function switchDiv() {
    document.getElementById('login-form').classList.toggle('displayNone');
    document.getElementById('register-form').classList.toggle('displayNone');

    // Cập nhật giá trị của biến divState
    if (document.getElementById('login-form').classList.contains('displayNone')) {
        divState = 'register-form';
    } else {
        divState = 'login-form';
    }

    // Lưu giá trị của biến divState vào Local Storage
    localStorage.setItem('divState', divState);
}

$('#registerBtn').click(async function (e) {
    e.preventDefault();
    name = $('#nameReg').val();
    email = $('#emailReg').val();
    password = $('#passwordReg').val();

    if (name == "") {
        return $('#messageRegister').html('Please enter your full name!');
    }
    else if (email == "") {
        return $('#messageRegister').html('Please enter your full name!');
    }
    else if (password == "") {
        return $('#messageRegister').html('Please enter your password!');
    }


    $('#RForm').submit();
});