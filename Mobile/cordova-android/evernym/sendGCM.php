<?php

$deviceRegistrationId = 'APA91bGa3G4ydIAfT3st1ebEn7qwtLcH2ic_Hk2pbbV2_MGXB-44fHJKzqTh_VasKQ9QSKneftFBKhYzqV6dquh5ER5CB-JSUpZVxpaFk7H_77elJCiAs8Mk4ag8aAaDOmqkEwK-g2T26SiA3KMuioh_uf0Ha3ZnQQ';
$messageText = "You have a new message from Barry Mannilo";

$headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . "AIzaSyDD_SZAT0dHtrrBAHUnlzQgdO9ZM_p4nT8");

    $data = array(
        'collapse_key' => "messages",
        'data' => array(
                        "message" =>  $messageText,
                        "type" => "broadcast",
                        "channelid" => "628f4a1c-8d48-4877-ab6d-1611a888c929",
                        "messageid" => "47fc4840-ff38-4084-b1dd-17511342a6be"
                        ),
        'registration_ids' => array($deviceRegistrationId)
    );


    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers); 
    curl_setopt($ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send");
    curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    error_log(json_encode($data));
    $response = curl_exec($ch);
    curl_close($ch);
    error_log($response);

?>
