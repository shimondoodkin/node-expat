var expat = require('./build/default/node-expat');
this.sax=expat; 
// this is a very simple object parser 
// related link: stream parser: http://github.com/astro/node-xmpp/blob/master/lib/xmpp/connection.js
// related link: html parser:   http://github.com/bmeck/Witch/blob/master/parser/html/index.js

// usage
// var expat = require('./deps/node-expat');
//
// var parser=expat.parser(); // new instance of parser 
// parser.parser.parse( data, false ); 
// parser.root.children['html'][0].text
// parser.root.children['html'][0].children['body'].att['bgcolor'];
// parser.root.children['html'][0].children['head'][0].children['media'].att['title'];
// parser.root.children['html'][0].children['head'][0].nschildren['fb:media'].att['title'];
// 

// to use original expat you can do: 
// var expatsax=require('./deps/node-expat').sax;
// var parser= new expatsax.Parser(charset) and add the expat events i added below:

var selfmodule=this;

function parser(add_ref,ignore_ns,charset)
{
 var self = this;
 self.addns=!!ignore_ns;
 self.onfinish=function () { };
 self.trimvaluefirst=true;
 self.trimvaluelast=true;
 self.add_ref=!!add_ref;
 
 
 if(!charset)self.charset="UTF-8";
 function reset()
 {
  self.root=null;
  self.root={};;
  self.ns={};
  self.element = null;
 }self.reset=reset;

 function removeparent() //this allows serializing.
 { 
  // after doind this , this onject probably can't parse anymore
  //tobedone
 }this.removeparent=removeparent;
 
 function xpath(element) //this allows search.
 {
  //tobedone
 }self.xpath=xpath;
 
 self.element = null;
 self.parents=[null];
 self.root={};
 self.parser = new expat.Parser(self.charset);
 self.parser.addListener('startElement', function(name, attrs)
 {
  //first child might contain ns elements
  if (self.element===null)
  {
   self.ns = {};
   for(var k in attrs)
   {
    if(attrs.hasOwnProperty(k))
    {
     if (k == 'xmlns' || k.substr(0, 6) == 'xmlns:') self.ns[k] = attrs[k];
    }
   }
   self.element=self.root
  }
  
  var el={};
  if(self.add_ref) el.parent=self.element;
   
  var smicpos,nk;
  for(var k in attrs)
  {
   nk=k;
   if(attrs.hasOwnProperty(k))
   {
    smicpos=k.indexOf(':'); if(smicpos>0) nk=k.substring(smicpos+1,k.length);
    //el[self.addns?k:nk] = attrs[k];
    el[self.addns?k:nk] = if_number_to_number(attrs[k]);
   }
  }
  
  nk=name;
  smicpos=name.indexOf(':'); if(smicpos>0) nk=name.substring(smicpos+1,name.length);
  el._tagname=self.addns?name:nk;
  el._nstagname=name;
  
  if(typeof self.element[nk]==='undefined')
  {
  
   if(self.add_ref) {el[0]=el; el['length']=1;} // array emulation
   
   self.element[self.addns?name:nk]=el;
  }
  else if(typeof self.element[nk]==='object'&& self.element[nk] instanceof Array)
  {
   self.element[self.addns?name:nk].push(el);
  }
  else
  {
   var tmp=self.element[nk];
   if(self.add_ref) {delete tmp[0]; delete tmp['length'];} // array emulation
   self.element[self.addns?name:nk]=[tmp,el];
  }
  self.parents.push(self.element);
  self.element=el;
  
  self.trimvaluefirst=true;
 });
 
 self.parser.addListener('endElement', function(name)
 {
  if(self.element && ((typeof self.element._value)!=='undefined'))
  {
   self.element._value=trim(self.element._value);
   if(self.element._value=="")
    delete self.element._value;
  }
  //console.log(name); // strange not all tags get closed , but just before oppening a new tag
  self.trimvaluelast=true;
  while(true)
  {
   if(self.element._nstagname==name)
   {
    self.element=self.parents.pop();
    break;
   }
   if(self.parents.length==1)
   {
    console.log('error open tag not found for '+name);
    break;
   }
   self.element=self.parents.pop();
  }

 }); 
   
 self.parser.addListener('text', function(str)
 {
  if(self.trimvaluefirst) // not works on nested tags
  {
   self.trimvaluefirst=false;
   str=ltrim(str);
  }
  
  if(self.trimvaluefirst)
  {
   if(self.element && ((typeof self.element._value)!=='undefined'))
   {
    self.element._value=trim(self.element._value);
    if(self.element._value=="")
     delete self.element._value;
   }
  }
  
  if(str!="")
  if (self.element)
  {
   if(typeof self.element._value!=='undefined')
    self.element._value+=str;
   else
    self.element._value=str;
  }
 });
 
 self.parse=function (data)
 {
  if(data===undefined||data===null) { console.log("EXPAT Error: data is not string or buffer"); return;}
  //var t=data.length, n=5120000;
  //if(n>data.length)
   self.parser.parse(data);
  //else
  // for (var i=0;i<t;i+=n)
  // {
  //  console.log('cunk'+i);
  //  var s=data.substring(i,i+n);
  //  self.parser.parse(s);
  // }
  

  if(self.element && ((typeof self.element._value)!=='undefined'))
  {
   self.element._value=trim(self.element._value);
   if(self.element._value=="")
    delete self.element._value;
  }
  
  var lasterror=self.parser.getError(); if(lasterror!==null) console.log("EXPAT Error:"+lasterror);
  
 }
 
 self.inspect=selfmodule.inspect;
 self.array_to_object=selfmodule.array_to_object;

}; this.parser=parser;

function inspect(obj)
{
 if(typeof obj!=='object') console.log(require('sys').inspect(obj));
 else for(var n in obj) console.log(n);
};this.inspect=inspect;

/*

usage:
    if(device.group===undefined)
    {
     // fallback devices do not contain group
     //console.log(require('sys').inspect(device,true,3));
    }
    else
    {
     for(var n=0,l=device.group.length;n<l;n++)
     {
      //console.log(n);
      device.group[n].capability=array_to_object(device.group[n].capability,'name');
     }
     device.group=array_to_object(device.group,'id');
    }
    
input:

{
   "id" : "generic",
   "user_agent" : "",
   "fall_back" : "root",
   "_tagname" : "device",
   "_nstagname" : "device",
   "group" : [
     {
       "id" : "product_info",
       "_tagname" : "group",
       "_nstagname" : "group",
       "capability" : [
         {
           "name" : "mobile_browser",
           "value" : "",
           "_tagname" : "capability",
           "_nstagname" : "capability" 
         }
    }
  ]
}

result:

{
   "id" : "htc_magic_ver1_subandroid2_2_1",
   "user_agent" : "Mozilla/5.0 (Linux; U; Android 2.2.1; es-es; HTC Magic Build/FRG57) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533",
   "fall_back" : "htc_magic_ver1",
   "_tagname" : "device",
   "_nstagname" : "device",
   "group" : {
     "product_info" : {
       "id" : "product_info",
       "_tagname" : "group",
       "_nstagname" : "group",
       "capability" : {
         "device_os_version": {
           "name" : "device_os_version",
           "value" : "2.2.1",
           "_tagname" : "capability",
           "_nstagname" : "capability" 
        } 
      } 
    }
  }
}

*/

function array_to_object(arr,filed,ignoreerrors)
{
 var obj={};
 ignoreerrors=!!ignoreerrors;
 if((!(arr instanceof Array)) && (typeof arr==='object') )
 {
  if(arr[filed]===undefined)
  {
   if(!ignoreerrors)
    throw new Error("object index name filed missing in array item : "); 
  }
  else
  {
   obj[arr[filed]]=arr;
   //console.log(require('sys').inspect(obj,true,3));
  }
 }
 else if(arr instanceof Array)
 {
  for(var i=0,l=arr.length; i<l ; i++)
  {
   if(arr[i][filed]===undefined)
   {
    if(!ignoreerrors)
     throw new Error("index name filed missing in array item : "+i); 
   }
   else
   {
    obj[arr[i][filed]]=arr[i];
   }
  }
 }
 else
 {
  throw new Error(" arr is not an array or an object with a filed ");
 }
 return obj;
}this.array_to_object=array_to_object;


function search_array(arr,filed,value)
{
  for(var i=0,l=arr.length; i<l ; i++)
  {
   if(arr[i][filed]!==undefined)
   {
    if(arr[i][filed]==value)
     return arr[i]
   }
  }
  return false;
};this.search_array=search_array;

var numeric_re=/^[-+]?(0|[1-9]|[1-9]\d+)\.?\d{0,14}$/;
function if_number_to_number(value)
{
 if(value.length>15) return value;
 
 if(numeric_re.test(value))
  return parseFloat(value);
 else
  return value;
}

function ltrim(str) { 
	for(var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++);
	return str.substring(k, str.length);
}
function rtrim(str) {
	for(var j=str.length-1; j>=0 && isWhitespace(str.charAt(j)) ; j--) ;
	return str.substring(0,j+1);
}
function trim(str) {
	return ltrim(rtrim(str));
}
function isWhitespace(charToCheck) {
	var whitespaceChars = " \t\n\r\f";
	return (whitespaceChars.indexOf(charToCheck) != -1);
}
