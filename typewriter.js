
/**
*typewriter.js
*make a typewriter effect for your website
*@author jgka [https://github.com/jkga]
*@repository https://github.com/jkga/jquery-typewriter 
*/
"use strict";

var typeWriter=typeWriter||{}


///////////////////////////////////////////////////
//
// TYPEWRITER FUNCTIONS
// 
// 
// String Manipulation
// __init : Initial settings
// __mask : Replace letters with character provided
//		   Example: test = ****
//
// __reverseString : Convert string to reverse
//
//
// Public function
// 
// set : override default settings settings
// type : callback everytime letter is typed
// erase : callback everytime letter is erased
// stop: imeddiately stop iteration
//
////////////////////////////////////////////////////

typeWriter={
	__init:function(){

		//------------------------------------
		// Recursion settings 
		//------------------------------------
		this.__isHalted=false;
		this.__isPaused=false;
		this.__continue=false; //indicate if writer was previously paused
		this.__writerInterval;
		this.loop=true;


		//------------------------------------
		// String settings 
		//------------------------------------
		this.reverse=false;
		this.index=0;
		this.current_word='';
		this.start_at=0;
		this.mask;
		this.pre;
		this.pre_after='';
		this.__pre_finished=false; //indicate if pre is written
		this.words=[]
		this.__buffer=''; //hold string whenever pause() is called

		//------------------------------------
		// Speed settings 
		//------------------------------------
		this.second=30;
		this.speed=2000;
		this.eraser_speed=10;
		this.delay=0;


		//------------------------------------
		// HTML element settings
		//------------------------------------
		this.target;
		this.cursor;

		//------------------------------------
		// callback settings
		//------------------------------------
		this.type_callback=function(){}
		this.erase_callback=function(){}
		
	},
	set:function(settings){
		
		//------------------------------------
		// Load settings
		//------------------------------------
		this.__init();


		//------------------------------------
		// Override default speed settings
		//------------------------------------
		this.speed=(typeof settings.speed)=='undefined'?this.speed:settings.speed
		this.eraser_speed=(typeof settings.eraser_speed)=='undefined'?this.eraser_speed:settings.eraser_speed
		this.delay=(typeof settings.delay)=='undefined'?this.delay:settings.delay



		//------------------------------------
		// Override default string settings
		//------------------------------------
		this.pre=(typeof settings.pre)=='undefined'?'':settings.pre
		this.pre_break=(typeof settings.pre_break)=='undefined'?'':settings.pre_break
		this.words=(typeof settings.words)=='undefined'?this.words:settings.words
		this.start_at=(typeof settings.start_at)=='undefined'?0:settings.start_at
		this.mask=(typeof settings.mask)=='undefined'?this.loop:settings.mask
		this.reverse=(typeof settings.reverse)=='undefined'?this.reverse:settings.reverse
		this.__buffer='';



		//------------------------------------
		// Set target settings
		//------------------------------------
		this.target=(typeof settings.target)=='undefined'?'':settings.target
		this.cursor=(typeof settings.cursor)=='undefined'?'':settings.cursor




		//------------------------------------
		// Override recursion settings
		//------------------------------------
		this.loop=(typeof settings.loop)=='undefined'?this.loop:settings.loop


		return this;
	}, 
	type:function(func){
		
		//start typing
		this.__wordIterator()


		//------------------------------------
		// Set default callback whenever character is written
		//------------------------------------
		this.type_callback=func;
		return this;
	},
	erase:function(func){


		//------------------------------------
		// Set default callback whenever character is removed
		//------------------------------------
		this.erase_callback=func
		return this;


	},
	stop:function(){


		//------------------------------------
		// Set halt to true to immediately stop writing
		//------------------------------------
		this.__isHalted=true;
		this.__continue=false;
		return this;

	},
	pause:function(timeout,callback_timeout){
		
		var parent=this;


		//------------------------------------
		// Object.pause(2000)
		//------------------------------------
		if(typeof timeout==='number'){
			setTimeout(function(){
				return parent.__pause()
			},timeout);
			return parent;
		}


		//------------------------------------
		// Object.pause()
		//------------------------------------

		if(typeof timeout=='undefined'){

			return parent.__pause()
		}


		//------------------------------------
		// Object.pause(function(){})
		//------------------------------------
		if(typeof timeout=='function'){
			//check if callback_timeout is provided
			if(typeof callback_timeout==='undefined') throw new this.__callbackTimeoutException();

			setTimeout(function(){
				timeout();
				return parent.__pause()
			},callback_timeout);
			
		}
		

		
	},
	play:function(){

		//current index is pointd to the next string
		// reduce index to use the previously used string
		this.index-=1;
		return this.__play()
	},
	next:function(){
		this.__buffer='';
		this.index++;
		return this.__next()
	},
	previous:function(){
		this.index--;
		this.__buffer='';
		return this.__next()
	},
	__write:function(words){
		//get all targets
		var target=document.querySelectorAll(this.target)


		//Add break to the pre if pre_break is set to true
		if(this.pre_break) this.pre_after="<br/>";


		//add the pre in the VERY FIRST STRING if pre is not empty
		if(this.index>1&&this.pre.length>0){

			words=this.pre+''+this.pre_after+''+words;

		}else{

			
			//add break after pre if pre_break is set to true and pre is already written
			if(this.__pre_finished==true&&this.pre_break){
				if(this.pre_after.length>0) words=this.__insertAfter(words,this.pre.length,0,this.pre_after);
			}


			//--------------------------------------------------------------------------
			// Add break if FIRST word is the same with pre and pre is not yet written
			//--------------------------------------------------------------------------
			if(words==this.pre&&this.__pre_finished==false){
				if(this.pre_after.length>0) words=this.__insertAfter(words,this.pre.length,0,this.pre_after);
				this.__pre_finished=true;	
			}
				
		}



		//--------------------------------------------------------------------------
		// Write to element
		//--------------------------------------------------------------------------

		for(var x=0;x<target.length;x++){

			if(target[x].nodeName.toLowerCase()==='input'||target[x].nodeName.toLowerCase()==='option'){

				//remove break for input ad use whitespace instead
				//var words=words.replace(/(?:\<br\/\>|\<br \/\>)/g, " ss");
				this.__writeToInput(target[x],words.replace(/(?:\<br\/\>|\<br \/\>)/g, "\r\n "))

			}
			else if(target[x].nodeName.toLowerCase()==='textarea'){

				//remove break for input and use break
				this.__writeToInput(target[x],words.replace(/(?:\<br\/\>|\<br \/\>)/g, "\r\n"))

			}else{

				this.__writeToElement(target[x],words)

			}
		}

		
	},
	__mask:function(words){

		//------------------------------------
		// Replaced string if mask option is set
		//------------------------------------
		if(this.mask.length>0){
			//mask word
			var word='';
			for(var x=0;x<words.length;x++){
				word+=this.mask;
			}

			words=word;
		}
		
		return words;
	},
	__reverseString(str) {

		//------------------------------------
		// Replaced string if reverse option is set to true
		//------------------------------------
   		return (str === '') ? '' : this.__reverseString(str.substr(1)) + str.charAt(0);
	},
	__wordIterator:function(){



		//point to first word
		var word=this.__mask(this.words[this.index]);



		//-----------------------------------------------------------------
		// Exclude the buffer to the new word so that writer will only read
		// where th pause() function was triggered
		// ex.  word : javascriptWriter
		//		pause at word : javascript
		//		result : Writer 
		//------------------------------------------------------------------

		if(this.__continue){

			word=word.substr(this.__buffer.length,word.length-this.__buffer.length)
			
		}


		//-----------------------------------------------------------------
		// throw exception if word option is not specified or not an array
		//------------------------------------------------------------------

		if(typeof word==='undefined'){ throw new this.__wordException(); }



		//------------------------------------
		// If reverse option is set to True
		// reverse the string
		//------------------------------------
		if(this.reverse){
			word=this.__reverseString(this.words[this.index]);
		}


		//---------------------------------------------------------------------
		// Add string at the beggining of the word if pre option is not empty
		// This should only apply for the very first element in an array
		//---------------------------------------------------------------------

		if(this.index<1&&this.pre.length>0){
			word=this.pre+''+word;
		}
			
		

		//------------------------------------
		// Write words per letter
		// Set the start_at option to start reading on index(n)
		//------------------------------------

		var word_index=this.start_at;
		var parent=this;

		

		//clear writer instance
		clearInterval(this.__writerInterval);


		this.__writerInterval=setInterval(function(){

			word_index++;
			
			//-------------------------------------------------------------
			// Add buffer to the string
			// See __continue() for reference
			//-------------------------------------------------------------
			parent.__letterWriterIterator(parent.__buffer+''+word.substr(0,word_index),word_index,word.length)
			if(word_index>=word.length) clearInterval(parent.__writerInterval);

			
		},this.speed)
			

		//point to next word in an array
		this.index++;



	},

	
	__letterWriterIterator:function(string,index,total_length_of_string){

		var parent=this;

		//save string to buffer if pause() is called		
		if(this.__isPaused) this.__buffer=this.current_word


		//halt writer if halt() is called
		if(this.__isHalted){
			//clear writer instance to avoid buffer overflow
			clearInterval(this.__writerInterval);
			return 0;
		} 


		
		//start writing		
		this.current_word=string;
		this.__write(string)

	

		//------------------------------------------------
		// Execute callback whenever character is written
		// Type function could now be called
		// 1. Object.type()
		// 2. Object.type(function(){})
		//-----------------------------------------------

		if(typeof this.type_callback==='function') this.type_callback(this);
		
	

		//------------------------------------
		// Start erasing the word after the last letter of the word
		//------------------------------------
		if(index==total_length_of_string){

			//------------------------------------
			// If word in array is the last word to be written and loop is not enable, DO NOT ERASE
			//------------------------------------
			
			if(this.words.length==this.index&&this.loop==false) return false;


			parent.__letterEraser()
			

		}
		
	},

	__letterEraser:function(){

		var parent=this;
		var word_index=0;

		//---------------------------------------------------------------------------------------
		// Get current word and erase the letter one by one, must add some pause before erasing
		// Set the delay option to reduce or add delay before erasing
		//---------------------------------------------------------------------------------------

		setTimeout(function(){
			
			var eraserInterval=setInterval(function(){
				word_index++;
				parent.__letterEraserIterator(parent.current_word.substr(0,parent.current_word.length-word_index),word_index,parent.current_word.length)

				if(word_index>=parent.current_word.length) clearInterval(eraserInterval)
				
			},this.eraser_speed)
		},this.delay)
			


	},

	__letterEraserIterator:function(string,index,total_length){
		
		var parent=this;

		
	 	//halt writer if halt() is called
		if(parent.__isHalted) return 0;

	 	//------------------------------------
		// Call erase callback
		// Object.erase(function(){})
		//------------------------------------
		if(typeof parent.erase_callback==='function') parent.erase_callback(parent);




	 	//------------------------------------
		// Add pre to the FIRST element of an array if pre is not empty
		//------------------------------------
		if(parent.index==1){

			if(string.length<parent.pre.length){

				//------------------------------------
				// Write next word after the last character
				//------------------------------------
				if(string.length==0){
					parent.__wordIterator()
					return true;
				}
				return false;
			}	
		}




		//------------------------------------
		// Start Erasing
		//------------------------------------

		parent.__write(string)


	 	//------------------------------------
		// Write next string after erasing the last character
		//------------------------------------
		
		if(string.length==0){

			//clear buffer
			this.__buffer=''


			try{
				parent.__wordIterator()
			}catch(e){
				//enable loop
				//start from first word
				if(parent.loop) parent.index=0;
				parent.__wordIterator()
			}
		}	

		

		
	},
	__insertAfter:function(string, index, length, value) {
	  if (index < 0) {
	    index = string.length + index;
	    if (index < 0) {
	      index = 0;
	    }
	  }

	  return string.slice(0, index) + (value || "") + string.slice(index + length);
	},
	__writeToElement:function(target,words){
		target.innerHTML=words+''+this.cursor;
	},
	__writeToInput:function(target,words){
		target.value=words;
	},
	__wordException:function(message){
		var error={}
		error.name='word'
		this.message='Invalid string.String must be an array type'
		
	},
	__callbackTimeoutException:function(){
		var error={}
		error.name='callback timeout'
		this.message='Invalid timeout on callback'
	},
	__pause(){
		this.__isHalted=true;
		this.__isPaused=true;
		this.__continue=false;
		return this;	
	},
	__play(){
		
		this.__continue=true;	//set to true to start reading from pause()
		this.__isPaused=false;
		this.__isHalted=false;
		this.__wordIterator() //start retyping typing
		this.__continue=false;//set to false to logically reset the writer as new instead of reading from pause()
		return this;
	},
	__next:function(){
		this.__continue=false;//set to false to logically reset the writer as new instead of reading from pause()
		this.__isPaused=false;
		this.__isHalted=false
		return this;
	}

	
}

