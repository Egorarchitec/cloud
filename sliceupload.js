function uploadfile() {
    var file = document.getElementById('file').files[0];

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

    if (size < chunksize) { //does not slice, just upload whole file
        xhr.open('POST', 'singlefileupload.php', true);
        formdata.append('file', file);
        xhr.send(formdata);
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
            i++;
        }
        chunks = chunks.reverse();
        chunknames = chunknames.reverse();
    }
    for (index = 0; index <= chunkammount; index++) {
        phpsend(chunknames[index], chunks[index], file, chunkammount);        
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

var ajaxReqs = 0;
var ajaxQueue = [];
var ajaxActive = 0;
var ajaxMaxConc = 1;

function addAjax(obj) { //thanks to Terrance for sharing that code https://gist.github.com/Terrance/158a4c436baa64c4324803467844b00f
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
