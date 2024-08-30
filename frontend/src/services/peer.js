class PeerService {
    constructor() {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
    }
  
    async getAnswer(offer) {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(new RTCSessionDescription(ans));
        return ans;
      }
    }
    async addTracks(stream){
      if (this.peer && stream) {
        stream.getTracks().forEach(track => {
          const senders = this.peer.getSenders();
          const trackAlreadyAdded = senders.some(sender => sender.track === track);
          if (!trackAlreadyAdded) {
            this.peer.addTrack(track,stream);
          }
        });
      }
    }
    async setLocalDescription(ans) {
     try{
      if (this.peer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
     }
     catch(err){
      console.log('error encounter setting answer ',err)
     }
    }
  
    async getOffer() {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
      }
    }
  }
  
  export default new PeerService();
  