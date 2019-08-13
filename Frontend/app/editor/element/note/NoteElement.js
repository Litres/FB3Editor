/**
 * Элемент note.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.note.NoteElement',
	{
		extend: 'FBEditor.editor.element.AbstractStyleElement',
		requires: [
			'FBEditor.editor.element.note.NoteElementController',
			'FBEditor.editor.command.note.CreateCommand',
			//'FBEditor.editor.command.note.CreateRangeCommand',
			'FBEditor.editor.command.note.DeleteWrapperCommand'
		],

		controllerClass: 'FBEditor.editor.element.note.NoteElementController',
		htmlTag: 'note',
		xmlTag: 'note',
		cls: 'el-note',
		showedOnTree: false,
		
		isNote: true,

		defaultAttributes: {
			href: 'undefined',
			role: 'auto',
			autotext: '1'
		},
		
		createScaffold: function ()
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {};
			
			els.t = factory.createElementText('[Сноска]');
			me.add(els.t);
			
			return els;
		},

		getAttributesXml: function (withoutText)
		{
			var me = this,
				attr = '';

			Ext.Object.each(
				me.attributes,
				function (key, val)
				{
                    if (key === 'href' && withoutText)
                    {
                        // xmllint не может корректно проверить ссылки с &
                        val = val.replace(/&/g, '');
                    }

					//attr += (key === 'href' && !withoutText ? 'l:' : '') + key + '="' + val + '" ';
					attr += (key === 'role' && !withoutText ? 'xlink:' : '') + key + '="' + val + '" ';
				}
			);

			attr = attr.trim();

			return attr;
		},

		getBlock: function ()
		{
			return this;
		},
		
		getData: function ()
		{
			var me = this,
				manager = me.getManager(),
				noteManager = manager.getNoteManager(),
				data;
			
			data = me.callParent(arguments);
			
			// обновляем список айди существующих сносок
			noteManager.updateNotesId();
			
			// список айди сносок
			data.notesId = noteManager.getNotesId();
			
			return data;
		},
		
		/**
		 * Генерирует текст новой сноски.
		 * @return  {String}
		 */
		generateText: function ()
		{
			var me = this,
				manager = me.getManager(),
				noteManager = manager.getNoteManager(),
				maxNumber,
				text;
			
			// обновляем список айди существующих сносок
			noteManager.updateNotesId();
			
			// максимальный существующйи номер сноски
			maxNumber = noteManager.getMaxNumber();
			
			if (maxNumber)
			{
				text = '[' + maxNumber + ']';
			}
			else
			{
				text = 'Сноска';
			}
			
			return text;
		}
	}
);