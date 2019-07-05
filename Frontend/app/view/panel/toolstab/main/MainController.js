/**
 * Контроллер вкладки форматирования.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.MainController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.panel.toolstab.main',
		
		/**
		 * Вызывается после активации тулбара.
		 */
		onActivate: function ()
		{
			var me = this,
				view = me.getView(),
				editor = view.getMainEditor(),
				manager = editor.getManager(),
				helper,
				node,
				root,
				range;
			
			// восстанавилваем выделение в тексте
			
			range = editor.getEditorRange();
			manager.setRange(range);
			root = manager.getContent();
			helper = root.getNodeHelper();
			node = helper.getNode();
			
			if (node)
			{
				helper.getNode().focus();
				manager.restoreSelection();
			}
		}
	}
);