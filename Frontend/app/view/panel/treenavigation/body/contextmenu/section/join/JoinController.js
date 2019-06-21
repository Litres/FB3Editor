/**
 * Контроллер пункта меню.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.treenavigation.body.contextmenu.section.join.JoinController',
	{
		extend: 'FBEditor.view.panel.treenavigation.body.contextmenu.section.ItemController',
		
		alias: 'controller.contextmenu.treenavigation.body.section.join',
		
		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				manager = view.getEditorManager(),
				history,
				cmd;
			
			// корректируем выделение в тексте
			me.setSelection();
			
			cmd = Ext.create('FBEditor.editor.command.section.JoinCommand');
			
			if (cmd.execute())
			{
				// обвнялем дерево навигации по тексту
				manager.updateTree();
				
				history = manager.getHistory();
				history.add(cmd);
			}
		}
	}
);