function g(id) {
    return document.getElementById(id);
}

/** Reset Note */
function resetNote(o) {
    let b = confirm("RESET THIS NOTE?");
    if (b == true) {
        o.value = "";
        o.rows = 20;
        line(o.rows);
        uploadContent();
    }
}

/** New Note */
function newNote(o) {
    let b = confirm("NEW NOTE?");
    if (b == true) {
        let a = window.location.href;
        window.location.href = a.substring(0, a.lastIndexOf("/"));
    }
}

/** Download Content */
function downloadNote() {
    let b = document.createElement("a");
    let a = g("content").value ? g("content").value : g("content").innerHTML;
    let regex = /data:(\w+\/.*?);base64,/g;
    if (regex.test(a)) {
        let fileblob = blobToFile(dataURLtoBlob(a))

        var fileext;
        switch (fileblob.type) {
            case "image/jpeg":
                fileext = ".jpg"
                break;
            case "image/png":
                fileext = ".png"
                break;
            case "image/gif":
                fileext = ".gif"
                break;
            case "image/svg+xml":
                fileext = ".svg"
                break;
            case "application/pdf":
                fileext = ".pdf"
                break;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                fileext = ".xlsx"
                break;
            case "application/vnd.ms-excel":
                fileext = ".xls"
                break;
            case "application/msword":
                fileext = ".doc"
                break;
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                fileext = ".docx"
                break;
            case "text/plain":
                fileext = ".txt"
                break;
            case "text/html":
                fileext = ".html"
                break;
            default:
                fileext = ".unknow"
                break;
        }
        b.href = window.URL.createObjectURL(fileblob);
    } else {
        fileext = ".txt";
        b.href = "data:application/txt," + encodeURIComponent(a);
    }
    b.download = "note.mk_" + document.title + fileext;
    b.dispatchEvent(new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
    }))
}

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

/** Line Number */
function line(num) {
    num = num ? num : g("content").getAttribute('rows');

    let string = "";
    for (let n = 1; n < num / 1 + 1; n++) {
        string += "<li></li>";
    }
    g("line").innerHTML = string;
}

function autoAreatext() {
    g("content").addEventListener("input", function (e) {
        this.a = 336;
        let a = this.getAttribute("data-min-rows") | 0;
        this.rows = a;
        this.rows = a + Math.ceil((this.scrollHeight - this.a) / 16);
        line(this.rows)
    }, false);
}

var textarea = g('content');
var content = textarea.value;

function getDropFileCallBack(dropFiles) {}

textarea.addEventListener("dragenter", function (e) {
    e.preventDefault();
    e.stopPropagation();
}, false);

textarea.addEventListener("dragover", function (e) {
    e.dataTransfer.dropEffect = 'copy';
    e.preventDefault();
    e.stopPropagation();
}, false);

textarea.addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
}, false);


textarea.addEventListener("drop", function (h) {
    function e() {
        l === m - 1 && getDropFileCallBack(f);
        l++
    }
    let b = new FileReader;
    b.onload = function (c) {
        textarea.value = c.target.result;
        document.body.classList.remove("empty");
        g("readonce").checked = "checked";
        setTimeout(uploadContent, 3000)
    };
    b.readAsDataURL(event.dataTransfer.files[0]);
    event.preventDefault();
    b = h.dataTransfer;
    let f = [],
        l = 0,
        m = b.files.length;
    if (void 0 !== b.items)
        for (let d = 0; d < b.items.length; d++) {
            let a = b.items[d];
            "file" === a.kind && a.webkitGetAsEntry().isFile &&
                (f.push(a.getAsFile()), e())
        } else {
            a = {};
            for (let k = 0; k < m; a = {
                    a: a.a
                }, k++)
                if (a.a = b.files[k], a.a.type) f.push(a.a), e();
                else try {
                    d = new FileReader, d.readAsDataURL(a.a.slice(0, 3)), d.addEventListener("load", function (c) {
                        return function (n) {
                            console.log(n, "load");
                            f.push(c.a);
                            e()
                        }
                    }(a), false), d.addEventListener("error", function (c) {
                        console.log(c, "error");
                        e()
                    }, false)
                } catch (c) {
                    console.log(c, "catch error"), e()
                }
        }
    h.preventDefault();
    h.stopPropagation()
}, false);

/** Mask Layout */
function maskInit() {
    for (var b = document.querySelectorAll(".alink"), c = document.querySelectorAll(".mask-box"), d = document.getElementById("mask"), e = 0; e < b.length; e++) b[e].addEventListener("click", function (a) {
        d.style.display = "block";
        (a = a || window.event) || a.stopPropagation() ? a.stopPropagation() : a.cancelBubble = true
    });
    d.onclick = function (a) {
        a = a || window.event;
        "mask" == (a.target ? a.target : a.srcElement).id && (d.style.display = "none")
    };
    for (let f = 0; f < b.length; f++) b[f].addEventListener("click", function () {
        for (let a = 0; a < c.length; a++) {
            c[a].style.display = "none";
            let h = this.id.replace("a-", "");
            g("mask-" + h).style.display = "block"
        }
    });
}

/** COPY */
function copyTo(b) {
    let a = document.createElement("textarea");
    a.value = "url" == b ? window.location.href : "div" == g("content").nodeName.toLowerCase() ? g("content").innerText : g("content").value;
    document.body.appendChild(a);
    a.select();
    document.execCommand("copy");
    document.body.removeChild(a)
};


/** History */
function history() {
    window.localStorage || console.log("This browser does NOT support localStorage");
    let storage = window.localStorage,
        note_arr = [],
        noteroot = window.location.hostname + ":" + location.port,
        noteurl = window.location.pathname;
    storage.getItem("note_arr") ? (note_arr = JSON.parse(storage.getItem("note_arr")), note_arr.includes(noteurl) || note_arr.push(noteurl), 10 < note_arr.length && note_arr.shift()) : note_arr.push(noteurl);
    storage.setItem("note_arr", JSON.stringify(note_arr));
    let historyhtml = "<ul>";
    JSON.parse(storage.getItem("note_arr")).forEach(function (e) {
        historyhtml += "<li><a href='//" + noteroot + e + "'>" + e + "</a></li>"
    });
    historyhtml += "</ul>";
    g("mask-history").lastElementChild.innerHTML = historyhtml;
}

function clearHistory() {
    let storage = window.localStorage;
    storage.setItem("note_arr", "");
    g("mask-history").lastElementChild.innerHTML = "";
}


/** QR CODE */
var loadqrc = false;

function loadQR() {
    loadqrc = loadJS("qrc", "qrcode.min.js");
}

function showQRCode(s) {
    let qrc = "";

    let qr = g("qrcode");
    qr.innerHTML = "";
    if (loadqrc) {
        let qrcode = new QRCode(qr, {
            width: 270,
            height: 270
        });
        if (s == "url") {
            qrc = window.location.href;
        } else {
            qrc = g("content").value;
        }
        qrcode.makeCode(qrc);
    }
}


function loadJS(id, url) {
    let xmlHttp = null;
    if (window.ActiveXObject) //IE
    {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    if (xmlHttp.readyState == 4) {
        if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 0 || xmlHttp.status == 304) {
            let myHead = document.getElementsByTagName("HEAD").item(0);
            let myScript = document.createElement("script");
            myScript.language = "javascript";
            myScript.type = "text/javascript";
            myScript.id = id;
            try {
                // =<IE8
                myScript.appendChild(document.createTextNode(xmlHttp.responseText));
            } catch (ex) {
                myScript.text = xmlHttp.responseText;
            }
            myHead.appendChild(myScript);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


var myEvent = document.createEvent('Event');

myEvent.initEvent('input', true, true);

function addEvent(element, evnt, funct) {
    if (element.attachEvent) // IE < 9
        return element.attachEvent('on' + evnt, funct);
    else
        return element.addEventListener(evnt, funct, false);
}

addEvent(g("content"), "input", function () {
    let f = (new Date).getTime() / 1000,
        d = g("readonce").checked,
        c = g("notepwd").value,
        a = g("notevo").checked;
    d = d ? "&readonce=" + d : "";
    c = c ? "&password=" + c : "";
    a = a ? c + "&view=true" : c;
    g("notepwd").value = "";
    let e = textarea.value,
        b = new XMLHttpRequest;
    b.open("POST", window.location.href, true);
    b.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    b.onload = function () {
        4 === b.readyState && (content = e, g("content").setAttribute("date-last-saved", f))
    };
    b.onerror =
        function (h) {
            console.log(h);
            setTimeout(uploadContent, 1000)
        };
    b.send("text=" + encodeURIComponent(e) + d + a);
    a = g("saved");
    "hide" == a.getAttribute("class") && (a.setAttribute("class", "show"), setTimeout(function () {
        g("saved").setAttribute("class", "hide")
    }, 3000))
});

/** Upload Content */
function uploadContent() {
    g("content").dispatchEvent(myEvent);
}

/** Last Saved */
function lastSaved() {
    let result = g("content").getAttribute('date-last-saved');
    g("ago").innerHTML = "Last Saved: " + ago(result) + ' ago';
}

/** Ago */
function ago(t) {
    t = 0 | (Date.now() / 1000 - t);
    let unit, length = {
            second: 60,
            minute: 60,
            hour: 24,
            day: 7,
            week: 4.35,
            month: 12,
            year: 10000
        },
        result;

    for (unit in length) {
        result = t % length[unit];
        if (!(t = 0 | t / length[unit]))
            return result + ' ' + (result - 1 ? unit + 's' : unit);
    }
}

/** init */
maskInit();
history();
autoAreatext();
line(g("content").rows);
textarea.focus();
setInterval(lastSaved, 1000);