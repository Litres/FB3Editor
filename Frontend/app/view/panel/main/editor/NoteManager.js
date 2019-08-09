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
		}
	}
);