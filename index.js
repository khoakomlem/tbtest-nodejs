function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
        }
    });
}

function parse(str) {
    let args = [].slice.call(arguments, 1),
        i = 0;

    for (let j in args)
        args[j] = mysql_real_escape_string(String(args[j]));

    return str.replace(/%s/g, () => args[i++]);
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const express = require('express');
const app = require('express')();
app.set('view engine', 'ejs');

const fs = require('fs');
const session = require('express-session')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');
const port = process.env.PORT || 9999;
// let ip = "http//:113.188.156.167" + port + '/';
// let domain = "https://tranbientest.herokuapp.com/";
let domain = "http://localhost:" + port + "/";

const md5 = require('md5');
const os = require("os");

const mysql = require('mysql');
const connection = mysql.createConnection(
    JSON.parse(fs.readFileSync(__dirname + "/config.json"))[0]
);


http.listen(port, () => console.log('Started on port: *' + port));

connection.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected to the databse!');
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pass.hastudents@gmail.com',
        pass: '@@hatest'
    }
});

function SendMail(email, username, link) {
    let mailOptions = {
        from: 'visualpascalc@gmail.com',
        to: email,
        subject: 'Xac minh Gmail - TB TEST',
        text: 'Bấm vào đây để xác nhận: ' + link
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('express').static(__dirname + '/views'));

//trang chủ
app.get('/', (req, res) => {
    res.render('trangchu');
})
//login
app.use('/login', (req, res, next) => {
    if (req.session.username) {
        res.redirect('../home');
        return;
    }
    next();
})
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', (req, res) => {
    req.body.password = md5(req.body.password);
    connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' AND `password`='%s' LIMIT 1", req.body.username, req.body.password), (error, data) => {
        if (error)
            console.log(error);
        if (data.length == 1) { // dang nhap ok
            if (data[0].email_auth) {
                res.render('login', { error: 'Bạn chưa xác thực gmail của bạn!' });
            } else {
                req.session.username = req.body.username;
                req.session.name = data[0].name;
                req.session.type = data[0].type;
                res.redirect('../home');
            }
        } else { // dang nhap fail
            res.render('login', { error: "Sai tài khoản hoặc mật khẩu!" });
        }
    })
})
//register

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    // console.log(req.body);
    let arr = ['name', 'type', 'username', 'password', 'email'],
        ok = true;
    for (let i in arr) {
        if (!req.body[arr[i]])
            ok = false;
    }

    if (!ok) {
        res.render('register', { error: "Vui lòng điền hết chỗ trống!" });
        return;
    }

    connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' OR `email`='%s' LIMIT 1", req.body.username, req.body.email), (error, data) => {
        if (error)
            console.log(error);
        if (data.length == 1) {
            if (data[0].email == req.body.email)
                res.render('register', { error: "Trùng tên email trước đây!" });
            else
                res.render('register', { error: "Trùng tên tài khoản trước đây!" })
            return;
        }
        req.body.password = md5(req.body.password);
        let code = md5(String(Date.now() + 18102004)).toUpperCase();
        connection.query(parse("INSERT INTO `member` (`name`, `username`, `password`, `email`, `type`, `email_auth`) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')", req.body.name, req.body.username, req.body.password, req.body.email, req.body.type, code), (error) => {
            if (error) {
                console.log(error);
            }
            SendMail(req.body.email, req.body.name, domain + "emailauth/?code=" + code);
        });
        req.session.destroy();
        res.clearCookie('num');
        res.clearCookie('taocauhoi');
        res.render('register', { alert: "Vui lòng kiểm tra tin nhắn xác minh Gmail" });
    })
})
//home
app.use('/home', (req, res, next) => {
    if (!req.session.username) {
        if (req.body.what) {
            res.send("loginrequired");
        } else
            res.redirect('../login');
    } else
        next();
})

app.get('/home', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    if (req.session.type == "hocsinh") {
        connection.query(parse("SELECT * FROM `member` WHERE `username`='%s'", req.session.username), (error, data) => {
            if (error)
                console.log(error);
            if (data[0].test) {
                let arr = JSON.parse(data[0].thongtin);
                for (let i in arr)
                    if (arr[i].id == data[0].test && arr[i].done_at < Date.now()) {
                        connection.query(parse("UPDATE `member` SET `test`='' WHERE `username`='%s'", req.session.username), (error) => {
                            if (error)
                                console.log(error);
                            let a = { ask: "Đã hết thời gian làm bài, xem kết quả bài vừa rồi?", idmoilam: data[0].test }
                            res.redirect("../home?redirect=dedalam&data=" + JSON.stringify(a));
                        })
                        return;
                    }
                res.render('hocsinh', { redirect: 'lambai', data: JSON.stringify({ id: data[0].test }) });
                return;
            }
            if (req.query.data && req.query.redirect)
                res.render('hocsinh', { redirect: req.query.redirect, data: req.query.data });
            else
                res.render('hocsinh', { redirect: 'dedalam' });
        })
    }
    if (req.session.type == "giaovien") {
        if (req.query.data && req.query.redirect)
            res.render('giaovien', { redirect: req.query.redirect, data: req.query.data });
        else
            res.render('giaovien', { redirect: 'quanlichung' });
    }

})

//-----------------------------HỌC SINH---------------------------------
//html
app.post('/home/hocsinh/html', (req, res) => {
    res.sendFile(__dirname + '/views/partials/hocsinh/' + req.body.what + '.ejs');
    return;
})

//get data
app.post('/home/hocsinh/data', (req, res) => {
    switch (req.body.what) {

        case "dedalam":
            {
                // let data = JSON.parse(req.body.data);
                connection.query(parse("SELECT `thongtin` FROM `member` WHERE `username`='%s'", req.session.username), (error, data1) => {
                    if (error)
                        console.log(error);
                    connection.query(parse("SELECT * FROM `test`"), (error, data2) => {
                        if (error)
                            console.log(error);
                        let test = [];
                        for (let i in data2) {
                            test[data2[i].id] = { ...data2[i] };
                        }

                        let arr = []; //mảng các đề đã làm
                        if (data1[0].thongtin) {
                            arr = JSON.parse(data1[0].thongtin);
                        }

                        if (!!req.body.data) {
                            res.send({ 'arr': arr, 'test': { ...test }, 'data': req.body.data });
                        } else
                            res.send({ 'arr': arr, 'test': { ...test } });
                    })
                })
            }
            break;

        case "quanlitaikhoan":
            {
                connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' LIMIT 1", req.session.username), (error, data) => {
                    if (error)
                        console.log(error);
                    data[0].password = data[0].password.length;
                    res.send({ ...data[0] });
                })
            }
            break;

        case "lamde":
            {
                connection.query(parse("SELECT `test` FROM `member` WHERE `username`='%s' LIMIT 1", req.session.username), (error, data) => {
                    if (error)
                        console.log(error);
                    if (data[0].test) {
                        res.send({ reject: "Đang làm đề kia", iddanglam: data[0].test });
                    } else {
                        res.send({});
                    }
                })
            }
            break;

        case "ketqua":
            {
                connection.query(parse("SELECT `thongtin` FROM `member` WHERE `username`='%s' LIMIT 1", req.session.username), (error, data1) => {
                    if (error)
                        console.log(error);
                    connection.query(parse("SELECT * FROM `test` WHERE `id`='%s' LIMIT 1", req.body.id), (error, data2) => {
                        if (error)
                            console.log(error);
                        connection.query(parse("SELECT * FROM `tron` WHERE `username`='%s' ORDER BY `num` DESC LIMIT 1", req.session.username), (error, question) => {
                            if (error)
                                console.log(error);
                            let arr = [];
                            if (data1[0].thongtin)
                                arr = JSON.parse(data1[0].thongtin);
                            for (let i in arr)
                                if (arr[i].id == req.body.id) { // nếu trùng id bài kiểm tra thì send
                                    res.send({ data: arr[i], test: { ...data2 }, question: JSON.parse(question[0].data) });
                                    break;
                                }
                        })
                    })
                })
            }
            break;

        case "lambai":
            {
                let body = JSON.parse(unescape(req.body.data));
                connection.query(parse("SELECT `test` FROM `member` WHERE `username`='%s'", req.session.username), (error, data1) => {
                    if (error)
                        console.log(error);
                    if (data1[0].test)
                        connection.query(parse("SELECT `thongtin` FROM `member` WHERE `username`='%s'", req.session.username), (error, data2) => {
                            if (error)
                                console.log(error);
                            let arr = [];
                            if (data2[0].thongtin)
                                arr = JSON.parse(data2[0].thongtin);
                            for (let i in arr)
                                if (arr[i].id == body.id) { // dò object trong arr[i], id là id của để kiểm tra
                                    connection.query(parse("SELECT * FROM `test`"), (error, data2) => {
                                        if (error)
                                            console.log(error);
                                        let test = [];
                                        for (let j in data2) {
                                            test[data2[j].id] = { ...data2[j] };
                                        }
                                        connection.query(parse("SELECT `data` FROM `tron` WHERE `username`='%s' ORDER BY `num` DESC LIMIT 1", req.session.username), (error, response) => {
                                            if (error)
                                                console.log(error);
                                            res.send({ time_left: arr[i].done_at - Date.now(), test: test[body.id], data: JSON.parse(response[0].data) }) //milisecond
                                        })
                                    })

                                }
                        })
                    else
                        res.send('???lambai???');
                })
            }
            break;

            // case "lamde" : {
            // res.send({baidanglam:JSON.parse(req.body.data).id});
            // }
    }

})

app.post('/home/hocsinh/timde', (req, res) => {
    req.body.id = req.body.id.toUpperCase();
    connection.query(parse("SELECT `id` FROM `test` WHERE `id` = '%s' LIMIT 1", req.body.id), (error, checkid) => {
        if (error)
            console.log(error);
        if (checkid.length == 1) {
            connection.query(parse("SELECT * FROM `member` WHERE username = '%s'", req.session.username), (error, data) => {
                if (error)
                    console.log(error);
                if (data[0].test) {
                    res.send({ reject: "Đang làm đề kia", id: data[0].test });
                    return;
                }
                let arr = [];
                if (data[0].thongtin)
                    arr = JSON.parse(data[0].thongtin);

                for (let i in arr)
                    if (arr[i].id == req.body.id && arr[i].done_at < Date.now()) {
                        res.send('dalamde');
                        return;
                    }
                res.send('timthay');
            })
        } else {
            res.send('kotimthay');
        }
    });
    return;
})


app.post('/home/hocsinh/xacnhanlambai', (req, res, next) => {
    connection.query(parse("SELECT * FROM `test` WHERE id='%s' LIMIT 1", req.body.id), (error, test) => {
        if (error)
            console.log(error);
        if (test.length == 1) {
            connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' LIMIT 1", req.session.username), (error, data) => {
                if (error)
                    console.log(error);
                if (data[0].test) {
                    res.send({ reject: "Đang làm đề kia", id: data[0].test });
                    return;
                }

                let arr = [];
                if (data[0].thongtin)
                    arr = JSON.parse(data[0].thongtin);

                let ok = false; // tim thấy id request trong thong tin
                for (let i in arr)
                    if (arr[i].id == req.body.id) {
                        ok = i;
                    }

                if (ok != false) { //tìm thấy 
                    if (arr[ok].done_at < Date.now()) {
                        res.send('dalamde');
                        return;
                    }
                }

                arr.push({
                    id: req.body.id,
                    correct: 0,
                    socau: test[0].max,
                    do_at: Date.now(),
                    done_at: Date.now() + test[0].time * 60 * 1000,
                    bailam: {}
                });

                let tron = shuffle(JSON.parse(test[0].data));
                // console.log(tron);
                tron.splice(0, tron.length - test[0].max);
                // console.log(tron);
                connection.query(parse("INSERT INTO `tron` (`username`, `data`) VALUES ('%s', '%s')", req.session.username, JSON.stringify(tron)), (error) => {
                    if (error)
                        console.log(error);
                    connection.query(parse("UPDATE `member` SET `test`='%s', `thongtin`='%s' WHERE `username`='%s'", req.body.id, JSON.stringify(arr), req.session.username), (error) => {
                        if (error)
                            console.log(error);
                        res.send('ok');
                    });
                });



            });
        } else {
            res.send('kotimthay');
        }
    })
})

app.post('/home/hocsinh/quanlitaikhoan/', (req, res) => { // đổi mật khẩu tài khoản các thứ
    switch (req.body.what) { // req = {what: ..., data: ...}
        case "name":
            {
                connection.query(parse("UPDATE `member` SET `name`='%s' WHERE `username`='%s'", req.body.data, req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi tên đại diện thành ' + req.body.data, data: req.body.data });
                });
            }
            break;
        case "email":
            {
                connection.query(parse("UPDATE `member` SET `email`='%s' WHERE `username`='%s'", req.body.data, req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi email thành ' + req.body.data, data: req.body.data });
                });
            }
            break;
        case "password":
            {
                connection.query(parse("UPDATE `member` SET `password`='%s' WHERE `username`='%s'", md5(req.body.data), req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi thành công mật khẩu mới!', data: req.body.data.length });
                });
            }

    }
})

app.use('/home/lambai/', (req, res, next) => {
    connection.query(parse("SELECT `test` FROM `member` WHERE `username`='%s'", req.session.username), (error, data) => {
        if (error)
            console.log(error);
        if (data[0].test == '')
            res.send("Bạn chưa đăng kí làm đề nào!");
        next();
    })
})

app.post('/home/lambai/', (req, res) => { //nộp bài

    let ans = {};
    for (let i in req.body) {
        if (/answer\d+\b/.test(i) && /\b[A-Da-d]\b/.test(req.body[i])) {
            let index = Number(/\d+\b/.exec(i)[0]);
            ans[index] = req.body[i].toUpperCase();
        }
    }

    connection.query(parse("SELECT * FROM `member` WHERE `username`='%s'", req.session.username), (error, data) => {
        if (error)
            console.log(error);
        connection.query(parse("SELECT * FROM `tron` WHERE `username`='%s' ORDER BY `num` DESC LIMIT 1", req.session.username), (error, tron) => {
            if (error)
                console.log(error);

            // if (data[0].test == ""){
            //  res.send('hack cc, bố bao ghét họn phá web');
            //  return;
            // }

            let quest = JSON.parse(tron[0].data);
            let correct = 0;
            for (let i in quest)
                if (ans[i] && quest[i].ans == ans[i])
                    correct++;

            let arr = [];
            if (data[0].thongtin)
                arr = JSON.parse(data[0].thongtin);

            for (let i in arr) {
                if (arr[i].id == data[0].test) {
                    arr[i].correct = correct;
                    arr[i].done_at = Date.now();
                    arr[i].bailam = ans;
                    connection.query(parse("UPDATE `member` SET `thongtin`='%s', `test`='' WHERE `username`='%s'", JSON.stringify(arr), req.session.username), (error) => {
                        if (error)
                            console.log(error);
                    });
                    break;
                }
            }

            let a = { ask: "Bạn có muốn xem kết quả của bài vừa làm??", idmoilam: data[0].test }
            res.redirect("../home?redirect=dedalam&data=" + JSON.stringify(a));
        })
    })
})




//-----------------------------GIÁO VIÊN---------------------------------



app.post('/home/giaovien/html', (req, res) => {
    res.sendFile(__dirname + '/views/partials/giaovien/' + req.body.what + '.ejs');
    return;
})

//get data
app.post('/home/giaovien/data', (req, res) => {
    switch (req.body.what) {

        case "quanlichung":
            {
                connection.query(parse("SELECT * FROM `test` WHERE `author`='%s' ORDER BY `i` DESC", req.session.username), (error, test) => {
                    if (error)
                        console.log(error);
                    connection.query("SELECT `thongtin` FROM `member` WHERE `type`='hocsinh'", (error, member) => {
                        if (error)
                            console.log(error);
                        let danhdau = {};

                        for (let i in member) {
                            let thongtin = [];
                            if (member[i].thongtin)
                                thongtin = JSON.parse(member[i].thongtin);
                            for (let i1 in thongtin) {
                                if (!danhdau[thongtin[i1].id])
                                    danhdau[thongtin[i1].id] = 0;
                                if (thongtin[i1].done_at < Date.now())
                                    danhdau[thongtin[i1].id]++;
                            }
                        }
                        console.log(danhdau);
                        let count = {};
                        for (let i in test) {
                            test[i].data = "";
                            count[test[i].id] = danhdau[test[i].id];
                        }
                        res.send({ 'test': { ...test }, 'count': count });
                    });
                })
            }
            break;

        case "thongtin":
            { //req.body.id la id can detail
                connection.query(parse("SELECT * FROM `test` WHERE `id`='%s'", req.body.id), (error, test) => {
                    if (error)
                        console.log(error);
                    connection.query("SELECT * FROM `member` WHERE `type`='hocsinh'", (error, member) => {
                        if (error)
                            console.log(error);
                        let data = [];
                        let count = 0;
                        for (let i in member) {
                            let thongtin = [];
                            if (member[i].thongtin)
                                thongtin = JSON.parse(member[i].thongtin);

                            for (let j in thongtin)
                                if (thongtin[j].id == req.body.id && thongtin[j].done_at < Date.now()) {
                                    count++;
                                    data.push({
                                        'name': member[i].name,
                                        'username': member[i].username,
                                        'timedone': thongtin[j].done_at - thongtin[j].do_at,
                                        'correct': thongtin[j].correct,
                                        'socau': thongtin[j].socau
                                    })
                                    break;
                                }
                        }
                        test[0].data = "";
                        test[0].count = count;
                        res.send({ 'data': data, 'test': { ...test[0] } });
                    });
                })
            }
            break;

        case "xembailam":
            {
                let data_parse = JSON.parse(unescape(req.body.data));
                connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' LIMIT 1", data_parse.username), (error, data1) => {
                    if (error)
                        console.log(error);
                    connection.query(parse("SELECT * FROM `test` WHERE `id`='%s' LIMIT 1", data_parse.id), (error, data2) => {
                        if (error)
                            console.log(error);
                        connection.query(parse("SELECT * FROM `tron` WHERE `username`='%s' ORDER BY `num` DESC LIMIT 1", data_parse.username), (error, question) => {
                            if (error)
                                console.log(error);
                            let arr = [];
                            if (data1[0].thongtin)
                                arr = JSON.parse(data1[0].thongtin);
                            for (let i in arr)
                                if (arr[i].id == data_parse.id) { // nếu trùng id bài kiểm tra thì send
                                    res.send({ data: arr[i], test: { ...data2 }, question: JSON.parse(question[0].data), name: data1[0].name + ' (' + data_parse.username + ')' });
                                    return;
                                }
                        })
                    })
                })
            }
            break;

        case "quanlitaikhoan":
            {
                connection.query(parse("SELECT * FROM `member` WHERE `username`='%s' LIMIT 1", req.session.username), (error, data) => {
                    if (error)
                        console.log(error);
                    data[0].password = data[0].password.length;
                    res.send({ ...data[0] });
                })
            }
            break;

        case "taode":
            {
                res.send({
                    data: {
                        username: req.session.username
                    }
                });

            }
            break;
    }

})

app.post('/home/giaovien/savede', (req, res) => {
    let de = JSON.parse(req.body.str);
    // console.log(de);
    let old = {};

    if (req.cookies.taode)
        old = JSON.parse(req.cookies.taode);

    old[req.session.username] = [...de];

    // console.log(old);
    res.cookie('taode', JSON.stringify(old));
    res.send('ok');
})

app.post('/home/giaovien/quanlitaikhoan/', (req, res) => { // đổi mật khẩu tài khoản các thứ
    switch (req.body.what) { // req = {what: ..., data: ...}
        case "name":
            {
                connection.query(parse("UPDATE `member` SET `name`='%s' WHERE `username`='%s'", req.body.data, req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi tên đại diện thành ' + req.body.data, data: req.body.data });
                });
            }
            break;
        case "email":
            {
                connection.query(parse("UPDATE `member` SET `email`='%s' WHERE `username`='%s'", req.body.data, req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi email thành ' + req.body.data, data: req.body.data });
                });
            }
            break;
        case "password":
            {
                connection.query(parse("UPDATE `member` SET `password`='%s' WHERE `username`='%s'", md5(req.body.data), req.session.username), error => {
                    if (error)
                        console.log(error);
                    res.send({ mess: 'Đã thay đổi thành công mật khẩu mới!', data: req.body.data.length });
                });
            }

    }
})

app.post('/home/giaovien/taode', (req, res) => {
    console.log('taode')
    let request = JSON.parse(req.body.str);
    console.log(request);
    let name = request[0].value;
    let time = request[1].value;
    let max = request[2].value;
    if (max > (request.length - 3) / 6) {
        res.send({ error: "Bạn đã nhập \"tối đa câu hỏi\" cao hơn số câu hỏi hiện có!" });
        return;
    }
    let arr = {};
    let data = [];
    let code = md5(String(Date.now() + 18102004)).substr(2, 6).toUpperCase();
    console.log(code);
    // code = req.body.code;

    connection.query(parse("SELECT `id` FROM `test` WHERE `id`='%s'", code), (error, data) => {
        if (error)
            console.log(error);
        if (data.length >= 1) {
            res.send({ error: "Vừa rồi hệ thống vừa tạo 1 mã id đề trùng với id đề trước, vui lòng bấm lại 'tạo đề' để tạo lại, xin lỗi vì sự bất tiện này 😢" })
            return;
        }

        for (let i in request) {
            if (request[i].value == "" && request[i].name == 'ans') {
                res.send({ error: "Hình như bạn vừa quên điền phần \"đáp án đúng\" ở câu nào đó!" });
                return;
            }
        }

        for (let i = 3; i <= request.length - 1; i++) {
            arr[request[i].name] = request[i].value;
            if ((i - 2) % 6 == 0) {
                data.push(arr);
                arr = {};
            }
        }

        connection.query(parse("INSERT INTO `test` (`name`, `time`, `id`, `data`, `max`, `author`) VALUES ('%s','%s','%s','%s', '%s', '%s')", name, time, code, JSON.stringify(data), max, req.session.username), (error) => {
            if (error)
                console.log(error)
        });
        res.cookie('taode', '');
        res.send({ mess: 'ok', code: code });
    })

})


app.get('/emailauth', (req, res) => {
    connection.query(parse("SELECT `email_auth` FROM `member` WHERE `email_auth`='%s' LIMIT 1", req.query.code), (error, data) => {
        if (error)
            console.log(error);
        if (data.length == 1) {
            connection.query(parse("UPDATE `member` SET `email_auth`='' WHERE `email_auth`='%s'", req.query.code), error => {
                if (error)
                    console.log(error);
            });
            res.render(__dirname + '/views/trangchu/email_auth.ejs', { status: "ok" });
        } else {
            res.render(__dirname + '/views/trangchu/email_auth.ejs', { status: "reject" });
        }
    })
})

app.post('/emailauth', (req, res) => {
    let code = md5(String(Date.now() + 18102004)).toUpperCase();
    SendMail(req.body.email, '', domain + "emailauth?code=" + code);
    connection.query(parse("UPDATE `member` SET `email_auth`='%s' WHERE `email`='%s'", code, req.body.email), (error) => {
        if (error)
            console.log(error);
        res.send('ok');
    });
})

app.post('/home/logout', (req, res) => {
    req.session.destroy();
    res.redirect(domain);
})