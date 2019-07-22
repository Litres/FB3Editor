/**
 * Переводит редактор текста в режим редактирования отдельного элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.command.EditElement',
	{
		extend: 'FBEditor.command.AbstractCommand',
		
		openBodyCmd: 'FBEditor.command.OpenBody',
		
		execute: function ()
		{
			var me = this,
				data = me.getData(),
				result = false,
				cmd,
				editEl,
				manager,
				el;
			
			el = data.el;
			manager = el.getManager();
			editEl = manager.getEditElement();
			
			// открываем редактор текста книги
			cmd = Ext.create(me.openBodyCmd);
			
			if (cmd.execute())
			{
				FBEditor.HistoryCommand.add(cmd);
				
				if (!el.equal(editEl))
				{
					manager.resetEditElement();
					manager.setEditElement(el);
					result = true;
				}
			}
			
			return result;
		},
		
		unExecute: function ()
		{
			//
		}
	}
);