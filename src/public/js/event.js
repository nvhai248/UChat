function eventPOST(dataSending, url) {

    $.ajax({
        type: "POST",
        url: `${url}`,
        data: dataSending,
        dataType: "JSON",
        success: function (response) {
            console.log("update thành công!");
        }
    });
}
