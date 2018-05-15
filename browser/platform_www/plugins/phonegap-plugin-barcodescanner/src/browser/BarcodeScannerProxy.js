cordova.define("phonegap-plugin-barcodescanner.BarcodeScannerProxy", function(require, exports, module) { function startScan(deviceId, videoOutputElementId, success, error) {
    var library = cordova.require("phonegap-plugin-barcodescanner.Library");
    var codeReader = new library.BrowserBarcodeReader();
    console.log(codeReader);
    codeReader.getVideoInputDevices().then((videoInputDevices) => {

        if(!videoInputDevices[deviceId]) {
            //Defaulting to 0 if device not found
            deviceId = 0;
        }
        codeReader.decodeFromInputVideoDevice(videoInputDevices[deviceId].deviceId, videoOutputElementId).then(function (res) {
            var result = {
                text: res.getText(),
                format: res.getBarcodeFormat(),
                cancelled: false
            };
            success(result);
            codeReader.reset();
        }).catch(function (err) {
            error(err);
            codeReader.reset();
        });
        console.log('Started continous decode from camera with id ' + deviceId);

    }).catch((err) => {
        error(err);
    });
}

function scan(success, error) {
    var videoElement = document.getElementById("barcodeScanStream");
    if(videoElement){
        deviceId = document.getElementById("barcodeScanDevice").value;
        if (deviceId) {
            startScan(deviceId, videoElement, success, error);
        }
        else {
            startScan(1, videoElement, success, error);
        }
    }
    else {
        var code = window.prompt("Enter barcode value (empty value will fire the error handler):");
        if (code) {
            var result = {
                text: code,
                format: "Fake",
                cancelled: false
            };
            success(result);
        } else {
            error("No barcode");
        }
    }
}

function encode(type, data, success, errorCallback) {
    success();
}

module.exports = {
    startScan: startScan,
    scan: scan,
    encode: encode
};
require("cordova/exec/proxy").add("BarcodeScanner",module.exports);

});
