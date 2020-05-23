<?
header("Access-Control-Allow-Origin: *");
header("Content-Type:application/json");

if (isset($_GET['albumname'])) {
    $artist = $_GET['artistname'];

    if ($artist) {
        $url = 'https://api.deezer.com/2.0/search?q='.rawurlencode($_GET['albumname']).'+'.rawurlencode($_GET['artistname']);
    } else {
        $url = 'https://api.deezer.com/2.0/search?q='.rawurlencode($_GET['albumname']);
    }
    $urlUNI = str_replace("'", "%27", $url);
    $deezerjson = json_decode(file_get_contents($urlUNI), TRUE);
    $recentArt = $deezerjson['data'][0]['album']['cover_xl'];
    if($recentArt === null) {
        $recentArt = "https://imgur.com/9OlmHbc.png";
    }
}

echo $recentArt;
?>
    