<?php
function sendDiscordMessage($webhookUrl, $message)
{
    $data = json_encode(["content" => $message]);

    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    return $response;
}

function sendMessage($webhookUrl, $actionType, $details)
{
    $message = "Nouvelle action détectée : $actionType\nDétails : $details";
    return sendDiscordMessage($webhookUrl, $message);
}

function getWebhookUrl(): string
{
    // Lien webhook
    return "https://discord.com";
}

$webhookUrl = getWebhookUrl();
?>