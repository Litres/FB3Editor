/**
 * Кнотроллер элемента li.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.li.LiElementController',
	{
		extend: 'FBEditor.editor.element.AbstractStyleHolderElementController',

		onKeyDownBackspace: function (e)
		{
			var me = this,
				el = me.el,
				cmd;

			if (el.isEmptyLast())
			{
				// создаем пустой абзац вместо последнего пустого элемента li

				cmd = Ext.create('FBEditor.editor.command.li.CreateEmptyPCommand');

				if (cmd.execute())
				{
					me.getHistory().add(cmd);
				}
			}
			else
			{
				me.callParent(arguments);
			}
		}
	}
);