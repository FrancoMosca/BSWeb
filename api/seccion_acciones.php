<?php 
	require("configuration.php");
	
	$JConfig = new JConfig;//Creo el objeto
	
	$mysql_user = $JConfig->user;
	$mysql_password = $JConfig->password;
	$mysql_base = $JConfig->db;
	$mysql_host = $JConfig->host;
	$dbprefix = $JConfig->dbprefix;	

	$mysqli = mysqli_init();
	// $ssl_path='/var/task/user/api/cacert.pem';
	// $mysqli->ssl_set(NULL,NULL,$ssl_path,NULL,NULL);
	$mysqli->real_connect($mysql_host,$mysql_user,$mysql_password,$mysql_base);

	if (!$mysqli->real_connect($mysql_host, $mysql_user, $mysql_password, $mysql_base)) {
		die("Connection failed: " . $mysqli->connect_error);
	}

	if($_GET['utt'] == "04299e213f5391ede16784de41dd847d"){
			$iduser_web_empresa = $_GET['dt1'];
			$empresa = $_GET['dt2'];
			$empresa_encriptado = $_GET['dt3'];
			$clavesistema = str_replace("~", "+", $_GET['dt4']);
			$activo = $_GET['dt5'];
			$estado = $_GET['dt6'];
			
					switch($_GET['dt0']){
						case 1:
							if(!$iduser_web_empresa && !$empresa && !$empresa_encriptado && !$clavesistema && !$estado_activado){
								$error = "No se puede completar el registro.";
							}else{
								//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
								//1;BODEGAS HUMBERTO CANALE;CANALE;Ub2komwieNsUs4F5kB;2;1
								$query_ingresar = "INSERT INTO user_web_empresa ( 
								  iduser_web_empresa
								, empresa
								, empresa_encriptado
								, clavesistema
								, activo
								, estado
								) VALUES ( 
								  '$iduser_web_empresa'
								, '$empresa'
								, '$empresa_encriptado'
								, '$clavesistema'
								, '$activo'
								, '$estado'
								)";

									if(mysqli_query($query_ingresar) == true){	
										//$mensaje_finalizado = "Se ha cargado la empresa satisfactoriamente.";
										$mensaje_finalizado = "1";
									}else{
										//$mensaje_finalizado = "Hubo un error al intentar cargar la empresa.";
										$mensaje_finalizado = "2";
									}
							}
						break;
				
						case 2:
							if(!$iduser_web_empresa){
								$error = "No se pueden actualizar los datos.";
							}else{
								//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
								//1;BODEGAS HUMBERTO CANALE;CANALE;Ub2komwieNsUs4F5kB;1
								$query_ingresar = "UPDATE user_web_empresa SET activo = '1'";
								if($empresa){$query_ingresar .= ", empresa = '$empresa'";}
								if($empresa_encriptado){$query_ingresar .= ", empresa_encriptado = '$empresa_encriptado'";}
								if($clavesistema){$query_ingresar .= ", clavesistema = '$clavesistema'";}
								if($activo){$query_ingresar .= ", activo = '$activo'";}
								if($estado){$query_ingresar .= ", estado = '$estado'";}
								$query_ingresar .= " WHERE iduser_web_empresa = '$iduser_web_empresa'";
																
									if(mysqli_query($query_ingresar) == true){	
										//$mensaje_finalizado = "Se ha actualizado la empresa satisfactoriamente.";
										$mensaje_finalizado = "1";
									}else{
										//$mensaje_finalizado = "Hubo un error al intentar actualizar la empresa.";
										$mensaje_finalizado = "2";
									}							
							}
				
						break;
				
						case 3:
							if(!$iduser_web_empresa){
								$error = "No se puedo eliminar el registro.";
							}else{
								//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
								//1;BODEGAS HUMBERTO CANALE;CANALE;Ub2komwieNsUs4F5kB;1
								$query_ingresar = "DELETE FROM user_web_empresa WHERE iduser_web_empresa = '$iduser_web_empresa' ";

									if(mysqli_query($query_ingresar) == true){	
										//$mensaje_finalizado = "Se ha eliminado la empresa satisfactoriamente.";
										$mensaje_finalizado = "1";
									}else{
										//$mensaje_finalizado = "Hubo un error al intentar eliminar la empresa.";
										$mensaje_finalizado = "2";
									}	
							}
						break;
					}

/*
Usuario:
"IDENTIDAD","EMPRESA","NOMBRE","EMAIL","USUARIO","CLAVE","ACTIVO","ESTADO"
$utt = f8032d5cae3de20fcec887f395ec9a6a
$dt0

1: Crear: &dt0=1
http://www.belgranosoftware.com.ar/
seccion_acciones.php?
utt=f8032d5cae3de20fcec887f395ec9a6a
&dt1=500
&dt2=400
&dt3=ARIEL
&dt4=ARIELARIEL
&dt5=ariel@ideas2.com.ar
&dt6=ariel
&dt7=arielariel
&dt8=5
&dt9=5

&dt0=1

&dt1=IDENTIDAD
&dt2=EMPRESA
&dt3=NOMBRE
&dt4=APELLIDO
&dt5=EMAIL
&dt6=USUARIO
&dt7=CLAVE
&dt8=ACTIVO
&dt9=ESTADO

2: Editar: &dt0=2
seccion_acciones.php?
utt=f8032d5cae3de20fcec887f395ec9a6a
&dt1=400
&dt2=400
&dt3=ARIEL
&dt4=ALE
&dt5=aariel@ideas2.com.ar
&dt6=1
&dt7=3

&dt0=2


&dt1=IDENTIDAD
&dt2=EMPRESA
&dt3=NOMBRE
&dt4=APELLIDO
&dt5=EMAIL
&dt6=USUARIO
&dt7=CLAVE
&dt8=ACTIVO
&dt9=ESTADO




3: Eliminar: &dt0=3
seccion_acciones.php?utt=f8032d5cae3de20fcec887f395ec9a6a&dt1=3&dt0=3
*/

	// }elseif($_GET['utt'] == "f8032d5cae3de20fcec887f395ec9a6a"){

	// 		$iduser_web_belg = $_GET['dt1'];
	// 		$iduser_web_empresa = $_GET['dt2'];
	// 		$nombre = $_GET['dt3'];
	// 		$apellido = $_GET['dt4'];
	// 		$mail = $_GET['dt5'];
	// 		$username = $_GET['dt6'];
	// 		$password = $_GET['dt7'];
	// 		$activo = $_GET['dt8'];
	// 		$estado = $_GET['dt9'];
			
	// 				switch($_GET['dt0']){
	// 					case 1:
	// 						if(!$iduser_web_belg && !$iduser_web_empresa && !$nombre){
	// 							$error = "No se puede completar el registro.";
	// 						}else{
	// 							//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
	// 							//"IDENTIDAD","EMPRESA","NOMBRE","EMAIL","USUARIO","CLAVE"
	// 							$query_ingresar = "INSERT INTO user_web ( 
	// 							  iduser_web_belg
	// 							, iduser_web_empresa
	// 							, nombre
	// 							, apellido
	// 							, mail
	// 							, username
	// 							, password
	// 							, activo
	// 							, estado
	// 							) VALUES ( 
	// 							  '$iduser_web_belg'
	// 							, '$iduser_web_empresa'
	// 							, '$nombre'
	// 							, '$apellido'
	// 							, '$mail'
	// 							, '$username'
	// 							, '$password'
	// 							, '$activo'
	// 							, '$estado'
	// 							)";
	// 								if(mysql_query($query_ingresar) == true){	
	// 									//$mensaje_finalizado = "Se ha cargado el usuario satisfactoriamente.";
	// 									$mensaje_finalizado = "1";
	// 								}else{
	// 									//$mensaje_finalizado = "Hubo un error al intentar cargar el usuario.";
	// 									$mensaje_finalizado = "2";
	// 								}
	// 						}
	// 					break;
				
	// 					case 2:
	// 						if(!$iduser_web_belg){
	// 							$error = "No se pueden actualizar los datos.";
	// 						}else{
	// 							//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
	// 							//1;BODEGAS HUMBERTO CANALE;CANALE;Ub2komwieNsUs4F5kB;1;1
	// 							$query_ingresar = "UPDATE user_web SET sexo = 'N'";
	// 							if($iduser_web_empresa){$query_ingresar .= ", iduser_web_empresa = '$iduser_web_empresa'";}
	// 							if($nombre){$query_ingresar .= ", nombre = '$nombre'";}
	// 							if($apellido){$query_ingresar .= ", apellido = '$apellido'";}
	// 							if($mail){$query_ingresar .= ", mail = '$mail'";}
	// 							if($username){$query_ingresar .= ", username = '$username'";}
	// 							if($password){$query_ingresar .= ", password = '$password'";}
	// 							if($activo){$query_ingresar .= ", activo = '$activo'";}
	// 							if($estado){$query_ingresar .= ", estado = '$estado'";}
								

	// 							$query_ingresar .= " WHERE iduser_web_belg = '$iduser_web_belg'";
								
	// 								if(mysql_query($query_ingresar) == true){	
	// 									//$mensaje_finalizado = "Se ha actualizado el usuario satisfactoriamente.";
	// 									$mensaje_finalizado = "1";
	// 								}else{
	// 									//$mensaje_finalizado = "Hubo un error al intentar actualizar el usuario.";
	// 									$mensaje_finalizado = "2";
	// 								}	
	// 						}
				
	// 					break;
				
	// 					case 3:
	// 						if(!$iduser_web_belg){
	// 							$error = "No se puedo eliminar el registro.";
	// 						}else{
	// 							//AL ESTAR VACIA, DIRECTAMENTE INGRESO LOS VALORES DEL ARCHIVO
	// 							//1;BODEGAS HUMBERTO CANALE;CANALE;Ub2komwieNsUs4F5kB;1
	// 							$query_ingresar = "DELETE FROM user_web WHERE iduser_web_belg = '$iduser_web_belg' ";
	// 								if(mysql_query($query_ingresar) == true){	
	// 									//$mensaje_finalizado = "Se ha eliminado el usuario satisfactoriamente.";
	// 									$mensaje_finalizado = "1";
	// 								}else{
	// 									//$mensaje_finalizado = "Hubo un error al intentar eliminar el usuario.";
	// 									$mensaje_finalizado = "2";
	// 								}
	// 						}
	// 					break;
	// 				}

	}else{
		$mensaje_finalizado = "No se ha realizado ninguna acci&oacute;n";
	}
	
	echo $mensaje_finalizado;
	$mysqli->close();
?>
