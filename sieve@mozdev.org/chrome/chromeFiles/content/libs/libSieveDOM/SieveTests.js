/******************************************************************************/

SieveAnyOf.isAnyOf
  = function(token)
{ 
  if (token.indexOf("anyof") == 0)
    return true;
  
  return false
}
    
function SieveAnyOf(id)
{
  this.id = id;
  this.whiteSpace
    = new Array(new SieveDeadCode(this.id+"_0"),
                new SieveDeadCode(this.id+"_2"));
  
  this.testList = new SieveTestList(this.id+"_1");
}

SieveAnyOf.prototype.parse
    = function (data)
{
  // Syntax :
  // <"anyof"> <tests: test-list>

  data = data.slice("anyof".length);
    
  data = this.whiteSpace[0].parse(data);
  
  data = this.testList.parse(data);
    
  data = this.whiteSpace[1].parse(data);
  
  return data;
    
}    

SieveAnyOf.prototype.getID
    = function ()
{
  return this.id;
}

SieveAnyOf.prototype.toString
    = function ()
{
  return "anyof"
    + this.whiteSpace[0].toString()
    + this.testList.toString()
    + this.whiteSpace[1].toString();
}

SieveAnyOf.prototype.toXUL
    = function ()
{
  return "any of the following conditions match"
    + this.testList.toXUL();
}



/******************************************************************************/







/*****************************************************************************/

SieveAllOf.isAllOf
  = function(token)
{ 
  if (token.indexOf("allof") == 0)
    return true;

  return false;
}

function SieveAllOf(id) 
{
  this.id = id;
  this.whiteSpace 
    = new Array(new SieveDeadCode(this.id+"_0"),
                new SieveDeadCode(this.id+"_2"));
  
  this.testList = new SieveTestList(this.id+"_1");
}

SieveAllOf.prototype.parse
    = function (data)
{
  // Syntax :
  // <"allof"> <tests: test-list>
  
  data = data.slice("allof".length);
  
  data = this.whiteSpace[0].parse(data);
  
  data = this.testList.parse(data);
    
  data = this.whiteSpace[1].parse(data);
  
  return data;
    
}    

SieveAllOf.prototype.toString
    = function ()
{
  return "allof"
    + this.whiteSpace[0].toString()
    + this.testList.toString()
    + this.whiteSpace[1].toString();
}

SieveAllOf.prototype.toXUL
    = function ()
{
  return "all of the following conditions match"
    + this.testList.toXUL();
}
/******************************************************************************/

SieveNot.isNot
  = function(token)
{ 
  if (token.indexOf("not") == 0)
    return true;

  return false;
}

function SieveNot() 
{
  // first line with deadcode
  this.whiteSpace 
    = new Array(new SieveDeadCode(),
                new SieveDeadCode());
  
  this.test = null;
}

SieveNot.prototype.parse
    = function (data)
{
  // Syntax :
  // <"allof"> <tests: test-list>
  
  data = data.slice("not".length);
  
  data = this.whiteSpace[0].parse(data);
  
  var parser = new SieveTest(data);
  this.test = parser.extract()
  data = parser.getData();
  
  // TODO implement to all tests an setNot
  // this.test.invertLogic(true);
    
  data = this.whiteSpace[1].parse(data);
  
  return data;
    
}    

SieveNot.prototype.toString
    = function ()
{
  return "not"
    + this.whiteSpace[0].toString()
    + this.test.toString()
    + this.whiteSpace[1].toString();
}

SieveNot.prototype.toXUL
    = function ()
{
  return " not "+this.test.toXUL();
}

/******************************************************************************/

//<envelope> [COMPARATOR] [ADDRESS-PART] [MATCH-TYPE] 
//  <envelope-part: string-list> <key-list: string-list>

SieveEnvelopeTest.isEnvelopeTest
  = function(token)
{ 
  if (token.indexOf("envelope") == 0)
    return true;
  
  return false;
} 
    
function SieveEnvelopeTest() 
{
  // first line with deadcode
  this.options = new Array(null,null,null);
  this.whiteSpace 
    = new Array(new SieveDeadCode(),
                new SieveDeadCode(),
                new SieveDeadCode(),
                new SieveDeadCode(),
                new SieveDeadCode(),
                new SieveDeadCode());
  this.envelopeList = new SieveStringList();
  this.keyList = new SieveStringList();
}

SieveEnvelopeTest.prototype.parse
    = function (data)
{
  data = data.slice("envelope".length);
  data = this.whiteSpace[0].parse(data);
  
  for (var i=0; i< 3; i++)
  {
    if (isSieveAddressPart(data))
      this.options[i] = new SieveAddressPart();
    else if (isSieveComparator(data))
      this.options[i] = new SieveComparator();
    else if (isSieveMatchType(data))
      this.options[i] = new SieveMatchType();
    else
      break;
    
    data = this.options[i].parse(data);
    data = this.whiteSpace[i+1].parse(data);
  }
  
  data = this.envelopeList.parse(data);
  
  data = this.whiteSpace[4].parse(data);
  
  data = this.keyList.parse(data);
    
  data = this.whiteSpace[5].parse(data);
  
  return data;
}    

SieveEnvelopeTest.prototype.toString
    = function ()
{
  return "envelope"
    + this.whiteSpace[0].toString()
    + ((this.options[0] != null)?this.options[0].toString():"")
    + ((this.options[0] != null)?this.whiteSpace[1].toString():"")
    + ((this.options[1] != null)?this.options[1].toString():"")
    + ((this.options[1] != null)?this.whiteSpace[2].toString():"")
    + ((this.options[2] != null)?this.options[2].toString():"")
    + ((this.options[2] != null)?this.whiteSpace[3].toString():"")
    + this.envelopeList.toString()
    + this.whiteSpace[4].toString()
    + this.keyList.toString()
    + this.whiteSpace[5].toString();
}

SieveEnvelopeTest.prototype.toXUL
    = function ()
{
  return "envelope - to be implented";
}

/******************************************************************************/


//address [ADDRESS-PART] [COMPARATOR] [MATCH-TYPE]
//             <header-list: string-list> <key-list: string-list>

             
SieveAddress.isAddress
  = function(token)
{             
  if (token.indexOf("address") == 0)
    return true;
    
  return false
}
                 
function SieveAddress(id)
{
  this.id = id;  
  this.options = new Array(null,null,null);
  this.whiteSpace 
    = new Array(new SieveDeadCode(this.id+"_3"),
                new SieveDeadCode(this.id+"_4"),
                new SieveDeadCode(this.id+"_5"),
                new SieveDeadCode(this.id+"_6"),
                new SieveDeadCode(this.id+"_7"),
                new SieveDeadCode(this.id+"_8"));
  this.headerList = new SieveStringList(this.id+"_9");
  this.keyList = new SieveStringList(this.id+"_10");
}

SieveAddress.prototype.parse
    = function (data)
{
  data = data.slice("address".length);
  data = this.whiteSpace[0].parse(data);
  
  for (var i=0; i< 3; i++)
  {
    if (isSieveAddressPart(data))
      this.options[i] = new SieveAddressPart(this.id+"_"+i);
    else if (isSieveComparator(data))
      this.options[i] = new SieveComparator(this.id+"_"+i);
    else if (isSieveMatchType(data))
      this.options[i] = new SieveMatchType(this.id+"_"+i);
    else
      break;
    
    data = this.options[i].parse(data);
    data = this.whiteSpace[i+1].parse(data);
  }
  
  data = this.headerList.parse(data);
  
  data = this.whiteSpace[4].parse(data);
  
  data = this.keyList.parse(data);
    
  data = this.whiteSpace[5].parse(data);
  
  return data;
}    

SieveAddress.prototype.getID
    = function ()
{
  return this.id;
}

SieveAddress.prototype.toString
    = function ()
{
  return "address"
    + this.whiteSpace[0].toString()
    + ((this.options[0] != null)?this.options[0].toString():"")
    + ((this.options[0] != null)?this.whiteSpace[1].toString():"")
    + ((this.options[1] != null)?this.options[1].toString():"")
    + ((this.options[1] != null)?this.whiteSpace[2].toString():"")
    + ((this.options[2] != null)?this.options[2].toString():"")
    + ((this.options[2] != null)?this.whiteSpace[3].toString():"")
    + this.headerList.toString()
    + this.whiteSpace[4].toString()
    + this.keyList.toString()
    + this.whiteSpace[5].toString();
}

SieveAddress.prototype.toXUL
    = function ()
{
  return "address - to be implemented";
}

/******************************************************************************/

SieveBoolean.isBoolean
 = function(data)
{   
  data = data.toLowerCase();
  if (data.indexOf("true") == 0)
    return true;
  if (data.indexOf("false") == 0)
    return true;
  
  return false;
}

function SieveBoolean(id) 
{
  // first line with deadcode
  this.id = id;
  this.whiteSpace = new SieveDeadCode(this.id+"_0");
  
  this.value = false;
}

SieveBoolean.prototype.parse
    = function (data)
{
  var token = data.substr(0,5).toLowerCase();
  
  if (token.indexOf("true") == null)
  {
    this.value = true
    data = data.slice("true".length);
  }
  
  if (token.indexOf("false") == null)
  {
    this.value = false;
    data = data.slice("false".length);
  }
  
  data = this.whiteSpace.parse(data);
    
  return data;
    
}    

SieveBoolean.prototype.getID
    = function ()
{
  return this.id;
}

SieveBoolean.prototype.toString
    = function ()
{
  if (this.value)
    return "true"+this.whiteSpace.toString();

  return "false"+this.whiteSpace.toString();    
}

SieveBoolean.prototype.toXUL
    = function ()
{
  if (this.value)
    return  " true ";

  return " false ";
}

/******************************************************************************/
SieveSizeTest.isSizeTest
  = function(token)
{ 
  if (token.indexOf("size") == 0)
    return true;
  
  return false
}
    
function SieveSizeTest(id) 
{
  this.id = id;
  this.whiteSpace 
    = new Array(new SieveDeadCode(this.id+"_0"),
                new SieveDeadCode(this.id+"_1"),
                new SieveDeadCode(this.id+"_3"));
  
  this.over = false;
  this.size = new SieveNumber(this.id+"_2");
}

SieveSizeTest.prototype.parse
    = function (data)
{
  // Syntax :
  // <"size"> <":over" / ":under"> <limit: number>
  
  data = data.slice("size".length);
  
  data = this.whiteSpace[0].parse(data);
  
  var token = data.substr(0,6).toLowerCase();
  if (token.indexOf(":over") == 0)
  {
    data=data.slice(":over".length)
    this.over = true;
  }
  else if (token.indexOf(":under") == 0)
  {
    data=data.slice(":under".length)    
    this.over = false;
  }
  else 
    throw "Syntaxerror, :under or :over expected";
    
  data = this.whiteSpace[1].parse(data);
  data = this.size.parse(data);
  data = this.whiteSpace[2].parse(data);
  
  return data;
    
}    

SieveSizeTest.prototype.getID
    = function ()
{
  return this.id;
}

SieveSizeTest.prototype.toString
    = function ()
{
  return "size"
    + this.whiteSpace[0].toString()
    + ((this.over)?":over":":under")
    + this.whiteSpace[1].toString()
    + this.size.toString()
    + this.whiteSpace[2].toString();
}

SieveSizeTest.prototype.toXUL
    = function ()
{
  return "<html:div class='SieveSizeTest'>"
    + " message size is "
    + "<html:select>"
    + "<html:option "+((this.over)?"selected='true'":"")+" >over</html:option>" 
    + "<html:option "+((this.over)?"":"selected='true'")+" >under</html:option>" 
    + "</html:select>"
    + this.size.toXUL()
    + "</html:div>"
}

/******************************************************************************/

SieveExists.isExists
  = function(token)
{ 
  if (token.indexOf("exists") == 0)
    return true;
  
  return false;
}
    
function SieveExists(id)
{
  this.id = id;
  this.whiteSpace 
    = new Array(new SieveDeadCode(this.id+"_0"),
                new SieveDeadCode(this.id+"_2"));
  
  this.headerNames = new SieveStringList(this.id+"_1");
}

SieveExists.prototype.parse
    = function (data)
{
  // Syntax :
  // <"exists"> <header-names: string-list>
  
  data = data.slice("exists".length);
  
  data = this.whiteSpace[0].parse(data);
  
  data = this.headerNames.parse(data);
    
  data = this.whiteSpace[1].parse(data);
  
  return data;
    
}    

SieveExists.prototype.getID
    = function ()
{
 return this.id; 
}

SieveExists.prototype.toString
    = function ()
{
  return "exists"
    + this.whiteSpace[0].toString()
    + this.headerNames.toString()
    + this.whiteSpace[1].toString();
}

SieveExists.prototype.toXUL
    = function ()
{
  return " one of the following mailheader exists<html:br/>"
    + this.headerNames.toXUL();
}

/******************************************************************************/

/******************************************************************************/
SieveHeader.isHeader
  = function(token)
{ 
  if (token.indexOf("header") == 0)
    return true;
  
  return false;
}
    
function SieveHeader(id) 
{
  this.id = id;
  this.whiteSpace 
    = new Array(new SieveDeadCode(this.id+"_0"),
                new SieveDeadCode(this.id+"_1"),
                new SieveDeadCode(this.id+"_2"),
                new SieveDeadCode(this.id+"_3"),                
                new SieveDeadCode(this.id+"_4"));
  this.options = new Array(null,null);
  this.headerNames = new SieveStringList(this.id+"_5");
  this.keyList = new SieveStringList(this.id+"_6");
}

SieveHeader.prototype.parse
    = function (data)
{
  // Syntax :
  // <"header"> [COMPARATOR] [MATCH-TYPE] <header-names: string-list> <key-list: string-list>             
  
  data = data.slice("header".length);
  
  data = this.whiteSpace[0].parse(data);
  
  if (isSieveComparator(data))
  {
    var element = new SieveComparator(this.id+"_7");
    data = element.parse(data);
    this.options[0] = element;
    
    data = this.whiteSpace[1].parse(data)
    
    if (isSieveMatchType(data))
    {
      element = new SieveMatchType(this.id+"_8");
      data = element.parse(data);
      this.options[1] = element;
    }
  }  
  else if (isSieveMatchType(data))
  {
    var element = new SieveMatchType(this.id+"_7");
    data = element.parse(data);
    this.options[0] = element;
    
    data = this.whiteSpace[1].parse(data)

    if (isSieveComparator(data))
    {
      element = new SieveComparator(this.id+"_8");
      data = element.parse(data);
      this.options[1] = element;
    }
  }
  data = this.whiteSpace[2].parse(data);  
  data = this.headerNames.parse(data);
  
  data = this.whiteSpace[3].parse(data);
  
  data = this.keyList.parse(data);
  
  data = this.whiteSpace[4].parse(data);
  
  return data;    
}

SieveHeader.prototype.toString
    = function ()
{
  return "header"
    + this.whiteSpace[0].toString()
    + ((this.options[0] != null)?this.options[0].toString():"")
    + ((this.options[0] != null)?this.whiteSpace[1].toString():"")    
    + ((this.options[1] != null)?this.options[1].toString():"")
    + this.whiteSpace[2].toString()
    + this.headerNames.toString()
    + this.whiteSpace[3].toString()
    + this.keyList.toString()
    + this.whiteSpace[4].toString()
}

SieveHeader.prototype.toXUL
    = function ()
{
  return "any of the following messageheaders "+this.headerNames.toXUL() 
      + "[casesensitive/insensitive] [matchtype e.g. contains]"
      + " one of the following values "+ this.keyList.toXUL();
}

// IMPORT ALL STANDARD SIEVE TESTS
with (SieveTest)
{
  register("address","SieveAddress",SieveAddress.isAddress);
  register("allof","SieveAllOf",SieveAllOf.isAllOf);
  register("anyof","SieveAnyOf",SieveAnyOf.isAnyOf);
  register("boolean","SieveBoolean",SieveBoolean.isBoolean);
  
  register("envelope","SieveEnvelopeTest",SieveEnvelopeTest.isEnvelopeTest);
  register("exists","SieveExists",SieveExists.isExists);  
  register("header","SieveHeader",SieveHeader.isHeader);  
  register("not","SieveNot",SieveNot.isNot);  
  register("size","SieveSizeTest",SieveSizeTest.isSizeTest);
}