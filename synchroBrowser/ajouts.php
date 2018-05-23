
<?php
require "modele.php";

function ajoutQuery($conn){
  if(isset($_POST['tablename'])) {
    $tablename = $_POST['tablename'];
  }
  if(isset($_POST['fields'])) {
    $fields = $_POST['fields'];
  }
  if(isset($_POST['values'])) {
    $value = $_POST['values'];
  }

  $sql = 'INSERT INTO ' . $tablename .   $fields  . ' VALUES ' . $value ;
  try
  {
    $sth  = $conn->prepare($sql);
    $sth->execute();
    echo json_encode(array("state"=>1,"query"=>$sql));
  }
  catch(Exception $e)
  {
  //  die( print_r( $e->getMessage() ) );
    echo json_encode(array("state"=>$e->getMessage(),"query"=>$sql));

  }

}

$conn = getConn();
ajoutQuery($conn);
?>
