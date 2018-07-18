const ApioConsumer = require('./dist/node');

new ApioConsumer()
	.fetchResource(
		'https://apiosample.wedeploy.io/p/blog-postings',
		['creator'],
		{BlogPosting: ['headline', 'creator']}
	)
	.then(console.log);
