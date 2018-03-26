<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getItems($conn) {
    $i = 0;
    $sql = 'SELECT * from items';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  items';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"itemcode\": \"" . $row['itemcode'] . "\" , ";
        echo "\"descr\": \"" . $row['descr'] . "\" , ";
        echo "\"cieid\": " . $row['cieid'] . ", ";
        echo "\"uomid\": " . $row['uomid'] . ", ";
        echo "\"siteid\": " . $row['siteid'] . ", ";
        echo "\"locid\": " . $row['locid'] . ", ";
        echo "\"isActive\": " . $row['isActive'] . ", ";
        echo "\"isserialno\": " . $row['isserialno'] . ", ";
        echo "\"isserialnoqty\": " . $row['isserialnoqty'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();

getItems($conn);



?>
