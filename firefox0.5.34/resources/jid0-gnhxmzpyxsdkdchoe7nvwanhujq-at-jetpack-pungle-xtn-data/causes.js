var causeID;

$("#pot").click(function () {
    causeID = 0;
    self.port.emit('cause', causeID);
    alert('You\'re now supporting Potable Water!');
});

$("#tec").click(function () {
    causeID = 1;
    self.port.emit('cause', causeID);
    alert('You\'re now supporting Technology!');
});

$("#nat").click(function () {
    causeID = 2;
    self.port.emit('cause', causeID);
    alert('You\'re now supporting Nature!');
});

$("#edu").click(function () {
    causeID = 3;
    self.port.emit('cause', causeID);
    alert('You\'re now supporting Education!');
});

$("#cle").click(function () {
    causeID = 4;
    self.port.emit('cause', causeID);
    alert('You\'re now supporting Clean Energy!');
});