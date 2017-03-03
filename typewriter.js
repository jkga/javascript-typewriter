
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
		this.isHalt=false;
		this.isPause=false;
		this.loop=true;
		this.continue=false;
		this.writerInterval;


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
		this.buffer='';

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
	halt:function(){

		//------------------------------------
		// Set halt to true to immediately stop writing
		//------------------------------------
		this.isHalt=true;
		this.continue=false;
		return this;
	},
	pause:function(){
		this.isHalt=true;
		this.isPause=true;
		this.continue=false;
	},
	play:function(){

		this.continue=true;
		this.isHalt=false;
		this.isPause=false;

		//start retyping typing
		this.index-=1;
		this.__wordIterator()
		this.continue=false;
		return this;
	},
	__write:function(words){
		//get all targets
		var target=document.querySelectorAll(this.target)


		//Add break to the pre if pre_break is set to true
		if(this.pre_break) this.pre_after="<br/>";


		//add the pre in the very first if pre is not empty
		if(this.index>1&&this.pre.length>0){

			words=this.pre+''+this.pre_after+''+words;

		}else{

			
			//add break after pre if pre_break is set to true and pre is already written
			if(this.__pre_finished==true&&this.pre_break){
				if(this.pre_after.length>0) words=this.__insertAfter(words,this.pre.length,0,this.pre_after);
			}


			//------------------------------------
			// Add break if FIRST word is the same with pre and pre is not yet written
			//------------------------------------
			if(words==this.pre&&this.__pre_finished==false){
				if(this.pre_after.length>0) words=this.__insertAfter(words,this.pre.length,0,this.pre_after);
				this.__pre_finished=true;	
			}
				
		}





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

		if(this.continue){

			// /word=this.buffer;
			console.log(word.substr(this.buffer.length,word.length-this.buffer.length))
		}

		if(typeof word==='undefined'){ throw new this.__wordException(); }

		//------------------------------------
		// If reverse option is set to True
		// reverse the string
		//------------------------------------
		if(this.reverse){
			word=this.__reverseString(this.words[this.index]);
		}


		//------------------------------------
		// Add string at the beggining of the word if pre option is not empty
		// This should only apply for the very first element in an array
		//------------------------------------

		if(this.index<1&&this.pre.length>0){
			word=this.pre+''+word;
		}


		if(this.pause){
			this.buffer=this.current_word;
		}
		
		
			
		

		//------------------------------------
		// Write words per letter
		// Set the start_at option to start reading on index(n)
		//------------------------------------

		var word_index=this.start_at;
		var parent=this;
		clearInterval(this.writerInterval);
		this.writerInterval=setInterval(function(){
			word_index++;
			parent.__letterWriterIterator(word.substr(0,word_index),word_index,word.length)
			if(word_index>=word.length) clearInterval(this.writerInterval);
			
		},this.speed)
			

		//point to next word in an array
		this.index++;
	},

	
	__letterWriterIterator:function(letter,index,total_length_of_string){

		var parent=this;

		
		if(this.isPause) this.buffer=this.current_word

		//halt writer if halt() is called
		if(this.isHalt) return 0;
			
		this.current_word=letter;
		this.__write(letter)

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
		if(index==total_length_of_string+1){

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

		//------------------------------------
		// Get current word and erase the letter one by one, must add some pause before erasing
		// Set the delay option to reduce or add delay before erasing
		//------------------------------------


		setTimeout(function(){
			
			var eraserInterval=setInterval(function(){
				word_index++;
				parent.__letterEraserIterator(parent.current_word.substr(0,parent.current_word.length-word_index),word_index,parent.current_word.length)

				if(word_index>=parent.current_word.length) clearInterval(eraserInterval)
			
			},this.eraser_speed)
		},this.delay)
			


	},

	__letterEraserIterator:function(letter,index,total_length){
		
		var parent=this;

		
	 	//halt writer if halt() is called
		if(parent.isHalt) return 0;

	 	//------------------------------------
		// Call erase callback
		// Object.erase(function(){})
		//------------------------------------
		if(typeof parent.erase_callback==='function') parent.erase_callback(parent);


	 	//------------------------------------
		// Add pre to the FIRST element of an array if pre is not empty
		//------------------------------------
		if(parent.index==1){

			if(letter.length<parent.pre.length){

				//------------------------------------
				// Write next word after the last character
				//------------------------------------
				if(index==total_length){
					//parent.__wordIterator()
					return true;
				}
				return false;
			}	
		}


		//------------------------------------
		// Start Erasing
		//------------------------------------
		//parent.current_word=letter;
		parent.__write(letter)


	 	//------------------------------------
		// Write next string after erasing the last character
		//------------------------------------
		
		if(letter.length==0){

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
		
	}

	
}

