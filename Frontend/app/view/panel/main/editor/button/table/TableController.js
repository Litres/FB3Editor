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

		onClick: function ()
		{
			// ничего не делаем
		},

		verifyResult: function (enable, scopeData)
		{
			var me = this,
				view = me.getView(),
				manager = view.getEditorManager(),
				menu = view.getMenu(),
				insertTableItem = view.getInsertTable(),
				nodes = {},
				els = {},
				range;

			range = manager.getRange();

			//console.log(enable, range);

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