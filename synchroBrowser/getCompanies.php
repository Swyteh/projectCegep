<?php
// phpinfo();
// die();
// const itemsData = [
//     { itemcode : "chair23", descr: "chaise pliante bleu", isactive: 1 },
//   { itemcode : "table1", descr: "table ronde", isactive: 1 }
// ];
require "modele.php";

function getCompanies($conn) {
    $i = 0;
    $sql = 'SELECT * from companies';
    //locations.name FROM fruit ORDER BY name';
    $r= 'SELECT COUNT(*) AS rows from  companies';

    foreach($conn->query($r) as $rowC) {
       $rowCount = $rowC['rows'];

    }
        echo "{\"value\":[";
    foreach ($conn->query($sql) as $row) {
        $i +=1;
        echo " { ";
        echo "\"cieCode\": \"" . $row['cieCode'] . "\" , ";
        echo "\"name\": \"" . $row['name'] . "\" , ";
        echo "\"followupinvloc\": " . $row['followupinvloc'] . " ";
        if ($i != $rowCount){
          echo "}, ";
        }
        else{
            echo "}]}";
        }
    }
}
$conn = getConn();
getCompanies($conn);


?>
