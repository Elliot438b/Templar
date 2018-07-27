Eos = require('../src')
  
keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]
eos = Eos.Localnet({keyProvider})

function getCurrencyBalance(accountName,symbol){
        if(symbol =="")
		return eos.getCurrencyBalance(accountName,accountName)
        else
                return eos.getCurrencyBalance(accountName,accountName,symbol)
}

module.exports=getCurrencyBalance
