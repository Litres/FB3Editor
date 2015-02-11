/**
 * Файл FB3.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.FB3.File',
	{
		/**
		 * @private
		 * @property {Object} Файлы архива.
		 */
		files: null,

		/**
		 * @private
		 * @property {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		structure: null,

		/**
		 * @private
		 * @property {FBEditor.file.Zip} Zip-Архиватор.
		 */
		zip: null,

		/**
		 * @private
		 * @property {Object} Данные книги.
		 */
		data: null,

		/**
		 * @private
		 * @property {String} Имя новой книги по умолчанию.
		 */
		defaultName: 'book.fb3.zip',

		/**
		 * @param {Object} data Данные книги.
		 */
		constructor: function (data)
		{
			var me = this;

			me.zip = Ext.create('FBEditor.file.Zip');
			me.data = data;
		},

		/**
		 * Возвращает структуру архива FB3.
		 * @return {FBEditor.FB3.Structure} Структура архива FB3.
		 */
		getStructure: function ()
		{
			var me = this,
				zip = me.zip,
				data = me.data.content,
				structure = me.structure;

			if (!structure)
			{
				zip.unPackage(data);
				me.setFiles();
				structure = Ext.create('FBEditor.FB3.Structure', me);
				me.structure = structure.load();
			}

			return structure;
		},

		/**
		 * Обновляет структуру и данные архива FB3.
		 * @param {Object} data Данные книги.
		 */
		updateStructure: function (data)
		{
			var me = this,
				structure = me.structure,
				books,
				bodies;

			structure.setMeta(data.meta);
			books = structure.getBooks();
			Ext.Object.each(
				data.books,
			    function (index, bookData)
			    {
				    structure.setDesc(books[index], bookData.desc);
				    bodies = structure.getBodies(books[index]);
				    Ext.each(
					    bookData.bodies,
					    function (bodyData, i)
					    {
						    structure.setContent(bodies[i], bodyData.content);
						    structure.setImages(bodies[i], bodyData.images);
					    }
				    );
			    }
			);
		},

		/**
		 * Создает структуру архива FB3 и обновляет в ней данные.
		 */
		createStructure: function ()
		{
			var me = this,
				structure;

			structure = Ext.create('FBEditor.FB3.Structure', me);
			me.structure = structure.create();
			me.updateStructure(me.data);
		},

		/**
		 * Возвращает файлы архива или конкретный файл по переданному имени.
		 * @param {String} [name] Имя файла.
		 * @return {Object} Файлы или один файл.
		 */
		getFiles: function (name)
		{
			var me = this,
				result = null;

			if (me.files)
			{
				result = name ? me.files[name] : me.files;
				result = result || null;
				if (!result)
				{
					Ext.log(
						{
							level: 'warn',
							msg: 'В архиве отсутствует файл ' + name +
							     ', на который ссылается один из существующих файлов',
							dump: me.files
						}
					);
				}
			}

			return result;
		},

		/**
		 * Возвращает имя файла.
		 * @return {String} Имя файла.
		 */
		getName: function ()
		{
			var me = this,
				data = me.data,
				defaultName = me.defaultName,
				name;

			name = data.file ? data.file.name : defaultName;

			return name;
		},

		/**
		 * Устанавливает файлы из архива.
		 */
		setFiles: function ()
		{
			var me = this,
				zip = me.zip;

			me.files = zip.getFiles();
		},

		/**
		 * Генерирует файл FB3 в Blob.
		 * @return {Blob} Данные Blob.
		 */
		generateBlob: function ()
		{
			var me = this,
				zip = me.zip;

			return zip.generateBlob();
		}
	}
);