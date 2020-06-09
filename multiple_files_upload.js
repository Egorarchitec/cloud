function uploadfiles() { //handles the multiple files uploading
    var files = new Array;
    var i = 0;


    // load files

    while (document.getElementById('files').files[i] instanceof Blob) {
        console.log(i);
        file = document.getElementById('files').files[i];
        files.push(file);
        i++;
        console.log(file);
    }
    console.log(files);
    console.log(files.length);

    i = 0;
    while (i < files.length){
        uploadfile_multiple(files[i]);
        console.log('uploaded: ' + files[i]);
        i++;
    }


}

function uploadfile_multiple(file) { //handles uploading itslef including slicing

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
        while (i <= chunkammount) {
            offset = i * chunksize;
            chunkname = name + '_' + i;
            chunk = file.slice(offset, offset + chunksize);
            chunks.push(chunk);
            chunknames.push(chunkname);
            if (chunk.size == 0) {
                chunks.pop();
                chunknames.pop();
            }
            console.log("chunkname" + chunkname);
            console.log("size" + chunk.size);
            i++;
        }
        console.log(i + ';' + chunks.length);
        chunks = chunks.reverse();
        chunknames = chunknames.reverse();
        console.log(chunks);
        console.log(chunknames);
    }
    for (index = 0; index <= chunkammount; index++) {
        phpsend(chunknames[index], chunks[index], file, chunkammount);
        console.log(chunks[index]);
        console.log(chunknames[index]);
        console.log("index" + index);
        console.log("jsem na konci")
    }
}




function phpsend(chunkname, chunk, file, chunkammount) {

    var formdata = new FormData;
    formdata.append('name', file.name);
    formdata.append('chunkname', chunkname);
    formdata.append('file', chunk);
    formdata.append('chunkammount', chunkammount);
    addAjax({
        url: 'sliceupload.php',
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
        success: function () {
        },
    });
}


//thanks to Terrance for sharing addAjax to reduce concurent threads https://gist.github.com/Terrance/158a4c436baa64c4324803467844b00f
// used in order to maintain oreder of uploaded files

var ajaxReqs = 0;
var ajaxQueue = [];
var ajaxActive = 0;
var ajaxMaxConc = 1;  //number of parallel threads

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
