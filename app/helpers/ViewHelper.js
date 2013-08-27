Handlebars.registerHelper( 'link', function( text, url ) {

  text = Handlebars.Utils.escapeExpression( text );
  url  = Handlebars.Utils.escapeExpression( url );

  var result = '<a href="' + url + '">' + text + '</a>';

  return new Handlebars.SafeString( result );
});

Handlebars.registerHelper('pluralize', function(number, singular, plural) {
    if (number === 1) return singular;
    else return (typeof plural === 'string' ? plural : singular + 's');
});
