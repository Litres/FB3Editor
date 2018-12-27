/**
 * Кнотроллер текстового элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.text.TextElementController',
	{
		extend: 'FBEditor.editor.element.AbstractElementController',
		requires: [
			'FBEditor.editor.command.text.ModifiedCommand',
			'FBEditor.editor.command.text.DeleteEmptyCommand'
		],
		
		/**
		 * @param {Object} e
		 * @param {FBEditor.editor.Range} rangeFromP Данные выделения, переданные из родительского абзаца.
		 */
		onKeyDownDelete: function (e, rangeFromP)
		{
			var me = this,
				el = me.getElement(),
				manager = el.getManager(),
				p,
				cmd,
				newValue,
				range;
			
			if (e)
			{
				e.preventDefault();
			}
			
			// получаем текущие данные выделения
			range = rangeFromP || manager.getRangeCursor();
			
			//console.log('range del text', range);
			
			if (!rangeFromP)
			{
				p = el.getStyleHolder();
				
				// передаем событие абзацу
				p.fireEvent('keyDownDelete', e);
			}
			else
			{
				// новый текст
				newValue = el.text.substring(0, range.offset.start) + el.text.substring(range.offset.start + 1);
				
				if (newValue)
				{
					// редактируем текст
					cmd = Ext.create('FBEditor.editor.command.text.ModifiedCommand', {newValue: newValue});
				}
				else
				{
					// удаляем пустой элемент
					cmd = Ext.create('FBEditor.editor.command.text.DeleteEmptyCommand');
				}
				
				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
		},
		
		/**
		 * @param {Object} e
		 * @param {FBEditor.editor.Range} rangeFromP Данные выделения, переданные из родительского абзаца.
		 */
		onKeyDownBackspace: function (e, rangeFromP)
		{
			var me = this,
				el = me.getElement(),
				manager = el.getManager(),
				p,
				cmd,
				newValue,
				range;
			
			if (e)
			{
				e.preventDefault();
			}
			
			// получаем текущие данные выделения
			range = rangeFromP || manager.getRangeCursor();
			
			//console.log('range backspace text', range);
			
			if (!rangeFromP)
			{
				p = el.getStyleHolder();
				
				// передаем событие абзацу
				p.fireEvent('keyDownBackspace', e);
			}
			else
			{
				// новый текст
				newValue = el.getText(0, range.offset.start) + el.getText(range.offset.start + 1);
				
				if (newValue)
				{
					// редактируем текст
					cmd = Ext.create('FBEditor.editor.command.text.ModifiedCommand',
						{newValue: newValue, isBackspace: true});
				}
				else
				{
					// удаляем пустой элемент
					cmd = Ext.create('FBEditor.editor.command.text.DeleteEmptyCommand', {isBackspace: true});
				}
				
				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
		},

		onPaste: function (e)
		{
			var me = this,
				el = me.getElement();

			// передаем событие родителю
			el.parent.fireEvent('paste', e);
		}
	}
);