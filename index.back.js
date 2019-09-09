export default function ( query )
{
	return (function ( query, result, i )
	{
		if( query ){

			query = query.split('&');

			for ( ; i < query.length; i++ )
			{
				(function (p)
				{
					result[ p[0].substr(0, p[0].length - 1) ] = p[1] || '';
				})
				( query[i].match(/[\w\%\@\/\-\{\}\.\:\/]+(=)?/g) );
			}

		}

		return result;
	})

	(
		(function ( query ) {

			query = query.match(/\?[\w\%\@\{\}\.\:\/\&\=]+/);

			if ( query )
			{
				query = query[0].substr(1);
			}

			return query;

		})
		( query || location.search || location.href ),

		{},

		0
	);
}
