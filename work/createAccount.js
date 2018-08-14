Eos = require('../src/index')
outputmsg = require('./outputmsg.js')
keyProvider = [
  '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
  Eos.modules.ecc.seedPrivate('currency')
]
eos = Eos.Localnet({keyProvider})
function createAccount(account,publicKey,res){
	if (eos ==null){
    		console.log("eos is null")
    		return;
	}
   eos.transaction(tr => {
  	 tr.newaccount({
    	creator: 'eosio.token',
    	name: account,
    	owner: publicKey,
    	active: publicKey
  })
    tr.buyrambytes({
    payer: 'eosio.token',
    receiver: account,
    bytes: 8192
  })

  tr.delegatebw({
    from: 'eosio.token',
    receiver: account,
    stake_net_quantity: '1.0000 SYS',
    stake_cpu_quantity: '1.0000 SYS',
    transfer: 0
  })
}).then((error,result) =>{
                           if(error != null)
                           	outputmsg(res,JSON.stringify(error))
			   else
                                outputmsg(res,JSON.stringify(result))
		}
	)
}

module.exports=createAccount
