<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getLocations($conn) {
    $i = 0;
    $sql = 'SELECT * from locations';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  locations';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"locCode\": \"" . $row['locCode'] . "\" , ";
        echo "\"Name\": \"" . $row['Name'] . "\" , ";
        echo "\"cieid\": " . $row['cieid'] . ", ";
        echo "\"siteid\": " . $row['siteid'] . ", ";
        echo "\"isdefault\": " . $row['isdefault'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();
getLocations($conn);


?>
