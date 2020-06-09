function uploadfiles() {

    var files = new Array;
    var i = 0;


    // load files

    while (document.getElementById('files').files[i] instanceof Blob) {
        file = document.getElementById('files').files[i];
        files.push(file);
        i++;
    }

    i = 0;
    while (i < files.length) {
        uploadfile_multiple(files[i]);
        i++;
    }


}

function uploadfile_multiple(file) {

    var xhr = new XMLHttpRequest;
    var formdata = new FormData;
    console.log(file);
    var name = file.name;
    var size = file.size;
    var chunksize = 10485760;
    var i = 0;
    var chunkname = '';
    var chunk = new Blob;
    var chunkammount = Math.ceil(size / chunksize);
    console.log(chunkammount);
    var chunks = new Array;
    var chunknames = new Array;
    var offset = 0;

    if (size < chunksize) {
        xhr.open('POST', 'singlefileupload.php', true);
        formdata.append('file', file);
        xhr.send(formdata);
        console.log('sent small file');

    } else {
        end = chunksize;
        while (i != chunkammount) {
            offset = i * chunksize;
            chunkname = name + '_' + i;
            chunk = file.slice(offset, offset + chunksize);
            chunks.push(chunk);
            chunknames.push(chunkname);
            console.log("chunkname" + chunkname);
            console.log("size" + chunk.size);
            i++;
        }
    }
    var index = 0;
    sendarray(index, chunkammount, chunknames, chunks, file);

}

function sendarray(i, chunkammount, chunknames, chunks, file) {
    while (i != chunkammount) {
        phpsend(chunknames[i], chunks[i], file, chunkammount, i);
        console.log(chunks[i]);
        console.log(chunknames[i]);
        console.log("index" + i);
        console.log("jsem na konci");
        i++;
    }
}

function repeateonce(i, chunkammount, chunknames, chunks, file) {

    phpsend(chunknames[i], chunks[i], file, chunkammount, i);
    console.log(chunks[i]);
    console.log(chunknames[i]);
    console.log("index" + i);
    console.log("jsem na konci");

}

var successcounter = 0;
var errcounter = 0;

function phpsend(chunkname, chunk, file, chunkammount, index) {
    console.log('done ' + successcounter);
    console.log('errors ' + errcounter);
    var formdata = new FormData;
    formdata.append('name', file.name);
    formdata.append('chunkname', chunkname);
    formdata.append('file', chunk);
    formdata.append('chunkammount', chunkammount);
    formdata.append('index', index);
    formdata.append('size', file.size);
    addAjax({
        url: 'sliceupload.php',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        complete: function () {

        },
        success: function () {

            successcounter++;
            errcounter = 0;
            if (successcounter == index + 1) {
                $('.errorlog').text('Looking good');
            }
            if (successcounter == chunkammount) {
                $('.errorlog').text('SUCCESS');
            }
        },
        error: function () {
            if (errcounter > 0) {
                $('.errorlog').text('something went wrong');
            }
            errcounter++;
            setTimeout(repeateonce(successcounter, chunkammount, chunkname, chunk, file), 1000);
        },
    });
}





var ajaxReqs = 0;
var ajaxQueue = [];
var ajaxActive = 0;
var ajaxMaxConc = 1;

function addAjax(obj) {
    ajaxReqs++;
    var oldSuccess = obj.success;
    var oldError = obj.error;
    var callback = function () {
        ajaxReqs--;
        if (ajaxActive === ajaxMaxConc) {
            $.ajax(ajaxQueue.shift());
        } else {
            ajaxActive--;
        }
    }
    obj.success = function (resp, xhr, status) {
        callback();
        if (oldSuccess) oldSuccess(resp, xhr, status);
    };
    obj.error = function (xhr, status, error) {
        callback();
        if (oldError) oldError(xhr, status, error);
    };
    if (ajaxActive === ajaxMaxConc) {
        ajaxQueue.push(obj);
    } else {
        ajaxActive++;
        $.ajax(obj);
    }
}