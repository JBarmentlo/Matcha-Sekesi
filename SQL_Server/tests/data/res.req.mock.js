const sinon          = require('sinon');

exports.mockResponse = () => {
	const res = {};
	res.status = sinon.stub().returns(res);
	res.json = sinon.stub().returns(res);
	res.send = sinon.stub()
	return res;
};

exports.mockRequest = (body, username) => {
	return {
		username: username,
		body: body
	};
};
