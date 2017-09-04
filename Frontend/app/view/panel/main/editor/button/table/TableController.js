/**
 * Контроллер кнопки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.TableController',
	{
		extend: 'FBEditor.view.panel.main.editor.button.UnboundedButtonController',
		alias: 'controller.main.editor.button.table',

		onClick: function (button, e)
		{
			e.stopPropagation();
		},

		verifyResult: function (enable, scopeData)
		{
			var me = this,
				view = me.getView(),
				nodes = {},
				els = {},
				manager,
				menu,
				insertTableItem,
				range;

			if (!view)
			{
				return;
			}

			manager = view.getEditorManager();
			menu = view.getMenu();
			insertTableItem = view.getInsertTable();
			range = manager.getRange();
			
			if (!range)
			{
				return;
			}

			me.callParent(arguments);

			// синхронизируем пункты меню
			menu.fireEvent('sync');

			if (!enable)
			{
				nodes.node = range.common;

				if (!nodes.node.getElement || nodes.node.getElement().isRoot)
				{
					return false;
				}

				els.node = nodes.node.getElement();

				if (els.node.hasParentName('table') || els.node.isTable)
				{

					// если курсор в таблице, активируем кнопку принудительно
					view.enable();

					insertTableItem.disable();
				}
			}
			else
			{
				insertTableItem.enable();
			}
		}
	}
);