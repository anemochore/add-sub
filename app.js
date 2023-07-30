//ex: https://sub.vxdn.net/sub/11467-1.vtt
if(!J_ID) J_ID = 'player';  //you may edit this in-console

const j = jwplayer(J_ID);
//const orgVttUrl = j.getConfig().captionsTrack.file;

const orgSetup = j.getConfig();
const tracks = orgSetup.playlist[0].tracks;

var data = 
`WEBVTT

00:32.366 --> 00:33.366
한글 테스트`
.split('\n');
const newVttUrl = getFileUrl_(data);

tracks.push({
  kind: 'captions',
  file: 'https://www.dropbox.com/s/3faayxpxuti05fw/11467-2.vtt?dl=1',
  label: 'Korean2',
});

j.setup(orgSetup);

function getFileUrl_(data) {
  //https://stackoverflow.com/a/32295448/6153990
  var properties = {type: 'text/vtt'};
  var file;
  try {
    // Specify the filename using the File constructor, but ...
    file = new File(data, "Korean.vtt", properties);
  } catch (e) {
    // ... fall back to the Blob constructor if that isn't supported.
    file = new Blob(data, properties);
  }
  var url = URL.createObjectURL(file);
  return url;
}