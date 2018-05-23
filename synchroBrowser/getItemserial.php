<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getItemserial($conn) {
    $i = 0;
    $sql = 'SELECT * from itemserial';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  itemserial';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"cieid\": " . $row['cieid'] . ", ";
        echo "\"serialno\": \"" . $row['serialno'] . "\" , ";
        echo "\"idprextra\": " . $row['itemserialid'] . ", ";

        echo "\"siteid\": " . $row['siteid'] . ", ";
        echo "\"itemid\": " . $row['itemid'] . ", ";
        echo "\"locid\": " . $row['locid'] . ", ";
        echo "\"isactive\": " . $row['isactive'] . ", ";
        echo "\"qtyonhand\": " . $row['qtyonhand'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();

getItemserial($conn);



?>
