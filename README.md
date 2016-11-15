# Typewriter
typewriter text effect for your website

##Sample script   
This JavaScript code will type words iside a section of your webpage.This will bring life to your dull and lifeless texts. Go to the sample page to see in action

```javascript
var settings={
	speed:50,
	eraser_speed:25,
	pause:2000,
	cursor:'<span class="cursor">_</span>',
	target:'.console',
	words:['Typewriter.js','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.','Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.','Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur','Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum']
}

var typewriter=Object.create(typeWriter) //create typewriter object
typewriter.set(settings);	//configure the typing	
//start typing
typewriter.type(function(e){
	//callback for typing
}).erase(function(e){
	//callback for erasing
})

```   

### Settings
You can modify the effects of the typewriter by changing the value of the objects   

 * **speed** 		-Speed of typing(miliseconds)
 * **eraser_speed**		-Speed of the eraser(miliseconds).You can make the erasing faster than typing using this parameter
 * **pause**		- In every end of the line the cursor will pause in n-miliseconds before erasing
 * **cursor**		-Add a cursor in typing and erasing content.This could be a character or html tags.
 * **words**  		-These are the words of array that will be typed.
 * **target** 		-The words will be written on this section. This must use '.' or '#' depending on a tag used.
 * **loop**			-By default, whenever all the words in ***words*** has been written it will automatically restart on the begining of the array.To prevent the loop and make the word stop at the last word,set this to ***false***
 * **pre**	-This is a strings that will be written before the first word in an array.This portion will not be erased during deletion and typing will just start on the end of this pre
 * **pre_after**   - concatenated to the pre. Use this for adding linebreak or space

