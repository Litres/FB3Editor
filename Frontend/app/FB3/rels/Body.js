/**
 * Тело книги в архиве FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Body',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);
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
                        rels = Ext.create('FBEditor.FB3.rels.BodyRels', me.getStructure(), relsName, parentDir);

                        resolve(rels);
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
		 * Возвращает xml тела книги.
		 * @resolve {String} Строка xml.
		 * @return {Promise}
		 */
		getContent: function ()
		{
			var me = this;

			return me.getText();
		},

		/**
		 * Устанавливает тело книги.
		 * @param {String} data
		 */
		setContent: function (data)
		{
			var me = this;

			me.setFileContent(data);
		},

		/**
		 * Устанавливает ресурсы книги.
		 * @param {FBEditor.resource.Resource[]} data Ресурсы.
		 */
		setImages: function (data)
		{
			var me = this,
				rels = me.getRels(),
				structure = me.getStructure(),
				fb3file,
				zip;

			fb3file = structure.getFb3file();
			zip = fb3file.zip;
			zip.remove('fb3/img');
			zip.remove('/fb3/img');

			Ext.each(
				data,
			    function (item)
			    {
				    var rootName = item.rootName;
				    
				    // удаляем первый слеш
				    rootName = rootName.replace(/^\//, '');

				    // кодируем кириллицу
				    rootName = encodeURI(rootName);

				    zip.file(rootName, item.content, {createFolders: true});
			    }
			);

			rels.setContent(data);
		}
	}
);