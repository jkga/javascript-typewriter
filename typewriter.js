
/**
*typewriter.js
*make a typewriter effect for your website
*@author jgka [https://github.com/jkga]
*@repository https://github.com/jkga/jquery-typewriter 
*/

var typeWriter=typeWriter||{}

typeWriter={
	__init:function(){
		this.index=0;
		this.current_word='';
		this.second=30;
		this.speed=2000;
		this.eraserSpeed=10;
		this.loop=true;
		this.pre;
		this.target;
	},
	set:function(settings){
		//change all settings
		this.__init();
		this.speed=settings.speed
		this.eraserSpeed=settings.speed;
		this.eraserSpeed=(typeof settings.eraser_speed)=='undefined'?this.speed:settings.eraser_speed
		this.pause=settings.pause
		this.pre=(typeof settings.pre)=='undefined'?'':settings.pre
		this.words=settings.words
		this.target=settings.target
		this.loop=(typeof settings.loop)=='undefined'?this.loop:settings.loop
		this.func;
	}, 
	type:function(func){
		//start typing
		this.func=func;
		this.__wordIterator()
		return this;
	},
	__wordIterator:function(){
			//point to first word on type
			var word=this.words[this.index];
			
			//append the pre word only in the beggining of the word if not empty
			if(this.index<1&&this.pre.length>0){
				word=this.pre+''+word;
			}

			//get all letters in word
			for(var x=0;x<=word.length;x++){
				this.__letterWriterIterator(word.substr(0,x),x,word.length)
			}

			//point to next word
			this.index++;
	},

	
	__letterWriterIterator:function(l,x,total_length){
		var parent=this;
		setTimeout(function(){	
			parent.current_word=l;
			parent.__writeToHTML(l)

			//if last letter of the word,start eraser
			if(x==total_length){

				if(parent.words.length==parent.index&&parent.loop==false) return false;
				//if((parent.counter)==parent.words.length-4&&parent.loop=='false') return false;
				parent.__letterEraser()
				//callback for type()
				return parent.func(parent);
			}
		},this.speed*x);
	},

	__letterEraser:function(){
		var parent=this;
		setTimeout(function(){
			//get current word and erase the letter one by one, must add some pause before erasing
			for(var x=0;x<=parent.current_word.length;x++){
				parent.__letterEraserIterator(parent.current_word.substr(0,parent.current_word.length-x),x,parent.current_word.length)
			}
		},this.pause)
	},

	__letterEraserIterator:function(l,x,total_length){
		var parent=this;
		 setTimeout(function(){	
		 	//first word
			if(parent.index==1){
				if(l.length<parent.pre.length){
					if(x==total_length){
						parent.__wordIterator()
						return true;
					}
					return false;
				}	
			}

			parent.current_word=l;
			parent.__writeToHTML(l)
			if(x==total_length){
				try{
					parent.__wordIterator()
				}catch(e){
					//enable loop
					//start from first word
					if(parent.loop) parent.index=0;
					parent.__wordIterator()
				}
			}	
		},this.eraserSpeed*x);
	},

	__writeToHTML:function(words){
		//get all targets
		var target=document.querySelectorAll(this.target)
		//add the pre in the very first if it is not empty
		if(this.index>1&&this.pre.length>0){
			
			for(var x=0;x<target.length;x++){
				target[x].innerHTML=this.pre+''+ words;
			}
		}else{

			for(var x=0;x<target.length;x++){
				target[x].innerHTML=words;
			}
				
		}
	
	}
}
