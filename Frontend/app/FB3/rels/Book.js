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

			me.getDesc().then(
				function (desc)
				{
					me.desc = desc;
				}
			);
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				relsName = me.getRelsName(),
				parentDir = me.getParentDir(),
				promise;

			if (!rels)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        var bookRels = Ext.create('FBEditor.FB3.rels.BookRels', me.getStructure(), relsName, parentDir);

                        resolve(bookRels);
					}
				);
			}
			else
			{
				promise = Promise.resolve(rels);
			}

			return promise;
		},

		/**
		 * Возвращает описание книги.
		 * @resolve {String} Строка xml.
		 * @return {Promise}
		 */
		getDesc: function ()
		{
			var me = this,
				desc = me.desc,
				promise;

            promise = !desc ? me.getText() : Promise.resolve(desc);

			return promise;
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