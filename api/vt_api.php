<?php
error_reporting(0);
$url_get             = $_GET['url'];
$parse               = parse_url($url_get);
$regex_title_topicos = '/\[\s*Ir.*?\]/s';
$regex_last_page     = '/\?page=([^&?#"]*)/s';
$valid_referers = array(
    'http://uolmobileepico.com/',
    'http://localhost/'
);
$valid_forums        = array(
    '/_f_57',
    '/_f_56',
    '/_f_39',
    '/_f_40',
    '/_f_41',
    '/_f_43',
    '/_f_51',
    '/_f_54',
    '/_f_55' 
);
$user_agents_list    = array(
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1862.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3) Gecko/20090305 Firefox/3.1b3 GTB5',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Win64; x64; Trident/6.0)',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.29 Safari/537.36 OPR/15.0.1147.24 (Edition Next)',
    'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
    'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like Gecko'
);
$headers             = array(
    "Cache-Control: no-cache"
);

$user_agent = $user_agents_list[array_rand($user_agents_list)];

if (((!in_array($parse['path'], $valid_forums)) && (!strpos($parse['path'], '_t_'))) || $url_get == null || $url_get == "" || ($parse['host'] !== "forum.jogos.uol.com.br")) {
    header('HTTP/1.0 404 Not Found');
    echo "<title>.</title><center>doente</center>";
    exit();
}
if (!in_array($_SERVER['HTTP_REFERER'], $valid_referers))
{
    header('HTTP/1.0 404 Not Found');
    echo "<title>.</title><center>doente</center>";
    exit();
}

class Utilities
{
    function prettifyDOM($text)
    {
        $text = (trim($text, "\x00..\x1F"));
        return $text;
    }
    function generateJSONerror($text, $message)
    {
        if (!isset($message)) {
            $message = "No message";
        }
        $error .= "<dummy_error_holder>";
        $error .= "<err>";
        $error .= "<err_name>";
        $error .= ($text);
        $error .= "</err_name>";
        $error .= "<err_message>";
        $error .= htmlspecialchars($message);
        $error .= "</err_message>";
        $error .= "<err_date>";
        $error .= (date("h:i:sA   d/m/Y"));
        $error .= "</err_date>";
        $error .= "</err>";
        $error .= "</dummy_error_holder>";
        return json_encode(simplexml_load_string($error));
    }
    function curlStoreDOM($url, $user_agent)
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
            CURLOPT_HEADER => TRUE,
            CURLOPT_RETURNTRANSFER => TRUE,
            CURLOPT_FRESH_CONNECT => TRUE,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TRANSFERTEXT => TRUE,
            CURLOPT_URL => $url,
            CURLOPT_USERAGENT => $user_agent
        ));

        $curl_output = utf8_decode(curl_exec($ch));
        if (curl_errno($ch)) {
            return false;
        }
        $info = curl_getinfo($ch);
        
        $dom                     = new DOMDocument();
        $doc->preserveWhiteSpace = FALSE;
        $doc->formatOutput       = FALSE;
        $dom->loadHTML($curl_output);
        return $dom;
    }
}
$Utilities = new Utilities();

header("Access-Control-Allow-Origin: http://www.uolmobileepico.com");
header("Access-Control-Allow-Origin: http://uolmobileepico.com");
header('Content-Type: application/json; charset=utf-8');

if (in_array($parse['path'], $valid_forums)) {
    try {
        $dom = $Utilities->curlStoreDOM($url_get, $user_agent);
        if (!$dom) {
            exit($Utilities->generateJSONerror('Error #64'));
        }
        $dom_path   = new DOMXPath($dom);
        $page_title = $dom_path->query("//title")->item(0)->nodeValue;
        if (strpos($page_title, 'UOL Jogos :: Ajuda') !== FALSE || strpos($page_title, 'Fórum UOL Jogos :: Índice do fórum') !== FALSE) {
            exit($Utilities->generateJSONerror('Error #67', "Falha no sistema/Erro pagina X de Y (forum)"));
        }
        $no_posts_error = $dom_path->query("//div[@id='contentDiv']/div[contains(@class, 'msg')]/h3")->item(0)->nodeValue;
        if (strpos($no_posts_error, 'Seja o primeiro a escrever') !== FALSE) {
            exit($Utilities->generateJSONerror('Error #68', "Seja o primeiro a escrever (forum)"));
        }
        $rows                     = $dom_path->query("//table[@id='topics']/tbody/tr");
        $lista_topicos_formatados = "";
        $lista_topicos_formatados .= "<VT><thread_list>";
        $lista_topicos_formatados .= "<forum_name>";
        $lista_topicos_formatados .= ($Utilities->prettifyDOM($dom_path->query("//a[@class='breadcrumb-actual-page']")->item(0)->nodeValue));
        $lista_topicos_formatados .= "</forum_name>";
        $lista_topicos_formatados .= "<page_title>";
        $lista_topicos_formatados .= ($Utilities->prettifyDOM($page_title));
        $lista_topicos_formatados .= "</page_title>";
        $lista_topicos_formatados .= "<online_users>";
        $lista_topicos_formatados .= htmlspecialchars($dom->saveHTML($dom_path->query("//div[@id='estatisticas']/div[@class='texto']")->item(0)));
        $lista_topicos_formatados .= "</online_users>";
        $b = 0;
        $lista_topicos_formatados .= "<all_threads>";
        foreach ($rows as $row) {
            $entire_row        = "null";
            $thread_id         = str_replace('tr-', '', $row->getAttribute('id'));
            $title             = $dom_path->query("//span[@class='titulo']", $row)->item($b)->nodeValue;
            $author            = $dom_path->query("//span[@class='autor']", $row)->item($b)->nodeValue;
            $author_url        = $dom_path->query("//span[@class='autor']/a", $row)->item($b)->getAttribute('href');
            $replies           = $Utilities->prettifyDOM($dom_path->query("//span[@class='respostas']", $row)->item($b)->nodeValue);
            $views             = $Utilities->prettifyDOM($dom_path->query("//span[@class='exibicoes']", $row)->item($b)->nodeValue);
            $last_message      = $Utilities->prettifyDOM($dom_path->query("//span[@class='lastmessage']", $row)->item($b)->nodeValue);
            $last_message_link = $Utilities->prettifyDOM($dom_path->query("//span[@class='lastmessage']/a", $row)->item($b)->getAttribute('href'));
            
            $lista_topicos_formatados .= "<thread>";
            
            $lista_topicos_formatados .= "<id_in_list>" . $b . "</id_in_list>";
            $lista_topicos_formatados .= "<global_id>" . $thread_id . "</global_id>";
            $lista_topicos_formatados .= "<title>" . htmlspecialchars($title) . "</title>";
            $lista_topicos_formatados .= "<author>" . htmlspecialchars($author) . "</author>";
            $lista_topicos_formatados .= "<author_url>" . htmlspecialchars($author_url) . "</author_url>";
            $lista_topicos_formatados .= "<replies>" . $replies . "</replies>";
            $lista_topicos_formatados .= "<views>" . $views . "</views>";
            $lista_topicos_formatados .= "<last_message>" . htmlspecialchars($last_message) . "</last_message>";
            $lista_topicos_formatados .= "<last_message_link>" . htmlspecialchars($last_message_link) . "</last_message_link>";
            $lista_topicos_formatados .= "<entire_row>" . $entire_row . "</entire_row>";
            
            $lista_topicos_formatados .= "</thread>";
            
            $b++;
        }
        $lista_topicos_formatados .= "</all_threads>";
        $lista_topicos_formatados .= "</thread_list></VT>";
        echo (json_encode(simplexml_load_string($lista_topicos_formatados)));
    }
    catch (Exception $e) {
        echo $Utilities->generateJSONerror('Error #35', $e->getMessage());
    }
} else if (strpos($parse['path'], '_t_')) {
    try {
        $dom = $Utilities->curlStoreDOM($url_get, $user_agent);
        if (!$dom) {
            exit($Utilities->generateJSONerror('Error #65'));
        }
        $dom_path                 = new DOMXPath($dom);
        $erro_busca_pagina_topico = $dom_path->query("//div[@id='content-inside']/div[@class='error_messages']/div[contains(@class, 'error')]")->item(0);
        if ($erro_busca_pagina_topico) {
            exit($Utilities->generateJSONerror('Error #69', "Erro buscando pagina X de Y"));
        }
        $page_title = $dom_path->query("//title")->item(0)->nodeValue;
        if (strpos($page_title, 'UOL Jogos :: Ajuda') !== FALSE || strpos($page_title, 'Fórum UOL Jogos :: Índice do fórum') !== FALSE) {
            exit($Utilities->generateJSONerror('Error #67', "Falha no sistema (forum)"));
        }
        $paginacao                = $dom->saveHTML($dom_path->query("//div[@id='paginacao']/span[@class='notActive']")->item(0));
        $rows                     = $dom_path->query("//div[@id='posts-container']/div");
        $current_page_unformatted = $dom_path->query("//div[@id='paginacao']/span[@class='actualPage']")->item(0)->nodeValue;
        $current_page             = str_replace('?', '', utf8_decode(str_replace('?', '', utf8_decode($current_page_unformatted))));
        $last_a        = $dom_path->query("(//div[@id='paginacao']/span[@class='notActive']/a)[last()]")->item(0);
        $last_a_before = $dom_path->query("(//div[@id='paginacao']/span[@class='notActive']/a)[last()-2]")->item(0);
        preg_match($regex_last_page, $last_a_href, $last_page);
        preg_match($regex_last_page, $last_a_before_href, $last_page_before);
        if ($last_a && $last_a_before) {
            $last_a_href        = $last_a->getAttribute('href');
            $last_a_before_href = $last_a_before->getAttribute('href');
            preg_match($regex_last_page, $last_a_href, $last_page);
            preg_match($regex_last_page, $last_a_before_href, $last_page_before);
            if ($last_page_before[1] < $last_page[1]) {
                $last_pagee = $last_page[1];
            } else if (($last_page_before[1] == $last_page[1])) {
                if ($current_page == 1) {
                    $last_pagee = $last_page[1];
                } else {
                    $last_pagee = $last_page[1] + 1;
                }
            } else {
                $last_pagee = "NaN";
            }
        } else {
            $last_pagee = 1;
        }

        $lista_posts_formatados = "";
        $lista_posts_formatados .= "<VT><post_list>";
        $lista_posts_formatados .= "<thread_name>";
        $lista_posts_formatados .= htmlspecialchars(($dom_path->query("//div[@class='titleTopic']/h1")->item(0)->nodeValue));
        $lista_posts_formatados .= "</thread_name>";
        $lista_posts_formatados .= "<online_users>";
        $lista_posts_formatados .= htmlspecialchars($dom->saveHTML($dom_path->query("//div[@id='estatisticas']/div[@class='texto']")->item(0)));
        $lista_posts_formatados .= "</online_users>";
        $lista_posts_formatados .= "<thread_date>";
        $lista_posts_formatados .= $dom_path->query("//div[@class='titleTopic']/div[@class='topic-date']")->item(0)->nodeValue;
        $lista_posts_formatados .= "</thread_date>";
        $lista_posts_formatados .= "<forum_id>";
        $lista_posts_formatados .= $dom_path->query("//a[@class='breadcrumb-actual-page']")->item(0)->getAttribute('href');
        $lista_posts_formatados .= "</forum_id>";
        $lista_posts_formatados .= "<forum_name>";
        $lista_posts_formatados .= $Utilities->prettifyDOM($dom_path->query("//a[@class='breadcrumb-actual-page']")->item(0)->nodeValue);
        $lista_posts_formatados .= "</forum_name>";
        $lista_posts_formatados .= "<thread_posts_in_page>";
        $lista_posts_formatados .= $rows->length;
        $lista_posts_formatados .= "</thread_posts_in_page>";
        $lista_posts_formatados .= "<thread_cur_page>";
        $lista_posts_formatados .= $current_page;
        $lista_posts_formatados .= "</thread_cur_page>";
        $lista_posts_formatados .= "<thread_last_page>";
        $lista_posts_formatados .= $last_pagee;
        $lista_posts_formatados .= "</thread_last_page>";
        $lista_posts_formatados .= "<all_posts>";
        $b = 0;
        foreach ($rows as $row) {
            $post_id = $row->getAttribute('id');
            $nickname_a_tag = $dom_path->query("//p[@class='userNickname']/a", $row)->item($b);
            $profile_url    = rawurlencode($nickname_a_tag->getAttribute('href'));
            $nickname       = ($nickname_a_tag->nodeValue);
            $avatarurl = rawurlencode($dom_path->query("//p//img", $row)->item($b)->getAttribute('src'));
            $text_obj             = $dom_path->query("//div[@class='texto']", $row)->item($b);
            $text                 = ($dom->saveHTML($text_obj));
            $text_plain           = $text_obj->nodeValue;
            $text_userlevel_based = $Utilities->prettifyDOM($dom->saveHTML($dom_path->query("//div[@class='texto']", $row)->item($b)));
            $userlevel     = $Utilities->prettifyDOM($dom->saveHTML($dom_path->query("//p[@class='userLevel']", $row)->item($b)));
            $totalposts    = $dom_path->query("//p[@class='descricao']/b", $row)->item($b)->nodeValue;
            $register_date = $dom_path->query("//span[@class='data-cadastro']/b", $row)->item($b)->nodeValue;
            $post_date     = $dom_path->query("//div[contains(@class, 'publishDate')]", $row)->item($b)->nodeValue;
            
            
            $lista_posts_formatados .= "<post>";
            $lista_posts_formatados .= "<global_id>" . $post_id . "</global_id>";
            $lista_posts_formatados .= "<id_in_list>" . $b . "</id_in_list>";
            $lista_posts_formatados .= "<username>" . htmlspecialchars($nickname) . "</username>";
            $lista_posts_formatados .= "<message>" . htmlspecialchars($text_userlevel_based) . "</message>";
            $lista_posts_formatados .= "<profile_url>" . ($profile_url) . "</profile_url>";
            $lista_posts_formatados .= "<avatar_url>" . ($avatarurl) . "</avatar_url>";
            $lista_posts_formatados .= "<total_posts>" . ($totalposts) . "</total_posts>";
            $lista_posts_formatados .= "<register_date>" . ($register_date) . "</register_date>";
            $lista_posts_formatados .= "<user_level>" . htmlspecialchars($userlevel) . "</user_level>";
            
            $lista_posts_formatados .= "</post>";
            $b++;
        }
        $lista_posts_formatados .= "</all_posts>";
        $lista_posts_formatados .= "</post_list></VT>";
        echo (json_encode(simplexml_load_string($lista_posts_formatados)));
    }
    catch (Exception $e) {
        echo $Utilities->generateJSONerror('Error #35', $e->getMessage());
    }
} else {
    echo $Utilities->generateJSONerror('Error #178', 'Thread/Forum URL is invalid');
}
?>