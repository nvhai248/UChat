$('#saveAvt').click(function (e) {
    e.preventDefault();
    $('#form_change_avt').submit();
});


const preview = document.getElementById('preview');
const imageInput = document.getElementById('image');
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            preview.src = reader.result;
        }
    }
});