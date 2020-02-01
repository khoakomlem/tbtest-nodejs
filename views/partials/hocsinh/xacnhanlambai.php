<?php 
require '../../auth/hsLoginAuth.php';
require '../../connect.php';
if (mysqli_fetch_assoc(mysqli_query($db, "SELECT `test` FROM `member` WHERE `username`='".$_SESSION['username']."'"))['test']==""){
	$id = strtoupper(mysqli_real_escape_string($db, $_POST['id']));

	$txt = "UPDATE `member` SET `test` = '%s' WHERE `username`='%s'";
	$sql = sprintf($txt, $id, $_SESSION['username']);
	mysqli_query($db, $sql);

	$result = json_decode(mysqli_fetch_assoc(mysqli_query($db, "SELECT `thongtin` FROM `member` WHERE `username`='".$_SESSION['username']."'"))['thongtin'], true);
	if ($result=="") $result = array();
	$t = time();
	$done = $t + mysqli_fetch_assoc(mysqli_query($db, "SELECT `time` FROM `test` WHERE `id`='".$id."'"))['time']*60;
	array_push($result, array('id'=>$id, 'correct'=>0, 'do_at'=>$t,'done_at'=>$done));    
	$txt = "UPDATE `member` SET `thongtin`='%s' WHERE `username`='".$_SESSION['username']."'";
	$sql = sprintf($txt, addslashes(json_encode($result)));
	mysqli_query($db, $sql);

	setcookie('num', null, -1);
}

?>