var express = require('express');
var app = express.Router();
var Invoice = require('./models').Invoice;
var config = require('./config');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);

app.get('/api/invoice/:id', function(req, res) {
  var id = req.params.id;

  Invoice.find({ invoiceId: id }, function(err, invoices) {
  	console.log('id', id);
    if (err) return res.status(500).send('Error finding invoice');

    var invoice = invoices[0];
    if (invoice) return res.send(invoice);

    Invoice.createRandom(id, function(err, invoice) {
      return res.send(invoice);
    })

  });
});

app.post('/api/invoice/:id/payment', function(req, res) {
	var id = req.params.id;
	// look up the invoice

	Invoice.find({ invoiceId: id }, function(err, invoices) {
		if (err || !invoices) return res.status(500).send('Error finding invoice.');
		var invoice = invoices[0];
		if (!invoice) return res.status(404).send('Could not find invoice');

		var stripeToken = req.body.id;
		var description = 'Invoice #' + invoice.invoiceId;
		var amount = invoice.total;

		// make a payment with stripe
		var charge = stripe.charges.create({
			amount: amount,
			currency: 'usd',
			source: stripeToken,
			description: description
		}, function(err, charge) {
			if (err && err.type === 'StripeCardError') {
				// the card has been declined
				return res.send(err);
			};
			res.send(charge);
		})
	})
	// todo: mark the invoice as paid
	//res.send({ok: true});
});

module.exports = app;
