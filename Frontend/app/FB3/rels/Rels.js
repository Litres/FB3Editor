/**
 * Корневой файл в структуре FB3, определяющий связи между различными частями архива.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.rels.Rels',
	{
		extend: 'FBEditor.FB3.rels.AbstractRels',
		requires: [
			'FBEditor.FB3.rels.Thumb',
			'FBEditor.FB3.rels.Meta',
			'FBEditor.FB3.rels.Book',
			'FBEditor.FB3.rels.BookRels',
			'FBEditor.FB3.rels.Body',
		    'FBEditor.FB3.rels.BodyRels'
		],

		defaultContent: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId1" ' +
	                'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" ' +
	                'Target="meta/core.xml"/>' +
            '<Relationship Id="rId2" ' +
	                'Type="http://www.fictionbook.org/FictionBook3/relationships/Book" ' +
	                'Target="fb3/description.xml"/>' +
		    '</Relationships>',

		/**
		 * @private
		 * @property {Object} Обложка.
		 */
		thumb: null,

		/**
		 * @private
		 * @property {Object} Мета-информация.
		 */
		meta: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.rels.Book[]} Описание и содержимое книг (может быть подшивкой из нескольких книг).
		 */
		books: null,

		/**
		 * Инициализирует связи.
		 */
		constructor: function ()
		{
			var me = this;

			me.callParent(arguments);

			me.getBooks().then(
				function (books)
				{
					me.books = books;
				}
			);
		},

		create: function (structure, fileName)
		{
			var me = this,
				fb3file = structure.getFb3file(),
				zip;

			// создаем необходимые пустые файлы для структуры
			zip = fb3file.zip;
			zip.file('meta/core.xml');
			zip.file('fb3/body.xml');
			
			me.callParent(arguments);
		},

		getRels: function ()
		{
			var me = this,
				rels = me.rels,
				promise;

			if (!rels)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getJson().then(
                            function (json)
                            {
                                rels = json.Relationships.Relationship;
                                rels = Ext.isArray(rels) ? rels : [rels];
                                rels = Ext.Array.toValueMap(rels, me.prefix + 'Type', 2);

                                resolve(rels);
                            }
                        );
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
		 * Возвращает книгу или все книги, если не передан параметр index.
		 * @param {Number} [index] Индекс книги в массиве.
		 * @resolve {FBEditor.FB3.rels.Book|FBEditor.FB3.rels.Book[]} Книга или массив книг.
		 * @return {Promise}
		 */
		getBooks: function (index)
		{
			var me = this,
				books = me.books,
				promise;

			if (!books)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getRels().then(
                            function (rels)
                            {
                                books = rels[FBEditor.FB3.rels.RelType.book];
                                books = Ext.isArray(books) ? books : [books];

                                Ext.each(
                                    books,
                                    function (item, i, selfBooks)
                                    {
                                        var targetName = item[me.prefix + 'Target'];

                                        // путь может быть абсолютным или относительным
                                        targetName = targetName.replace(/^[/]/, '');

                                        selfBooks[i] = Ext.create('FBEditor.FB3.rels.Book', me.getStructure(),
											targetName);
                                    }
                                );

                                books = Ext.isNumeric(index) ? books[index] : books;

                                resolve(books);
                            }
                        );
					}
				);
			}
			else
			{
                books = Ext.isNumeric(index) ? books[index] : books;
				promise = Promise.resolve(books);
			}

			return promise;
		},

		/**
		 * Возвращает обложку.
		 * @resolve {FBEditor.FB3.rels.Thumb}
		 * @return {Promise}
		 */
		getThumb: function ()
		{
			var me = this,
				thumb = me.thumb,
				promise;

			if (!thumb)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getRels().then(
                            function (rels)
                            {
                                thumb = rels[FBEditor.FB3.rels.RelType.thumbnail];

                                thumb = thumb ?
                                    Ext.create('FBEditor.FB3.rels.Thumb', me.getStructure(),
                                        thumb[me.prefix + 'Target']) :
                                    null;

                                resolve(thumb);
                            }
                        );
					}
				);
			}
			else
			{
                promise = Promise.resolve(thumb);
			}

			return promise;
		},

		/**
		 * Возвращает мета-информацию.
		 * @resolve {FBEditor.FB3.rels.Meta}
		 * @return {Promise}
		 */
		getMeta: function ()
		{
			var me = this,
				meta = me.meta,
				promise;

			if (!meta)
			{
				promise = new Promise(
					function (resolve, reject)
					{
                        me.getRels().then(
                        	function (rels)
							{
                                meta = rels[FBEditor.FB3.rels.RelType.coreProperties];

                                meta = meta ?
									Ext.create('FBEditor.FB3.rels.Meta', me.getStructure(), meta[me.prefix + 'Target']) :
									null;

                                resolve(meta);
							}
						);
					}
				);
			}
			else
			{
				promise = Promise.resolve(meta);
			}

			return promise;
		},

		/**
		 * Устанавливает обложку.
		 * @param {FBEditor.resource.Resource} data Данные обложки.
		 * @resolve {String} Содержимое обложки.
		 * @return {Promise}
		 */
		setThumb: function (data)
		{
			var me = this,
				promise,
				thumbRel,
				target;

			if (!data)
			{
				return Promise.resolve();
			}

			target = data.rootName;

			promise = new Promise(
				function (resolve, reject)
				{
                    me.getText().then(
                        function (content)
                        {
                            if (/thumbnail" Target="(.*?)"/.test(content))
                            {
                                content = content.replace(/thumbnail" Target="(.*?)"/, 'thumbnail" Target="' + target + '"');
                            }
                            else
                            {
                                thumbRel = '<Relationship Id="rId0" ' +
                                    'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail" ' +
                                    'Target="' + target + '"/>';
                                content = content.replace(/<Relationship Id="rId1"/ig, thumbRel + '<Relationship Id="rId1"');
                            }

                            me.setFileContent(content);

                            console.log('save thumb', data, content);

                            resolve(content);
                        }
                    );
				}
			);

            return promise;
		}
	}
);