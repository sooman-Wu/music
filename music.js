$(function(){
	// var database=[
      // {name:"匆匆那年",author:'王菲',src:'MP3/匆匆那年.mp3',duration:'4.01'},
      // 	{name:"如果我变成回忆",author:'Tank',src:'MP3/如果我变成回忆.mp3',duration:'3.01'},
      // 	{name:"if you",author:'big bang',src:'MP3/you.mp3',duration:'3.01'},
      //   {name:"演员",author:'薛之谦',src:'MP3/演员.mp3',duration:'4.01'},
      //   {name:"Bang Bang Bang",author:'big bang',src:'MP3/bang.mp3',duration:'3.01'},
      // ]
  // 创建列表
    var makelist = function(){
      $.each(database,function(k,v){
          var li=$('<li>');
      $('.cc').append(li);
      li.html('<span class="music_name ge" title="'+v.title+'">'+v.title+'</span><span class="singer_name ge" title="'+v.artist+'">'+v.artist+'</span> <span class="play_time ge">'+v.duration+'</span> <div class="list_cp">  <strong class="btn_like" title="喜欢" name=""></strong>   <strong class="btn_share" title="分享"> </strong>  <strong class="btn_fav" title="收藏到歌单"> </strong>  <strong class="btn_del" title="从列表中删除"></strong> </div>');
        $('.open_list span').text(database.length);

      })
    } 
    // 获取歌曲
    var database=[];
    $.getJSON('./database.json').done(function(data){
      // console.log(data)
      database=data;
      makelist();
    })








	// 点击播放/暂停
	var audio=$('audio').get(0);
		$('#bntplay').on('click',function(){
			if(audio.paused){
				audio.play();
			}
			else{
				audio.pause();
			}
		})
		// 界面操作
		$(audio).on('play',function(){
			$('#bntplay').removeClass("play_bt").addClass('pause_bt');
		})
		$(audio).on('pause',function(){
			$('#bntplay').removeClass("pause_bt").addClass('play_bt');
		})
   // 音量控制
   $('.jindu').on('click',function(e){
   		audio.volume=e.offsetX/$(this).width();
   })
   // 界面操作
   $(audio).on('volumechange',function(){
   	// 喇叭的界面
   	if(audio.volume===0){
   		$('#spanmute').addClass('laba2');
   	}else{
   		$('#spanmute').removeClass('laba2');
   	}
   	// 音量的界面
   	var left=audio.volume.toFixed(2)*100+'%';
   	$('.jindu').find('.jindu_yuan').css('left',left);
   	$('.jindu').find('.jindu_left').css('width',left);
   })
   // 静音
   var yuanlai;
   $('#spanmute').on('click',function(){
   	if(audio.volume===0){
   		audio.volume=yuanlai;
   	}else{
   		yuanlai=audio.volume;
   		audio.volume=0;
   	}
   })
   // 进度条
   $(audio).on('timeupdate',function(){
	var width=(this.currentTime/this.duration).toFixed(2)*100+"%";
    $('.jindu_op').css('left',width);
    $('.play_jindu_bar').css('width',width);
   })
   // 设置播放时长
   $('.player_bar').on('click',function(e){
   	audio.currentTime=audio.duration*e.offsetX/$(this).width();
   })
   // 鼠标拖动
   // $('.jindu_op').on('mousedown',function(e){
   // 	audio.pause();
   //    var t = e.offsetX /$(this).width();
   //    if( t >= 0 && t<=1 ){ audio.currentTime = audio.duration*t;}
   //  })
   // $('.player_bar').on('mouseup',function(e){
   //    audio.play();
   //  })
   //  
   
  
   // 点击单曲播放
   $('.single_list').on('click','li',function(){
    currentsong=$(this).index();
   	$('#music_name').html(database[$(this).index()].title);
   	$('#singer_name').html(database[$(this).index()].artist);
   	$('#ptime').html(database[$(this).index()].duration);
   	$('.single_list li').removeClass('play_current');
   	$(this).addClass('play_current');
   	audio.src=database[$(this).index()].filename;
   	audio.play();
   })
   // 上一首和下一首
   var currentsong=0;
   var onsongchange=function(){
   	$('#music_name').html(database[currentsong].title);
   	$('#singer_name').html(database[currentsong].artist);
   	$('#ptime').html(database[currentsong].duration);
   	audio.play();
   	$('.single_list li').removeClass('play_current');
   	$('.single_list li').eq(currentsong).addClass('play_current');
   }

    $('.prev_bt').on('click',function(){
       currentsong-=1;
       if(currentsong===-1){
         currentsong=database.length-1;
       }
       audio.src=database[currentsong].filename;
       onsongchange();
   })
    $('.next_bt').on('click',function(){
       currentsong+=1;
       if(currentsong===database.length){
         currentsong=0;
       }
       audio.src=database[currentsong].filename;
       onsongchange();
   })

// 循环播放
   $(audio).on('ended',function(){
    if($('#cycle').hasClass('cycle_bt')){
      currentsong+=1;
    }else if($('#cycle').hasClass('cycle_single_bt')){
        currentsong=currentsong;
    }else if($('#cycle').hasClass('ordered_bt')){
          currentsong+=1;
         if(currentsong===database.length){
         currentsong=0;
         }
    }else if($('#cycle').hasClass('unordered_bt')){
       currentsong=Math.floor(database.length*Math.random()); 
    }
   	audio.src=database[currentsong].filename;
   	audio.play();
    onsongchange();
   })
   $('#cycle').on('click',function(){
   	$('.bofang_select').toggle();
   })

  // 播放模式选择
  var clas=['ordered_bt','unordered_bt','cycle_single_bt','cycle_bt']
  $('.bofang_select').on('click','strong',function(){
    $('#cycle').removeClass().addClass(clas[$(this).index()]);
    $('.bofang_select').toggle();
  })
  // 下面的时间
 var formatetime = function(s) {
    if(isNaN(s)) return '--:--';
        s = Math.round(s);
        var mi = parseInt(s / 60);
        var se = s % 60;
        mi = mi < 10 ? '0' + mi : mi;
        se = se < 10 ? '0' + se : se;
        return mi + ':' + se;
    }
    $('.player_bar').hover(function(e){
    $('.time_show').css('display','block');
    },function(){
    $('.time_show').css('display','none');
  })
    $('.player_bar').on('mousemove',function(e){
      var left=e.offsetX-25+"px";
    $('.time_show').css('left',left);
    })
    $('.player_bar').on('mousemove',function(e){
      $('#time_show').text(formatetime(audio.duration*e.offsetX/$(this).width()));
    })
   // 页面的出现和消失
    $('.open_list').on('click',function(){
      $('.liebiao_box').fadeToggle();
    })
    $('.folded_bt').on('click',function(){
      $('.liebiao_box').css('display','none')
      $('.m_player').toggleClass('hid');
     })
// 鼠标经过li变化
    $('.cc').on('mouseenter','li',function(){
      $(this).addClass('play_hover');
      $(this).find('span.play_time').css('display','none');
      $(this).find('.list_cp').css('display','block');
    })
     $('.cc').on('mouseleave','li',function(){
      $(this).removeClass('play_hover');
      $(this).find('span.play_time').css('display','block');
      $(this).find('.list_cp').css('display','none');
    })
 // 删除
    $('.single_list').on('click','.btn_del',function(){
      var todel=$('.cc .btn_del').index(this);
      database=$.grep(database,function(v,k){
        return k!=todel;
      })
        $(this).closest('li').remove();
        $('.open_list span').text(database.length);
      return false;
    })
    $('.clear_list').on('click',function(){
      $('.single_list li').remove();
    })

    // 播放模式
    

 })