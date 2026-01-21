import { useState } from 'react';


function IpCheck() {

  const [ipaddress, setIpaddress] = useState(null);
  if (ipaddress !== null)
    alert(ipaddress);

  const uploadImage = async file => {
    const formData = new FormData();
    formData.append('file', file);

    // Connect to a seaweedfs instance
  };
  navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem;
    var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    return M;
  })();

  var browser_version = navigator.sayswho;
  alert(browser_version);
  // window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
  // var pc = new RTCPeerConnection({ iceServers: [] }), noop = function () { };
  // pc.createDataChannel("");    //create a bogus data channel
  // pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
  // pc.onicecandidate = function (ice) {  //listen for candidate events
  //   if (!ice || !ice.candidate || !ice.candidate.candidate) return;
  //   var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
  //   setIpaddress(myIP);
  //   pc.onicecandidate = noop;
  // };

  function getIPs(callback){
    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;
    //bypass naive webrtc blocking using an iframe
    // if(!RTCPeerConnection){
    //     //NOTE: you need to have an iframe in the page right above the script tag
    //     //
    //     //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
    //     //<script>...getIPs called in here...
    //     //
    //     var win = iframe.contentWindow;
    //     RTCPeerConnection = win.RTCPeerConnection
    //         || win.mozRTCPeerConnection
    //         || win.webkitRTCPeerConnection;
    //     useWebKit = !!win.webkitRTCPeerConnection;
    // }
    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };
    var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);
    function handleCandidate(candidate){
        //match just the IP address


        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1];
        //remove duplicates
        if(ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }
    //listen for candidate events
    pc.onicecandidate = function(ice){
        //skip non-candidate events
        if(ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };
    //create a bogus data channel
    pc.createDataChannel("");
    //create an offer sdp
    pc.createOffer(function(result){
        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});
    }, function(){});
    //wait for a while to let everything done
    setTimeout(function(){
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');
        lines.forEach(function(line){
            if(line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 1000);
}
//log IP addresses
  // getIPs(function(ip){
  //     //local IPs
  //     if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/))
  //         console.log("Local IPs: "+ip);
  //     //IPv6 addresses
  //     else if (ip.match(/^[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7}$/))
  //         console.log("IPv6 Addresses: "+ip);
  //     //assume the rest are public IPs
  //     else
  //         console.log("Public IPs: "+ip);
  // });

  return (
    <div>
      <h2>Let's get started!</h2>
      <div className="App">
        <h1>Image capture test</h1>
        <p>Capture image from USB webcamera and upload to form</p>
        {/* <CameraFeed sendFile={uploadImage} /> */}
      </div>
    </div>
  );
}

export default IpCheck;
