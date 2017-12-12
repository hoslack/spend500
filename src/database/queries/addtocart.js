const connection = require('../db_connection');


const addtocart = (user_id, item_id,cb)=>{
	connection.query(`INSERT INTO cart(user_id,item_id) VALUES($1,$2)`,
		[user_id,item_id],(error, result)=>{
			if(error){
				cb(error);
			}
			cb(null, result);
		});
};


module.exports = addtocart;