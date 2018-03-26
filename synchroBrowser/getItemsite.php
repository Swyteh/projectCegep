<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getItemsite($conn) {
    $i = 0;
    $sql = 'SELECT * from itemsite';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  itemsite';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"itemid\": " . $row['itemid'] . ", ";
        echo "\"siteid\": " . $row['siteid'] . ", ";
        echo "\"cieid\": " . $row['cieid'] . ", ";
        echo "\"locid\": " . $row['locid'] . ", ";
        echo "\"qtyonhand\": " . $row['qtyonhand'] . ", ";
        echo "\"rankno\": " . $row['rankno'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();

getItemsite($conn);



?>
