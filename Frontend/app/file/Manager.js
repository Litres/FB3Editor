/**
 * Менеджер файлов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.file.Manager',
	{
		singleton: true,
		requires: [
			'FBEditor.file.File',
			'FBEditor.file.Zip',
			'FBEditor.FB3.File',
		    'FBEditor.FB3.Structure'
		],

		/**
		 * @property {FBEditor.FB3.File} Распакованный файл FB3.
		 */
		fb3file: null,

		/**
		 * Открывает файл FB3.
		 * @param {Object} evt Событие открытие файла.
		 * @return {Boolean} Успешно ли открытие.
		 */
		openFB3: function (evt)
		{
			var me = this,
				file = me.getFileFromEvent(evt),
				result = false;

			if (file)
			{
				result = file.read(
					{
						type: file.LOAD_TYPE_ARRAYBUFFER,
						load: function (data)
						{
							var structure,
								books,
								desc,
								body,
								content;

							try
							{
								me.fb3file = Ext.create('FBEditor.FB3.File', data);
								structure = me.fb3file.getStructure();
								books = structure.getBooks();
								desc = structure.getDesc(books[0]);
								body = structure.getBodies(books[0]);
								content = structure.getContent(body[0]);
								console.log('books', books);
								console.log('desc', desc);
								//console.log(content);
							}
							catch (e)
							{
								Ext.log(
									{
										level: 'error',
										msg: e,
										dump: e,
										stack: true
									}
								);
								Ext.Msg.show(
									{
										title: 'Ошибка',
										message: 'Невозможно открыть книгу',
										buttons: Ext.MessageBox.OK,
										icon: Ext.MessageBox.ERROR
									}
								);
							}
							Ext.getCmp('main-htmleditor').fireEvent('loadtext', content);
						}
					}
				);
			}

			return result;
		},

		/**
		 * Возвращает объект файла считанного из события открытия файла.
		 * @param {Object} evt Событие открытие файла.
		 * @return {FBEditor.file.File} Открытый файл.
		 */
		getFileFromEvent: function (evt)
		{
			var file;

			file = evt.target.files.length ? Ext.create('FBEditor.file.File', evt.target.files[0]) : null;

			return file;
		}

	}
);