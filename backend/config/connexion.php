<?php declare(strict_types=1);

$db_config['SGBD'] = 'mysql';
$db_config['HOST'] = 'devbdd.iutmetz.univ-lorraine.fr';
$db_config['DB_NAME'] = 'schalle31u_archilog';
$db_config['USER'] = 'schalle31u_appli';
$db_config['PASSWORD'] = '32300702';


try {
    $db = new PDO(
        $db_config['SGBD'] . ':host=' . $db_config['HOST'] . ';dbname=' . $db_config['DB_NAME'],
        $db_config['USER'],
        $db_config['PASSWORD'],
        array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8')
    );

    unset($db_config);

} catch (Exception $exception) {

    die($exception->getMessage());
}
?>