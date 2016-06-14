var fs = require('fs');
var mingling = require('child_process');
var files = fs.readdirSync('./MP3/');
var result = [];
var format_duration = function(str){
  var num = Number(str);//转换为数字类型
  var fen = parseInt( num/60 );
  var miao = Math.round(num%60);
  miao = (miao < 10)?( '0' + miao):miao;
  fen = '0' + fen;
  return  fen + ':' + miao;
}

files.forEach(function(v){
	var data = JSON.parse( mingling.execSync('ffprobe -v quiet -print_format json   -show_format  "./MP3/'+ v+'"'));

// var data = mingling.execSync("ffprobe -v quiet -print_format json -show_format ./MP3/"+v);
var duration = format_duration(data.format.duration);

  var r = {
    filename: data.format.filename,
    duration: duration,
    title: data.format.tags.title,
    album: data.format.tags.album,
    artist: data.format.tags.artist
  };
  result.push( r );
})
fs.writeFile('database.json',JSON.stringify(result,null,2));


