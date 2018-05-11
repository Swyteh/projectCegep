
<?php
//modele
function getConn() {
  try
  {
    $serverName = "B438P-05\SQLEXPRESS";
    $conn = new PDO( "sqlsrv:server=$serverName ; Database=prextraDev",NULL, NULL);
    $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    return $conn;
  }
  catch(Exception $e)
  {
    die( print_r( $e->getMessage() ) );
  }
}
?>
