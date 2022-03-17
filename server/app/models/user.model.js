module.exports = mongoose => {
	const User = mongoose.model(
	  "user",
	  mongoose.Schema(
		{
		  username		: String,
		  mail			: String,
		  name			: String,
		  firstname		: String,
		  password		: String,
		  profile_pic	: String,

		},
		{ timestamps: true }
	  )
	);
	return User;
  };

//   bio			: String,
//   gender		: String,
//   localisation	: String,
//   popularity	: Number,
//   pictures		: [String],
//   profile_pic	: String,
//   activated		: Boolean,