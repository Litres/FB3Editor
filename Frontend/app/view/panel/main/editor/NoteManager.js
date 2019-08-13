/**
 * Менеджер сносок.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.NoteManager',
	{
		singleton: true,
		
		/**
		 * @private
		 * @property {String[]} Список всех айди сносок.
		 */
		notesId: null,
		
		/**
		 * Возвращает список айди сносок.
		 * @return {String[]}
		 */
		getNotesId: function ()
		{
			return this.notesId;
		},
		
		/**
		 * Генерирует новый id для сноски.
		 * Принцип генерации id заключается в переборе всех существующих id сносок и увеличении порядкового номера на 1.
		 *
		 * @example
		 * note_1
		 * note_2
		 * note_3
		 * ...
		 *
		 * @return {string} Id сноски.
		 */
		generateNoteId: function ()
		{
			var me = this,
				notesId = me.notesId || [],
				prefix = 'note_',
				maxNumber,
				id;
			
			maxNumber = me.getMaxNumber();
			
			// новый id
			id = prefix + (maxNumber + 1);
			
			// добавляем в коллекцию
			notesId.push(id);
			me.notesId = notesId;
			
			return id;
		},
		
		/**
		 * Обновляет коллекцию id сносок.
		 */
		updateNotesId: function ()
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				root = manager.getContent(),
				notesId = [];
			
			root.each(
				function (notes)
				{
					if (notes.isNotes)
					{
						notes.each(
							function (notebody)
							{
								var id = notebody.getId();
								
								if (notebody.isNotebody && id)
								{
									notesId.push(id);
								}
							}
						);
					}
				}
			);
			
			me.notesId = notesId;
		},
		
		/**
		 * Возвращает максимальный номер существующей ссылки. Если ссылок нет, то вернет 0.
		 * @return {Number}
		 */
		getMaxNumber: function ()
		{
			var me = this,
				notesId = me.notesId || [],
				prefix = 'note_',
				maxNumber = 0,
				reg;
			
			reg = new RegExp(prefix + '([0-9]+)', 'i');
			
			Ext.each(
				notesId,
				function (noteId)
				{
					var res,
						number;
					
					res = noteId.match(reg);
					
					number = res && Ext.isNumber(Number(res[1])) ? Number(res[1]) : null;
					
					if (number)
					{
						maxNumber = number > maxNumber ? number : maxNumber;
					}
				}
			);
			
			return Number(maxNumber);
		},
		
		/**
		 * Переводит курсор к тексту сноски.
		 * @param {FBEditor.editor.element.note.NoteElement} el Элемент сноски.
		 * @return {FBEditor.editor.element.notebody.NotebodyElement} Тело сноски.
		 */
		toNotebody: function (el)
		{
			var me = this,
				notebody,
				helper,
				manager;
			
			// тело сноски
			notebody = me.getNotebodyByNote(el);
			
			helper = notebody.getNodeHelper();
			
			// устанавливаем курсор в тело сноски
			helper.setCursor();
			
			return notebody;
		},
		
		/**
		 * Переводит курсор к сноске в тексте.
		 * @param {FBEditor.editor.element.note.NoteElement} el Элемент сноски.
		 */
		toNote: function (el)
		{
			var me = this,
				helper;
			
			helper = el.getNodeHelper();
			
			// устанавливаем курсор в начало сноски
			helper.setCursor({start: 1});
		},
		
		/**
		 * Возвращает тело сноски по сноске.
		 * @param {FBEditor.editor.element.note.NoteElement} el Элемент сноски.
		 * @return {FBEditor.editor.element.notebody.NotebodyElement}
		 */
		getNotebodyByNote: function (el)
		{
			var me = this,
				id,
				notebody;
			
			id = el.attributes.href;
			notebody = me.getNotebodyById(id);
			
			return notebody;
		},
		
		/**
		 * Возвращает все сноски, которые привязаны к телу сноски.
		 * @param {FBEditor.editor.element.note.NotebodyElement} el Тело сноски.
		 * @return {FBEditor.editor.element.notebody.NoteElement[]}
		 */
		getNotesByNotebody: function (el)
		{
			var me = this,
				href,
				notes;
			
			href = el.getId();
			notes = me.getNotesByHref(href);
			
			return notes;
		},
		
		/**
		 * Возвращает тело сноски по его айди-ссылке.
		 * @param {String} id  Айди-ссылка тела сноски.
		 * @return {FBEditor.editor.element.notebody.NotebodyElement}
		 */
		getNotebodyById: function (id)
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				root = manager.getContent(),
				el;
			
			root.each(
				function (notes)
				{
					if (notes.isNotes)
					{
						notes.each(
							function (notebody)
							{
								if (notebody.isNotebody && id === notebody.getId())
								{
									el = notebody;
									
									return true;
								}
							}
						);
					}
				}
			);
			
			return el;
		},
		
		/**
		 * Возвращает все сноски по их ссылке.
		 * @param {String} href  Ссылка сноски.
		 * @return {FBEditor.editor.element.notebody.NoteElement[]}
		 */
		getNotesByHref: function (href)
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				root = manager.getContent(),
				notes = [];
			
			if (href)
			{
				root.eachAll(
					function (el)
					{
						if (el.isNote && el.getAttributes('href') === href)
						{
							notes.push(el);
						}
					}
				);
			}
			
			return notes;
		}
	}
);