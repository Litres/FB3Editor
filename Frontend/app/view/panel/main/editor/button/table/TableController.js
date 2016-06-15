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
				btn = me.getView(),
				manager = btn.getEditorManager(),
				nodes = {},
				els = {},
				range,
				insertTableItem;

			range = manager.getRange();

			if (!range)
			{
				return;
			}

			me.callParent(arguments);

			insertTableItem = btn.down('main-editor-button-table-menu-insertTable');

			// синхронизируем пункты меню
			btn.menu.fireEvent('sync');

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
					btn.enable();

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