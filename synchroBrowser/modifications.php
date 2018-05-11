
<?php
require "modele.php";

function updateQuery($conn){
  if(isset($_POST['tablename'])) {
    $tablename = $_POST['tablename'];
  }
  if(isset($_POST['field'])) {
    $field = $_POST['field'];
  }
  if(isset($_POST['value'])) {
    $value = $_POST['value'];
  }
  if(isset($_POST['tableid'])) {
    $tableid = $_POST['tableid'];
  }
  if(isset($_POST['id'])) {
    $id = $_POST['id'];
  }
  $sql = 'UPDATE ' . $tablename . ' SET ' .  $field . ' = :value  WHERE ' . $tableid . ' = ' . $id;
  try
  {
    $sth  = $conn->prepare($sql);
    $sth->bindParam(':value', $value);
    $sth->execute();
    echo json_encode(array("state"=>1));
  }
  catch(Exception $e)
  {
  //  die( print_r( $e->getMessage() ) );
    echo json_encode(array("state"=>0));

  }

}

$conn = getConn();
updateQuery($conn);
?>
