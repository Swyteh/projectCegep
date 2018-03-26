<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getSites($conn) {
    $i = 0;
    $sql = 'SELECT * from sites';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  sites';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"sitecode\": \"" . $row['sitecode'] . "\" , ";
        echo "\"name\": \"" . $row['name'] . "\" , ";
        echo "\"cieid\": " . $row['cieid'] . ", ";
        echo "\"siteid\": " . $row['siteid'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();
getSites($conn);


?>
