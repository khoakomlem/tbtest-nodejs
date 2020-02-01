<?php
    require 'connect.php';
    session_start();
    $success;
    $error;
    $ok = false;
    $username='None?!?!?';

    if (isset($_GET['code'])){
    	$code = mysqli_real_escape_string($db, $_GET['code']);
    	$txt = "SELECT * FROM `member` WHERE `recovery_auth` = '%s' LIMIT 1";
    	$sql = sprintf($txt, $code);
    	$result = mysqli_query($db, $sql);

    	if (mysqli_num_rows($result) == 1) {
    		$ok=true;
    		$username = mysqli_fetch_assoc($result)['username'];

    		if (isset($_POST['changepass'])){
    			$code = mysqli_real_escape_string($db, $_GET['code']);
    			$pass = md5(mysqli_real_escape_string($db, $_POST['password']));
    			$txt = "UPDATE `member` SET `recovery_auth`='', `password`='%s' WHERE `recovery_auth`='%s'";
    			$sql = sprintf($txt, $pass, $code);
    			mysqli_query($db, $sql);
    			$success = "Đã đổi mật khẩu!";
    		}
    	} else {
    		$error = 'Sai mã code?!?';
    	}
    }

    

    if (isset($_POST['xacnhan']) && isset($_POST['username'])){
    	require 'mailer/SendMail.php';
    	$username = mysqli_real_escape_string($db, $_POST['username']);
    	$result = mysqli_query($db, "SELECT * FROM `member` WHERE `username`='".$username."' LIMIT 1");
    	if (mysqli_num_rows($result) == 1){
    		$t = mysqli_fetch_assoc($result);
    		$email = $t['email'];
    		$name = $t['name'];
    		$code = strtoupper(md5(uniqid(rand())));
    		mysqli_query($db, "UPDATE `member` SET `recovery_auth`='".$code."' WHERE `username` = '".$username."' LIMIT 1");
    		$success = "Chúng tôi đã gửi thư xác nhận khôi phục tài khoản đến email: ".$email."!";

    		$file = implode("<br>", explode("\n", file_get_contents('mailer/recovery_auth.txt')));
    		$body = sprintf($file, $username, 'http://tbtest.byethost12.com/recovery.php?code='.$code, $email);
    		sendMail($email, $body);	
    	} else {
    		$error = "Không thể tìm thấy tài khoản ".$username."!";
    	}
    	
    }
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Recovery - TB TEST</title>
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,700">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.1.1/aos.css">
    <link rel="stylesheet" href="https://unpkg.com/@bootstrapstudio/bootstrap-better-nav/dist/bootstrap-better-nav.min.css">
    <link rel="stylesheet" href="assets/css/untitled.css">
<style>
#style-7::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
    border-radius: 10px;
}

#style-7::-webkit-scrollbar
{
    width: 7px;
height:80%;
    background-color: #F5F5F5;

}

#style-7::-webkit-scrollbar-thumb
{
    border-radius: 10px;
    background-image: -webkit-gradient(linear,
                                       left bottom,
                                       left top,
                                       color-stop(0.44, rgb(122,153,217)),
                                       color-stop(0.72, rgb(73,125,189)),
                                       color-stop(0.86, rgb(28,58,148)));
}
</style>
</head>

<body>
    <nav class="navbar navbar-light navbar-expand-lg fixed-top bg-secondary text-uppercase" id="mainNav" style="background-color: rgba(254,254,254,0)!important;">
        <div class="container"><a href="index.php"><img id="logo" src="assets/img/logo.png"></a><button data-toggle="collapse" data-target="#navbarResponsive" class="navbar-toggler navbar-toggler-right text-uppercase bg-primary text-white rounded" aria-controls="navbarResponsive" aria-expanded="false"
                aria-label="Toggle navigation" style="background-color: rgba(255,255,255,0)!important;border-width: 0px;"><i class="fas fa-bars" style="color: rgb(0,0,0);font-size: 20px;"></i></button>
            <div class="collapse navbar-collapse" id="navbarResponsive">
                <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item mx-0 mx-lg-1" role="presentation"><a href="index.php" class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" data-aos="fade-up" data-aos-duration="500" href="#" style="color: rgb(41,86,247);">HA STUDENTS</a></li>
                    <li class="nav-item mx-0 mx-lg-1" role="presentation"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" data-aos="fade-up" data-aos-duration="500" href="#" style="color: rgb(41,86,247);">QUẢN TRỊ ĐĂNG NHẬP</a></li>
                    <li class="nav-item mx-0 mx-lg-1" role="presentation"><a class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger" data-aos="fade-up" data-aos-duration="500" href="#" style="color: rgb(41,86,247);">BÁO LỖI</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <header class="masthead bg-primary text-white text-center" style="background-position: top;background-size: cover;background-repeat: no-repeat;height: 100vh;">
        <div class="container">
            <p class="invisible" id="ha-test" style="color: rgb(245,14,83);font-size: 55px;font-family: Montserrat, sans-serif;margin: 0;">HA TEST</p>
            <div>
                <div class="row gr-1">
                    <div class="col col-12" data-aos="fade-up">
                        <div class="card">
                            <div class="card-body text-danger" style="font-family: Montserrat, sans-serif;">
                            	<?php 
                            	if (!$ok){
                            		echo '<form method="POST"><h6 style="color: #259932">Quên mật khẩu</h6><br><input required id="username" name="username" maxlength="100" type="text" class="mb-3" style="background-color: rgb(233,231,231);border: none;border-radius: 50px;padding: 1rem;width: 100%;/*float: left;*/" placeholder="Nhập username của bạn"><input class="btn btn-secondary font-weight-bold" name="xacnhan" type="submit" style="width: 100%;border-radius: 50px;height: 3rem;font-family: Quicksand, sans-serif;background: #259932;border: none;" value="OK"></form>';
                            	} else {
                            		echo '<form method="POST"><h6 style="color: #259932">Đổi mật khẩu</h6><br><input disabled type="text" class="mb-3" style="background-color: rgb(233,231,231);border: none;border-radius: 50px;padding: 1rem;width: 100%;/*float: left;*/" value="Tài khoản: '.$username.'"><input required id="password" name="password" maxlength="100" type="password" class="mb-3" style="background-color: rgb(233,231,231);border: none;border-radius: 50px;padding: 1rem;width: 100%;/*float: left;*/" placeholder="Nhập mật khẩu mới của bạn"><input class="btn btn-secondary font-weight-bold" name="changepass" type="submit" style="width: 100%;border-radius: 50px;height: 3rem;font-family: Quicksand, sans-serif;background: #259932;border: none;" value="OK"></form>';
                            	}
                            	?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/bs-animation.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.1.1/aos.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>
    <script src="assets/js/freelancer.js"></script>
    <script src="https://unpkg.com/@bootstrapstudio/bootstrap-better-nav/dist/bootstrap-better-nav.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@8"></script>
    <?php
    if (isset($error)){
        echo "<script>Swal.fire({type: 'error',title: 'Lỗi!',text: '".$error."'})</script>";
    }
    if (isset($success)){
        echo "<script>Swal.fire({type: 'success',title: 'Thành công!',text: '".$success."'}).then(result=>{location.assign('index.php')})</script>";
    }
    ?>
</body>

</html>