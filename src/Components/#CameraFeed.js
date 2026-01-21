import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';


export class CameraFeed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
    /**
     * Processes available devices and identifies one by the label
     * @memberof CameraFeed
     * @instance
     */
    async getPermission(devices){
        const { deviceId } = devices;
        // alert(JSON.stringify(devices));
        await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId:deviceId, facingMode: "environment" } }).then((stream)=>{
            devices.forEach(device => {
                // alert(device.kind);
               // alert(device.deviceId);
               let kindposition = device.kind.search("video");
            //    alert(kindposition);
            //    alert(JSON.stringify(device));
               if (kindposition >= 0) {
                   // alert(this.state.count);
                   this.setState({ count: this.state.count + 1 })
                   // alert(this.state.count);
                   //let position = device.deviceId.search("d49526");
                   if (isMobile) {
                    //    alert('label-'+device.label);
                       let position = (device.label.includes("facing back")) || (device.label.includes("Back Camera"));
                       if (position) {
                            // alert('inner'+device.label);
                            this.videoPlayer.srcObject = stream
                            this.videoPlayer.play()
                        //    this.setDevice(device);
                       }
                   }
                   else {
                       this.setDevice(device);
                   }
               }
           });
        }).catch((error)=>{
            this.getPermission(devices);
            // alert('device-'+JSON.stringify(error))
        })
    }

    processDevices(devices) {

        this.getPermission(devices);

        // devices.forEach(device => {
        //      alert(device.kind);
        //     // alert(device.deviceId);
        //     let kindposition = device.kind.search("video");
        //     alert(kindposition);
        //     alert(JSON.stringify(device));
        //     if (kindposition >= 0) {
        //         // alert(this.state.count);
        //         // this.setState({ count: this.state.count + 1 })
        //         // alert(this.state.count);
        //         //let position = device.deviceId.search("d49526");
        //         if (isMobile) {
        //             alert(device);
        //             let position = device.label.search("facing back");
        //             if (position > 0) {
        //                 alert('inner'+device.label);
        //                 this.setDevice(device);
        //             }
        //         }
        //         else {
        //             this.setDevice(device);
        //             alert('not found');
        //         }
        //     }




        // });
    }

    /**
     * Sets the active device and starts playing the feed
     * @memberof CameraFeed
     * @instance
     */
    async setDevice(device) {
        const { deviceId } = device;
        // const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } });
        // this.videoPlayer.srcObject = stream;
        // this.videoPlayer.play();
        
        await navigator.mediaDevices.getUserMedia({ audio: false, video: { deviceId } }).then((stream)=>{
            this.videoPlayer.srcObject = stream
            this.videoPlayer.play()
        }).catch((error)=>{alert(JSON.stringify(error))})
    }

    /**
     * On mount, grab the users connected devices and process them
     * @memberof CameraFeed
     * @instance
     * @override
     */
    async componentDidMount() {
        await navigator.mediaDevices.enumerateDevices().then((devices) => {
            this.processDevices(devices);
        }).catch((err) => {
            console.error(`error -${err}`);
        });
    }

    /**
     * Handles taking a still image from the video feed on the camera
     * @memberof CameraFeed
     * @instance
     */
    takePhoto = () => {
        const { sendFile } = this.props;
        const context = this.canvas.getContext('2d');
        
        if (isMobile) {
            context.drawImage(this.videoPlayer, 0, 0, 480, 350);
        }
        else {
            context.drawImage(this.videoPlayer, 0, 0, 480, 350);
        }
        this.canvas.toBlob(sendFile);
    };

    render() {
        return (
            <div className="c-camera-feed">
                <div className="c-camera-feed__viewer">
                    <video ref={ref => (this.videoPlayer = ref)} width="448" heigh="200" />
                </div>
                <div className="text-center">
                <button type='button' className='btn btn-primary mt-32' onClick={this.takePhoto}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
                        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                    </svg>
                </button>
                </div>
                <div className="c-camera-feed__stage mt-32">
                    <canvas style={{ background:'#000', marginLeft:'40px' }} width="448" height="350" ref={ref => (this.canvas = ref)} />
                </div>
            </div>
        );
    }
}
