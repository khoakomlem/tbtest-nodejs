var func = (res, data, id) => {
    $('#style-7').fadeOut(500, () => {
        if (id == "taode")
            $('#style-7').css('opacity', '1');
        else
            $('#style-7').css('opacity', '0.85');

        $('#loading').fadeOut(100);
        let html = ejs.compile(res)(data);
        $('#style-7').html(html);
        $('#style-7').fadeIn(500);
    })
}

var doimau = (id) => {

    $('#loading').fadeIn(100);
    $('#' + lastid).css('background-color', 'white');
    $('#' + lastid).css('border-color', 'white');
    $('#' + id).css('background-color', '#a9d1af');
    $('#' + id).css('border-color', '#a9d1af');
    lastid = id;
}

sAlert = (id) => Swal.fire({ // id là id của đề
    icon: 'success',
    title: 'Great',
    text: 'Đã tìm thấy đề! (bấm ra ngoài để hủy)',
    confirmButtonText: 'Làm bài!'
}).then(result => {
    if (result.value) {
        $.ajax({
            method: 'POST',
            url: 'home/hocsinh/xacnhanlambai',
            data: { id: id }
        }).done((res) => {
            if (res == 'ok')
                reAjax({ what: 'lambai' }, { what: 'lambai', id: id });
        })
    }
})

eAlert = (text) => Swal.fire({
    icon: 'error',
    title: 'Oops . . .',
    text: text,
    confirmButtonText: 'OK'
});

reAjax = (obj1, obj2) => $.ajax({
    method: 'POST',
    url: '/home/giaovien/html',
    data: obj1, // id của html
    beforeSend: () => doimau(obj1.what),
    error: () => setTimeout(() => reAjax(obj1, obj2), 5000)
}).done((res) => {
    if (res == 'loginrequired')
        location.assign('../login');
    $.ajax({
        url: '/home/giaovien/data/',
        method: 'POST',
        data: obj2 //id của html
    }).done(data => {
        func(res, data, obj1.what);
    })
});

reFind = (id) => $.ajax({
    method: 'POST',
    url: '/home/giaovien/timde',
    data: { id: id },
    error: () => setTimeout(() => reFind(id), 4000)
}).done((res) => {
    if (res == 'timthay') sAlert(id);
    if (res == 'kotimthay') eAlert("Không tim thấy đề nào có mã " + id);
    if (res == 'dalamde') eAlert("Bạn đã làm đề " + id);
});