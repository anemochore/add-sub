(() => {
  const video = document.querySelector('video');
  if(!video && document.querySelector('iframe')) {
    alert('iframe 안에서 실행해주세요.')
    return;
  }

  //load subtitles from user input
  const i = document.createElement('input');
  i.type = 'file', i.name = 'inputfile', i.id = 'inputfile';
  i.style.position = 'absolute', i.style.zIndex = '9999';
  i.setAttribute('onchange', 'entry(this)');

  const targetEl = document.querySelector('main') || document.querySelector('div') || document.body.firstChild;
  targetEl.insertBefore(i, targetEl.firstChild);
})();

function entry(el) {
  const file = el.files[0];
  const fr = new FileReader();
  fr.readAsText(file);
  fr.onload = async (e) => {
    const ext = file.name.split('.').pop();
    let vtt = fr.result;
    if(ext == 'smi' && !vtt.startsWith('<SAMI>')) {
      //quick fix for subsrt. redundant <BODY> tags is no problem.
      vtt = '<SAMI><BODY>' + vtt + '</BODY></SAMI>';
    }
    if(ext != 'vtt') vtt = await sub2vtt(vtt);
    //console.debug(vtt);

    const video = document.querySelector('video');
    const track = video.addTextTrack("subtitles", "Korean", "ko");  //assuming Korean
    track.mode = "showing";

    const cues = quick_and_dirty_vtt_or_srt_parser(vtt);
    cues.forEach(cue => {
      track.addCue(cue);
    });

    console.debug('sub loaded. now hiding file select box');
    const i = document.querySelector('#inputfile');
    i.style.display = 'none';

    //console.debug(track.cues);
  };
}

  /*
  //jwplayer의 경우
  tracks.push({
    data: [new VTTCue(30, 31, '한글 <i>테스트</i>2'), new VTTCue(32, 33, '한글 테스트222')],  //italics seems not working either
    kind: 'captions',
    file: newVttUrl,  //file (or blob to) url not working. so put it anything here.
    label: 'Korean_i',
  });

  j.setup(orgSetup);
  */

async function sub2vtt(subLines) {
  //convert to vtt using https://github.com/papnkukn/subsrt
  if(!window.require)
    await loadScript('https://anemochore.github.io/add-sub/lib/subsrt.bundle_fy.js');
  const subsrt = require("subsrt");
  const vtt = subsrt.convert(subLines, { format: 'vtt'});
  return vtt;
}

async function loadScript(url) {
  const response = await fetch(url);
  const txt = await response.text();

  let se = document.createElement('script');
  se.type = 'text/javascript';
  se.text = txt;
  document.getElementsByTagName('head')[0].appendChild(se);
}

function quick_and_dirty_vtt_or_srt_parser(vtt) {
  //modified https://gist.github.com/Delnegend/4a5e1ebf5b59ca1b2a07bd4f55e13cf6
  var lines = vtt.trim().replace('\r\n', '\n').replace('\r', '\n').split(/\n/).map(function(line) {
    return line.trim();
  });
  var cues = [];
  var start = null;
  var end = null;
  var payload = null;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('-->') >= 0) {
      var splitted = lines[i].split(/[ \t]+-->[ \t]+/);
      if (splitted.length != 2) {
        throw 'Error when splitting "-->": ' + lines[i];
      }

      // Already ignoring anything past the "end" timestamp (i.e. cue settings).
      start = parse_timestamp(splitted[0]);
      end = parse_timestamp(splitted[1]);
    } else if (lines[i] == '') {
      if (start && end) {
        //console.debug(payload);
        var cue = new VTTCue(start, end, payload);
        cues.push(cue);
        start = null;
        end = null;
        payload = null;
      }
    } else if(start && end) {
      if (payload == null) {
        payload = lines[i];
      } else {
        payload += '\n' + lines[i];
      }
    }
  }
  if (start && end) {
    var cue = new VTTCue(start, end, payload);
    cues.push(cue);
  }

  return cues;

  function parse_timestamp(s) {
    //var match = s.match(/^(?:([0-9]{2,}):)?([0-5][0-9]):([0-5][0-9][.,][0-9]{0,3})/);
    // Relaxing the timestamp format:
    var match = s.match(/^(?:([0-9]+):)?([0-5][0-9]):([0-5][0-9](?:[.,][0-9]{0,3})?)/);
    if (match == null) {
      throw 'Invalid timestamp format: ' + s;
    }
    var hours = parseInt(match[1] || "0", 10);
    var minutes = parseInt(match[2], 10);
    var seconds = parseFloat(match[3].replace(',', '.'));
    return seconds + 60 * minutes + 60 * 60 * hours;
  }
}