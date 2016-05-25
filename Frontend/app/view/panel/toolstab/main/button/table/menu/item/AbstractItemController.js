/**
 * Контроллер пункта меню.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.menu.item.AbstractItemController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.toolstab.main.button.table.menu.item',

		/**
		 * Синхронизирует пункт меню с контекстом редактора текста.
		 */
		onSync: function ()
		{
			var me = this,
				view = me.getView(),
				manager = FBEditor.getEditorManager(),
				nodes = {},
				els = {},
				range;

			range = manager.getRange();

			if (!range)
			{
				view.disable();
				return false;
			}

			nodes.node = range.common;

			if (!nodes.node.getElement || nodes.node.getElement().isRoot)
			{
				view.disable();
				return false;
			}

			els.node = nodes.node.getElement();

			if (!els.node.hasParentName('table'))
			{
				view.disable();
				return false;
			}

			view.enable();

			return true;
		},

		onClick: function ()
		{
			var me = this,
				view = me.getView(),
				cmdName = view.cmdName,
				cmdOpts = view.cmdOpts,
				manager = FBEditor.getEditorManager(),
				node,
				el,
				history,
				range,
				cmd;

			if (cmdName)
			{
				range = manager.getRange();
				node = range.start;

				cmd = Ext.create('FBEditor.editor.command.table.' + cmdName, {node: node, opts: cmdOpts});

				if (cmd.execute())
				{
					el = node.getElement();
					history = el.getHistory();

					history.add(cmd);
				}
			}
		}
	}
);