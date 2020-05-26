<?php
date_default_timezone_set( 'Asia/Shanghai' );
$base_url = 'https://note.mk';
$save_path = '_note_';

header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$readonly=["home","index","readme","note"];

$textrow=20;
$content="";
$isreadonce="";
$viewonly=false;
$lastsaved=time();
$pwdkeywords;

/**  */
if (!isset($_GET['note']) || !preg_match('/^[\w_-]+$/', $_GET['note']) || strlen($_GET['note']) > 64) {
    if(in_array(strtolower($_GET['note']), $readonly))
        {
            header("Location: $base_url/" . strtolower($_GET['note']));
        }else
        {
            header("Location: $base_url/" . substr(str_shuffle('2345789abcdefghjkmnpqrstwxyz'), -7));
        }
    die;
}

$path = $save_path . '/' . $_GET['note'];

    if (isset($_POST['text'])) {

        if(in_array(strtolower($_GET['note']), $readonly))
        {
            /** Read only */
        }else
        {
            //UPDATE
            /** deleted after reading */
            if(isset($_POST['readonce'])){
                file_put_contents($path, "=!#!#readonlyonce#!#!=\n".$_POST['text']);
            }
            /** set note password */
            elseif (isset($_POST['password']))
            {
                   /** None */         
            }
            else
            {
                file_put_contents($path, $_POST['text']);
            }
            //DELETE
            if (!strlen($_POST['text'])) {
                unlink($path);
            }
        }
        die;
    }

    if (is_file($path)) {
                $content=htmlspecialchars(file_get_contents($path), ENT_QUOTES, 'UTF-8');
                $content_header=substr($content,0,22);
                $content_password=substr($content,17,6);
                $lastsaved=time();

                if(file_exists($path)){
                $filetime= filemtime($path) ? filemtime($path) : $filetime;
                $lastsaved=date($filetime);

                switch ($content_header) {
                    case '=!#!#notepassword#!#!=':
                        $pwdkeywords = preg_split("/\n/", $content)[0];
                        $content = str_replace($pwdkeywords, "", $content);
                        break;
                    case '=!#!#readonlyonce#!#!=':
                        $content=substr($content,23);
                        $viewonly=true;
                        unlink($path);
                        $isreadonce=" οnclick='return false;' disabled='disabled' checked='checked' ";
                        break;
                    default:
                    $content=$content;
                        break;
                }
                $textcount=substr_count($content, "\n")+1;
                $textrow=$textcount<$textrow?$textrow:$textcount;
            }
    }
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Easily notes and share">
    <meta name="keywords" content="note,notepad,temporary,book,open,random,mark">
    <meta name="author" content="MUP">
    <meta name="generator" content="note.mk">
    <title>Note.MK - <?php echo $_GET['note']; ?></title>
    <link rel="shortcut icon" href="<?php echo $base_url; ?>/favicon.png">
    <link rel="stylesheet" href="<?php echo $base_url; ?>/styles.min.css">
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div id="saved" class="hide">saved</div>
            <?php if($viewonly)
                    {
                        $height=$textrow * 16;
                        echo "<div id='content' class='viewcontent' rows='$textrow' data-min-rows='20' date-last-saved='$lastsaved' style='height:". $height ."px'>".str_replace("\n","<br />",$content)."</div>";
                    }
                    else{
            ?>
            <textarea id="content" rows='<?php echo $textrow; ?>' data-min-rows='20'
                date-last-saved='<?php echo $lastsaved; ?>'><?php echo $content; ?></textarea>
            <?php 
                    }
            ?>
            <ol id="line"></ol>
            <div class="footer">
                <a href="/home">
                    HOME
                </a>
                <a href="javascript:newNote();">
                    New
                </a>
                <a href="javascript:resetNote(g('content'));">
                    Reset
                </a>
                <a href="javascript:void(0);" class="alink" id="a-history">
                    History
                </a>
                <a href="javascript:void(0);" class="alink" id="a-password">
                    Read Once
                </a>
                <a href="javascript:void(0);" class="alink" id="a-share">
                    Share
                </a>
                <?php if(!$viewonly){?>
                <a href="javascript:loadQR();" class="alink" id="a-qrcode">
                    QRCode
                </a>
                <?php } ?>
                <a href="javascript:loadQR();" id="ago">Load ...</a>
                <?php if($viewonly){?>
                <p>This note can only be read once and it's deleted after your reading!</p>
                <?php } ?>
            </div>
        </div>
    </div>

    <div class="mask" id="mask">
        <div class="box" id="box">
            <div class="mask-box share" id="mask-share">
                <h2>SHARE</h2>
                <p>What do you want to copy?</p>
                <p><a href="javascript:copyTo('url');">Note Url</a>
                    <p></p>
                    <p><a href="javascript:copyTo('content');">Note Content</a></p>
                    <h2>DOWNLOAD</h2>
                    <p><a href="javascript:downloadNote();">DOWNLOAD</a></p>
            </div>

            <div class="mask-box password" id="mask-password">
                <h2>SET READ ONCE AND PASSWORD</h2>
                <?php if(!$viewonly){?>
                <div style="border:1px solid #515151; width:90%;margin:0 auto; background:#515151;">
                    <p><input type='password' id="notepwd" disabled="disabled" name='password' /></p>

                    <p><input type="checkbox" id="notevo" disabled="disabled" name='viewonly' />
                        <label for="notevo">View Only</label></p>

                    <p><input type='submit' id="setpassword" disabled="disabled" onclick="uploadContent(true);"
                            value=' × Set Password ' />
                    </p>
                    <div style="color:red;font-weight:bolder;"> ↑ INCOMPLETE ↑ </div>
                </div>
                <div style="color:red;font-weight:bolder;"> ↓ COMPLETED ↓ </div>
                <br /><br />
                <input id="readonce" type="checkbox" name='readonce' onclick="uploadContent(true);"
                    <?php echo $isreadonce;?> />
                <label for="readonce">Read Only Once</label>
                <?php }else{ ?>
                This note can only be read once!
                <?php } ?>
            </div>

            <div class="mask-box history" id="mask-history">
                <h2>HISTORY</h2>
                <p>Display the last 10 records, and stored in the browser's localStorage. <a
                        href="javascript:clearHistory();">Clear History</a></p>
                <div></div>
            </div>
            <div class="mask-box qrcode" id="mask-qrcode">
                <h2>QRCODE</h2>
                <p><a onclick="showQRCode('url');">url</a> or <a onclick="showQRCode('content');">content</a></p>
                <div id="qrcode"></div>
            </div>
        </div>
    </div>
    <div class="copyright">@NOTE.MK</div>
    <script src="<?php echo $base_url; ?>/scripts.min.js"></script>
</body>

</html>