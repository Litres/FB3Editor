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

		onKeyDownDelete: function (e)
		{
			var me = this,
				el = me.getElement(),
				sel = window.getSelection(),
				cmd,
				newValue,
				range;

			e.preventDefault();

			range = sel.getRangeAt(0);

			// новый текст
			newValue = el.text.substring(0, range.startOffset) + el.text.substring(range.startOffset + 1);

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
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}
	}
);