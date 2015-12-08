io = io.connect()

$('.btn-capture').on('click', function(){
    var msg = {};
    msg.width = $("input[name=view]:checked").val();
    msg.urls = $("#urls").val();
    msg.quality = $("#quality").val();
    io.emit('capture', msg);
    loading();
});

io.on('done', function(data) {
    window.location.href = '/screenshot/' + data.message;
});

io.on('single', function(data) {
    if (data.current){
        updateStatus(data.current, data.total);
    }
});

function loading(){
    $('.screenshots, .loading, .recent').toggleClass('hidden');
}

function updateStatus(current, total){
    var msg = current + " of " + total;
    console.log(msg);
    $('.status').html(msg);
}
