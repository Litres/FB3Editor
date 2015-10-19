/**
 * Менеджер путей.
 * Работает с хэшем в URL.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.route.Manager',
	{
		singleton: true,

		/**
		 * @property {Object} Параметры, переданные в хэше url.
		 */
		params: {},

		init: function ()
		{
			var me = this,
				params,
				hash;

			hash = location.hash.substring(1);
			//console.log('hash', escape(hash));

			if (hash)
			{
				params = hash.split('&');

				Ext.Array.each(
					params,
					function (item)
					{
						var res,
							name,
							val;

						res = item.split('=');
						name = res[0];
						val = res[1] ? unescape(res[1]) : null;
						me.params[name] = val;
					}
				);
			}

			//console.log('url params', me.params);
		}
	}
);