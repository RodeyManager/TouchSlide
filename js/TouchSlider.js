/**
 *	移动设备图片滑动事件
 *
 *	Rodey Luo
 *
 * 	rodeyluo@gmail.com
 * 
 */


;(function(){

	var TouchSlider = function(options){
		var self = this,
			ww = $(window).width(),
			wh = $(window).height(),
			opts = {
				container: options && options.container || (function(){
								var div = document.createElement('div');
								div.setAttribute('id', 'touchSliderCon');
								div.setAttribute('class', 'touchSlider-con');
								document.body.appendChild(div);
								return 'touchSliderCon';
							})(),
				width: options && options.width || ww,
				height: options && options.height || wh,
				index: options.index || 0,
				duration: options && options.duration || 0.3,
				total: options && options.total || 0,
				data: options && options.data,
				isShowTip: options && options.isShowTip || false,
				buttonStyle: options && options.buttonStyle || '',
				autoPlay: options && options.autoPlay || true,
				callback: options && options.callback

			},
			 
			wscale 				= ww / wh,
			index 				= opts.index,
			data 				= opts.data,
			total				= opts.data.length,
			duration 			= opts.duration,
			moveSwipe 			= 0,
			currentSwipe 		= ww * index,
			st 					= null ,
			transitionDuration = opts.duration + 's',

			//创建ul存放imgs
			touchSliderUL 		= $('<ul class="touchSlider-ul" />'),
			touchSliderBTNS 	= $('<div class="touchSlider-btns" />'),
			touchSliderLI 		= '',
			touchSliderBTN 		= '',

			ulWidth 			= 0,
			btnsWidth 			= 0;

		//设置外层容器样式
		touchSliderCon = $('#' + opts.container);
		touchSliderCon.css({ width: opts.width, height: opts.height });

		//-------创建按钮图函数
		var createTouchSliderBtn = function(index){
			var span = '<span data-index="'+ (parseInt(index)) +'" '+ (index == opts.index ? "class=\"on\"" : "") +' style="'+ opts.buttonStyle +'"/>';
			return span;
		};

		var clearnTipsStyle = function(){
			showTipsCon.css({
				'transform': 'translate(0, -1.8em)',
				'-o-transform': 'translate(0, -1.8em)',
				'-ms-transform': 'translate(0, -1.8em)',
				'-moz-transform': 'translate(0, -1.8em)',
				'-webkit-transform': 'translate(0, -1.8em)'
			});
		};

		var setTipsStyle = function(){
			showTipsCon.css({
				'transform': 'translate(0, 0)',
				'-o-transform': 'translate(0, 0)',
				'-ms-transform': 'translate(0, 0)',
				'-moz-transform': 'translate(0, 0)',
				'-webkit-transform': 'translate(0, 0)'
			});
		};

		var resetStyle = function(len){
			//图层
			var imgW = 0;
			//按钮层
			var spanW = 0;
			var ml = 0;
			for(var i = 0; i < len; ++i){
				imgW += ww;
				ml = parseInt(touchSliderBTNS.find('span').first().css('margin-left')) * 2;
				spanW += touchSliderBTNS.find('span').first().width() + ml;
			}
			touchSliderUL.css({ width: imgW })
			touchSliderBTNS.css({ left: ((opts.width - spanW) * 0.5)  });
		};

		//-------创建焦点图函数
		var createTouchSlider = function(images){
			var i = 0, l = images.length;
			for (; i < l; ++i) {
				touchSliderLI += '<li><a href="'+ images[i].link +'" target="_blank"><img src="'+ images[i].src +'" width="' + opts.width + '"></a></li>';
				touchSliderBTN += createTouchSliderBtn(i);
			};

			touchSliderUL.html(touchSliderLI);
			touchSliderBTNS.html(touchSliderBTN);

			touchSliderCon.append(touchSliderUL);
			touchSliderCon.append(touchSliderBTNS);

			//重置一些样式
			resetStyle(l);

			//标题提示
			if(opts.isShowTip){
				showTipsCon = $('<div class="touchSlider-tips">'+ (data[index]).title +'</div>');
				touchSliderCon.append(showTipsCon);
				setTipsStyle();
			}
		};

		createTouchSlider(data);

		var moveStyle = function(index, evt, type){
			if(evt){
				evt.stopPropagation();
				evt.preventDefault();
			}
			//清除定时器
			clearInterval(st);

			if(index >= total - 1){
				index = total - 1;
			}else if(index <= 0){
				index = 0;
			}
			
			moveSwipe = index == 0 ? 0 : -(opts.width * (index - 1)) - opts.width;
			var moveSwipe = moveSwipe;

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
			if(opts.isShowTip){
				showTipsCon.html(data[index].title);
				setTipsStyle();
			}
			//恢复定时器
			st = setInterval(function(){
				setTipsStyle();
				index++;
				if(index >= total) index = 0;
				moveStyle(index, null, 'play'); 
			}, duration * 10000);
		};


		//事件侦听
		var startX = 0;
		var startTime = 0;
		var offsetX = 0;
		var moveing = 0;
		//开始事件
		touchSliderCon.on('touchstart', function(evt){
			if(opts.isShowTip){
				clearnTipsStyle();
			}
			startX = evt.changedTouches[0].pageX;
			startTime = Date.now || new Date().getTime();
		});
		//移动中事件
		/*touchSliderCon.on('touchmove', function(evt){
			offsetX = evt.changedTouches[0].pageX - startX;
			moveing = moveing + offsetX * 0.02;

			touchSliderUL.css({ 
				"-webkit-transform": "translate("+ moveing +"px, 0px)",
				"-moz-transform": "translate("+ moveing +"px, 0px)",
				"-ms-transform": "translate("+ moveing +"px, 0px)",
				"-o-transform": "translate("+ moveing +"px, 0px)",
				"transform": "translate("+ moveing +"px, 0px)",
				"-webkit-transition-duration": 'none',
				"-moz-transition-duration": 'none',
				"-ms-transition-duration": 'none',
				"-o-transition-duration": 'none',
				"transition-duration": 'none',
			});
		});*/
		//停止事件
		touchSliderCon.on('touchend', function(evt){
			/*if(moveing >= 0){ moveing = 0; }
			if(moveing <= opts.width * (total - 1)){ moveing = -opts.width * (total - 1); }
			if(offsetX > 0){
				index--;
				//index = (index <= 0) ? 0 : index;
				moveStyle(index, evt, 'right');
			}else if(offsetX < 0){
				index++;
				//index = (index >= total - 1) ? total - 1 : index;
				moveStyle(index, evt, 'left');
			}*/
			if(opts.callback && typeof opts.callback === 'function'){
				opts.callback(index);
			}
		});

		//左移动
		touchSliderCon.on('swipeLeft', function(evt){
			index++;
			//index = (index >= total - 1) ? total - 1 : index;
			moveStyle(index, evt, 'left');	
		});
		//右移动
		touchSliderCon.on('swipeRight', function(evt){
			index--;
			//index = (index <= 0) ? 0 : index;
			moveStyle(index, evt, 'right');	
		});
		//按钮触发
		touchSliderBTNS.delegate('span', 'tap', function(evt){
			index = evt.currentTarget.getAttribute('data-index');
			moveStyle(index, evt, 'tap');
		});

		if(opts.autoPlay){
			st = setInterval(function(){
				index++;
				if(index >= total - 1) index = 0;
				moveStyle(index, null, 'play');
			}, 3000);
		}
		


	};

	var root = this;
	root.TouchSlider = TouchSlider;

}).call(this);
