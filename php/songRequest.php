<?
header("Access-Control-Allow-Origin: *");

session_start();
if (isset($_SESSION['LAST_CALL'])) {
  $last = strtotime($_SESSION['LAST_CALL']);
  $curr = strtotime(date("Y-m-d h:i:s"));
  $sec =  abs($last - $curr);
  if ($sec <= 30) {
    die("success");
  }
}
$_SESSION['LAST_CALL'] = date("Y-m-d h:i:s");

if (isset($_POST['song']) && isset($_POST['name'])) {
    $song = $_POST['song'];
    $name = $_POST['name'];

    $url = 'https://discordapp.com/api/webhooks/697914956938477678/CO4c6l65odT3Q00SXmxACqrMK5QzxiRaBhqjOEkZtsMPn1G0fVTIQKO5BTEjg6iHVfcA';

    $content = "**Song Request**\nRequest: ".$song."\nRequested By: ".$name;

    $content = str_replace("@", "", $content);

    $data = array('username' => 'Ignite', 'avatar_url' => 'https://imgur.com/9OlmHbc.png', 'content' => $content);

    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === FALSE) {
        http_response_code(500);
    } else {
        http_response_code(200); 
        echo "success"; 
    }
} else {
    echo $_POST['song'];
}
?>
    