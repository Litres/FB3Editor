/**
 * Мета-информация о содержимом в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Meta',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		getRels: function ()
		{
            return Promise.resolve(null);
		},

		/**
		 * Возвращает мета-информацию в виде json.
		 * @resolve {Object} Мета-информация.
		 * @return {Promise}
		 */
		getContent: function ()
		{
			var me = this,
				promise;

			promise = new Promise(
				function (resolve, reject)
				{
                    me.getJson().then(
                    	function (json)
						{
							resolve(json.coreProperties);
						}
					);
				}
			);

			return promise;
		},

		/**
		 * Устанавливает мета-информацию.
		 * @param {String} data
		 */
		setContent: function (data)
		{
			var me = this;

			me.setFileContent(data);
		}
	}
);