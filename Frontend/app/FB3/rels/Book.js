/**
 * Книга в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Book',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		defaultContent: '<?xml version="1.0" encoding="UTF-8"?>' +
			'<fb3-description xmlns="http://www.fictionbook.org/FictionBook3/description" ' +
			'id="29f8c76a-141c-102c-a3bc-9f4786c95f7d" version="1.0"></fb3-description>',

		/**
		 * @private
		 * @property {Object} Описание книги.
		 */
		desc: null,

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
			me.desc = me.getDesc();
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				relsName = me.getRelsName(),
				parentDir = me.getParentDir();

			if (!rels)
			{
				rels = Ext.create('FBEditor.FB3.rels.BookRels', me.getStructure(), relsName, parentDir);
			}

			return rels;
		},

		/**
		 * Возвращает описание книги.
		 * @return {Object}
		 */
		getDesc: function ()
		{
			var me = this,
				desc = me.desc,
				text,
				anotation,
				history;

			if (!desc)
			{
				desc = me.getJson()['fb3-description'];
				text = me.getText();
				text = text.replace(/[\n\r\t]/g, '');
				anotation = text.match(/<anotation>(.*?)<\/anotation>/);
				desc.anotation = anotation ? anotation[1] : '';
				history = text.match(/<history>(.*?)<\/history>/);
				desc.history = history ? history[1] : '';
			}

			return desc;
		},

		/**
		 * Устанавливает описание книги.
		 * @param {String} data
		 */
		setDesc: function (data)
		{
			var me = this;

			me.setFileContent(data);
		}
	}
);