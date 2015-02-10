/**
 * Объект ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.resource.Resource',
	{
		url: null,
		name: null,
		baseName: null,
		modifiedDate: null,
		size: null,
		type: null,
		date: null,
		extension: null,

		/**
		 * @property {String} Формат даты.
		 */
		formatDate: 'd.m.Y H:i',

		/**
		 * Инициализирует ресурс.
		 * @param {Object} data Данные ресурса.
		 */
		constructor: function (data)
		{
			var me = this;

			me.url = data.url;
			me.name = data.name;
			me.baseName = data.baseName;
			me.modifiedDate = data.date;
			me.size = data.size;
			me.type = data.type;
			me.date = me.getDateFormat();
			me.extension = me.getExtension();
		},

		getDateFormat: function ()
		{
			var me = this,
				date;

			date = Ext.Date.format(me.modifiedDate, me.formatDate);

			return date;
		},

		/**
		 * Возвращает расширение файла.
		 * @return {String} Имя файла.
		 */
		getExtension: function ()
		{
			var me = this,
				fileName = me.baseName,
				ext;

			ext = fileName.replace(/.*?\.(\w+)$/, '$1');

			return ext;
		}
	}
);