var React = require('react');
var request = require('superagent');

var LineItem = React.createClass({
  render: function() {
    var lineItemModel = this.props.model;
    var price = (lineItemModel.priceInCents / 100).toFixed(2);

    return (
      <tr>
        <td>{lineItemModel.description}</td>
        <td className="price">{price}</td>
      </tr>
    );
  }
});

module.exports = React.createClass({
  handleClick: function(e) {
    this._stripeCheckout = StripeCheckout.configure({
      key: 'pk_test_pPH475yhqYOtW3Uy9ymRDCoE',
      image: '/img/mcs-logo-128x128.png',
      locale: 'auto',
      token: this.handleStripeToken
    });
    var invoice = this.props.model;
    this._stripeCheckout.open({
      name: 'harold',
      description: 'Invoice #' + invoice.invoiceId,
      amount: invoice.total
    });
    e.preventDefault();
  },

  handleStripeToken: function(token) {
    console.log('token', token);

    var id = 300;
    request
      .post('/api/invoice/' + id + '/payment')
      .send(token)
      .end(function(err, res) {
        if (err) return console.error(err);
        console.log('response from payment ', res.body);
      })

  },

  render: function() {
    window.handleStripeToken = this.handleStripeToken;
    var invoice = this.props.model;
    var invoiceId = invoice.invoiceId;
    var lineItemModels = invoice.lineItems;
    var lineItems = lineItemModels.map(function(lineItem) {
      return (
        <LineItem model={lineItem} key={lineItem.orderIndex} />
      )
    });
    var displayTotal = (invoice.total / 100).toFixed(2);

    var user = invoice.user;
    var name = user.name
    var displayName = sentenceCase(name.title + ' ' + name.first + ' ' + name.last);

    var location = user.location;
    var street = sentenceCase(location.street);
    var city = sentenceCase(location.city);
    var state = sentenceCase(location.state);
    var zip = location.zip;
    var phone = user.phone;

    var description = 'Invoice #' + invoiceId

    return (
      <div>
        <h1>Invoice #{invoiceId}</h1>

        <h2>Bill To</h2>
        <p>
          {displayName}<br/>
          {street}<br/>
          {city}, {state} {zip}<br/>
          {phone}
        </p>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th className="price">Price</th>
            </tr>
          </thead>

          <tbody>
            {lineItems}
          </tbody>

          <tfoot>
            <tr>
              <th className="total">Total:</th>
              <td className="price">${displayTotal}</td>
            </tr>
          </tfoot>
        </table>
        <div><button onClick={this.handleClick}>Pay Now</button></div>

      </div>
    );
  }

});

function sentenceCase(s) {
    return s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
