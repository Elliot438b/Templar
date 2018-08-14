function outputmsg(res,msg) {
  	var json = {};
  	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
   	res.write(msg);
	res.end('\n');
}

module.exports=outputmsg


