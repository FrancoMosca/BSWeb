<?php 

	require("configuration.php");
	
	$JConfig = new JConfig;//Creo el objeto
	
	$mysql_user = $JConfig->user;
	$mysql_password = $JConfig->password;
	$mysql_base = $JConfig->db;
	$mysql_host = $JConfig->host;
	$dbprefix = $JConfig->dbprefix;	
	
	$mysqli = mysqli_init();
	$mysqli->real_connect($mysql_host, $mysql_user,$mysql_password,$mysql_base);

	$get_sispass = $_GET['gsp'];
	$dar_clasis = "ERROR WEB";

/*
SI ENCUENTRA SEGUN �EMPRESA_ENCRIPTADO� �>
SI ESTADO ES 0 �> DEVUELVE EL TEXTO �No est� autorizada la clave para este sistema�
SI ESTADO ES 2 �> DEVUELVE EL TEXTO �MOROSO�
SI ESTADO ES 1 �> DEVUELVE CONTENIDO DE �CLAVESISTEMA�
*/
	if($get_sispass != ''){
		// Muestro clave del sistema local en la siguiente consulta
		$query_clasis = "SELECT clavesistema, activo
		FROM user_web_empresa
		WHERE empresa_encriptado = '$get_sispass'
		";
		/*
		$query_clasis = "SELECT clavesistema, activo
		FROM user_web_empresa
		WHERE empresa_encriptado = '$get_sispass'
		AND activo = 1
		";
		*/
		$rs_clasis_num = $mysqli->query($query_clasis)->num_rows;
		echo $rs_clasis_num;
		if($rs_clasis_num == 1){				
			$rs_clasis = $mysqli->query($query_clasis)->fetch_assoc();
			if($rs_clasis['activo'] == 0){
				$dar_clasis = "No est&aacute; autorizada la clave para este sistema";
			}elseif($rs_clasis['activo'] == 1){
				$dar_clasis = $rs_clasis['activo'].$rs_clasis['clavesistema'];
			}elseif($rs_clasis['activo'] == 2){
				$dar_clasis = "MOROSO";
			}else{
				$dar_clasis = $rs_clasis['activo'];
			}
		}else{
			$dar_clasis = "No est&aacute; autorizada la clave para este sistema";
		}
	}

	// $get_userpass = $_GET['gup'];
	// if($get_userpass != ''){
	// // Muestro clave del sistema local en la siguiente consulta
	// 	$query_clasis = "SELECT password, activo
	// 	FROM user_web
	// 	WHERE iduser_web_belg = '$get_userpass'
	// 	";
	// 	/*
	// 	$query_clasis = "SELECT password, activo
	// 	FROM user_web
	// 	WHERE iduser_web_belg = '$get_userpass'
	// 	AND activo = 1
	// 	";
	// 	*/
	// 	$rs_clasis_num = $mysqli->query($query_clasis)->num_rows;
	// 	if($rs_clasis_num == 1){				
	// 		$rs_clasis = $mysqli->query($query_clasis)->fetch_assoc();					
	// 		if($rs_clasis['activo'] == 1){
	// 			$dar_clasis = $rs_clasis['activo'].$rs_clasis['password'];
	// 		}else{
	// 			$dar_clasis = $rs_clasis['activo'];
	// 		}

	// 	}else{
	// 		$dar_clasis = "No est&aacute; autorizada la clave para este sistema";
	// 	}
	// }

 	echo $dar_clasis; 
	$mysqli->close();
?>
