const db 					= require("../newmodels");
const notif_collection 		= db.collection("notifications");

// Type: ['like', 'return_like', 'unlike_afer_match', 'consult']
function create_notif(type, me_id, him_id) {
	return {
		type	: type,
		me_id	: me_id,
		him_id	: him_id,
		viewed	: false
	}
}

exports.add_notif	= (type, me_id, him_id) => {
	console.log("Creatin notif of type: ", type)

	notif = create_notif(type, me_id, him_id)
	notif_collection.insertOne(notif)
	.catch(err => console.log("ERROR INSERTING NOTIF"))
	console.log("New notif inserted: %o", notif)
}


exports.get_notifs	= (req, res) => {
	const cursor = notif_collection.find({ him_id: req.userId })
	const notifrs = cursor.toArray()
		.then(data => {
			console.log("found %d notifs", data.length)
			res.status(200).send(data)
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while checking your notifs"
			});
		});
}


exports.set_viewed_notif	= (req, res) => {
	console.log("Notif settingx viewed")
	if (!req.userId || !req.body.notif_id) {
		console.log("looolm ", req.userId, req.body.notif_id)
		res.status(400).send({ message: "Id missing to set notif as viewed" });
		return;
	}
	filter = {_id : req.body.notif_id, him_id : req.userId}
	update = {
		$set: {
			viewed : true
		}
	}
	notif_collection.updateOne(filter, update)
	.then(upadato => {
		res.send(upadato)
	})
	.catch(err => {
		console.log("error in notif view: ", err)
	})
	console.log("done set viewed")
}