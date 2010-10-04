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
 

function parser(ignore_ns,charset)
{
 var self = this;
 self.addns=!!ignore_ns;
 self.onfinish=function () { };
  
 if(!charset)self.charset="UTF-8";
 function reset()
 {
  self.root=null;
  self.root=self.addns?{parent:null,children:[],attrs:[],nschildren:[],nsattrs:[]}: {parent:null,children:[],attrs:[]};
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
    if(attrs.hasOwnProperty(key))
    {
     if (k == 'xmlns' || k.substr(0, 6) == 'xmlns:') self.ns[k] = attrs[k];
    }
   }
   self.element=self.root
  }

  var el={parent:self.element};
  var smicpos,nk;
  for(var k in attrs)
  {
   nk=k;
   if(attrs.hasOwnProperty(k))
   {
    smicpos=k.indexOf(':'); if(smicpos>0) nk=k.substring(smicpos+1,k.length);
    el[self.addns?k:nk] = attrs[k];
   }
  }
  
  nk=name;
  smicpos=name.indexOf(':'); if(smicpos>0) nk=name.substring(smicpos+1,k.length);
  el.tagname=self.addns?name:nk;
  if(typeof self.element[nk]==='undefined')
  {
  
   el[0]=el; el['length']=1; // array emulation
   
   self.element[self.addns?name:nk]=el;
  }
  else if(typeof self.element[nk]==='object'&& self.element[nk] instanceof Array)
  {
   self.element[self.addns?name:nk].push(el);
  }
  else
  {
   var tmp=self.element[nk];
   delete tmp[0]; delete tmp['length']; // array emulation
   self.element[self.addns?name:nk]=[tmp,el];
  }
  self.parents.push(self.element);
  self.element=el;
 });
 
 self.parser.addListener('endElement', function(name, attrs)
 {
 console.log(self.element.tagname+"!="+name);
  self.element=self.parents.pop();
  
  /*
  if(self.parents.length>1)
  {
   do
   {
    self.element=self.parents.pop();
   }while(self.parents.length>1&&self.element.tagname!=name)
  }
  else
   console.log("t error "+name)
   */
 });
 
 self.parser.addListener('text', function(str)
 {
  if (self.element)
  {
   if(self.element.text)
    self.element.value+=str;
   else
    self.element.value=str;
  }
 });
}; this.parser=parser;
