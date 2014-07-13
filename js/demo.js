
$(document).ready(function(){

	//获取外层容器
	var touchSliderCon = $('#touchSliderCon');

	//获取窗口相关
	var ww 		= $(window).width(),
		wh 		= $(window).height(),
		wscale 	= ww / wh,
		index 	= 0,
		total	= 0,
		duration= 0.3,
		transitionDuration = duration + 's',
		moveSwipe = 0,
		currentSwipe = ww * index,
		st = null,
		data = [],
		isShowTip = true,
		showTipsCon ;

	//设置外层容器样式
	touchSliderCon.css({ width: ww, height: 200 });

	//创建ul存放imgs
	var touchSliderUL 		= $('<ul class="touchSlider-ul" />');
	var touchSliderBTNS 	= $('<div class="touchSlider-btns" />');
	var touchSliderLI 		= '';
	var touchSliderBTN 		= '';

	var ulWidth 			= 0;
	var btnsWidth 			= 0;

	//获取images对象
	$.getJSON('data/images.json', {}, function(res){
		if(res.code == '200') {
			if(res.body && res.body.length > 0) {
				data = res.body; 
				total = data.length;
				//创建骄焦点图
				createTouchSlider(res.body);
			} else {
				alert('未找到相关焦点图');
			}
		} else {
			alert('获取焦点图数据失败！');
		}
	});


	//-------创建焦点图函数
	var createTouchSlider = function(images){
		var i = 0, l = images.length;
		for (; i < l; ++i) {
			var image = new Image();
			image.onload = function(){
				if(image.width / image.height > wscale){
					touchSliderLI = '<li><a href="'+ image.link +'" target="_blank"><img src="'+ image.src +'" width="' + ww + '"></a></li>';
				}else{
					touchSliderLI = '<li><a href="'+ image.link +'" target="_blank"><img src="'+ image.src +'" height="' + wh + '"></a></li>';
				}
				touchSliderUL.append(touchSliderLI);
			};
			image.src = images[i].src;

			touchSliderBTN += createTouchSliderBtn(i);
		};
		//touchSilderUL.html(touchSilderLI);
		touchSliderBTNS.html(touchSliderBTN);

		touchSliderCon.append(touchSliderUL);
		touchSliderCon.append(touchSliderBTNS);

		//重置一些样式
		resetStyle(l);

		//标题提示
		if(isShowTip){
			showTipsCon = $('<div class="touchSlider-tips">'+ data[index].title +'</div>');
			touchSliderCon.append(showTipsCon);
			showTipsCon.css({
				'transform': 'translate(0px, 0px)',
				'-webkit-transform': 'translate(0px, 0px)'
			});
		}

	};

	//-------创建按钮图函数
	var createTouchSliderBtn = function(index){
		var span = '<span data-index="'+ (parseInt(index)) +'" '+ (index == 0 ? "class=\"on\"" : "") +'/>';
		return span;
	};

	var resetStyle = function(len){
		//图层
		var imgW = 0;
		//按钮层
		var spanW = 0;
		for(var i = 0; i < len; ++i){
			imgW += ww;
			spanW += touchSliderBTNS.find('span').first().width() + 12;
		}
		touchSliderUL.css({ width: imgW })
		touchSliderBTNS.css({ left: ((ww - spanW) * 0.5)  });
	};

	var moveStyle = function(type){
		//moveSwipe = -(ww * (index - 1)) - 320;
		moveSwipe = index == 0 ? 0 : -(ww * (index - 1)) - 320;

		touchSliderUL.css({ 
			"-webkit-transform": "translate("+ moveSwipe +"px, 0px)",
			"-moz-transform": "translate("+ moveSwipe +"px, 0px)",
			"-ms-transform": "translate("+ moveSwipe +"px, 0px)",
			"-o-transform": "translate("+ moveSwipe +"px, 0px)",
			"transform": "translate("+ moveSwipe +"px, 0px)",
			"-webkit-transition-duration": transitionDuration,
			"-moz-transition-duration": transitionDuration,
			"-ms-transition-duration": transitionDuration,
			"-o-transition-duration": transitionDuration,
			"transition-duration": transitionDuration,
		});
		touchSliderBTNS.find('span').removeClass('on');
		touchSliderBTNS.find('span').get(index).className = 'on';
		//提示
		if(isShowTip){
			showTipsCon.html(data[index].title);
			showTipsCon.css({
				'transform': 'translate(0, 0)',
				'-webkit-transform': 'translate(0, 0)'
			});
		}
	};


	//事件侦听
	touchSliderCon.on('touchstart', function(evt){
		showTipsCon.css({
				'transform': 'translate(0, -1.8em)',
				'-webkit-transform': 'translate(0, -1.8em)'
			});	
	});
	touchSliderCon.on('swipeLeft', function(evt){
		console.log(evt)
		index++;
		index = (index >= total - 1) ? total - 1 : index;
		moveStyle(index, 'left');	
	});


	touchSliderUL.on('swipeRight', function(evt){
		console.log(evt)
		index--;
		index = (index <= 0) ? 0 : index;
		moveStyle(index, 'right');	
	});


	touchSliderBTNS.delegate('span', 'tap', function(evt){
		index = evt.currentTarget.getAttribute('data-index');
		moveStyle(index, 'tap');
	});

});