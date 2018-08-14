Eos = require('../src/index')
var outputmsg = require('./outputmsg.js');
keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]
eos = Eos.Localnet({keyProvider})

function queryAccount(account,res){
   if(eos == null){
   	console.log("eos is null")
	return;	
   }

   eos.getAccount(account).then(
	result =>{
                outputmsg(res,JSON.stringify(result))
 	}
   )
}

module.exports=queryAccount
