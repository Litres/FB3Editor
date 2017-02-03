/**
 * Объект данных для внешнего ресурса file:///, http(s)://.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.ExternalData',
	{
		extend : 'FBEditor.resource.data.AbstractData',

		resData: null,

		/**
		 * @private
		 * @property {Object} Исходные данные ресурса.
		 */
		data: null,

		/**
		 * @param {Object} data Объект данных.
		 * @param {String} data.url Адрес ресурса.
		 */
		constructor: function (data)
		{
			var me = this;

			me.data = data;
		},

		getData: function ()
		{
			var me = this,
				url = me.data.url,
				resData = me.resData,
				ext,
				type,
				name;

			if (resData)
			{
				return resData;
			}

			// определяем расширение по url
			ext = FBEditor.util.Format.getExtensionFile(url);

			name = 'paste' + new Date().getTime() + '.' + ext;
			type = me.getMimeType(name);

			resData = {
				url: url,
				name: name,
				baseName: name,
				rootName: me.rootPath + '/' + name,
				modifiedDate: new Date(),
				type: type
			};

			me.resData = resData;

			return resData;
		}
	}
);