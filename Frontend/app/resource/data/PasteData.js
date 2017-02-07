/**
 * Объект данных ресурса из фрагмента вставки в текст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.data.PasteData',
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
		 * @param {Blob} data.blob Данные ресурса.
		 */
		constructor: function (data)
		{
			var me = this;

			me.data = data;
		},

		getData: function ()
		{
			var me = this,
				blob = me.data.blob,
				resData = me.resData,
				ext,
				type,
				name,
				url;

			if (resData)
			{
				return resData;
			}

			type = blob.type;
			ext = type ? '.' + me.getExtension(type) : '';
			name = 'paste' + new Date().getTime() + ext;
			url = window.URL.createObjectURL(blob);

			resData = {
				blob: blob,
				url: url,
				name: name,
				baseName: name,
				rootName: me.rootPath + '/' + name,
				modifiedDate: new Date(),
				sizeBytes: blob.size,
				type: type
			};

			me.resData = resData;

			return resData;
		},

		/**
		 * Возвращает расширение по mime-type.
		 * @param {String} type Mime-type.
		 * @return {String} Расширение.
		 */
		getExtension: function (type)
		{
			var ext;

			ext = type.replace(/.*?(png|jpg|jpeg|gif|svg).*?/i, '$1');

			return ext;
		}
	}
);