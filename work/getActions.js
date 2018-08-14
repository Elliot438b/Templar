Eos = require('../src/index')
  
keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]
eos = Eos.Localnet({keyProvider})
var time = new Date().getTime();

function getActions(accountName,pos,offset){
	return eos.getActions(accountName,pos,offset)
}

module.exports=getActions
