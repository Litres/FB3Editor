/**
 * Контроллер кнопки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.table.TableController',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.UnboundedButtonController',
		alias: 'controller.panel.toolstab.main.button.table',

		onClick: function ()
		{
			// ничего не делаем
		},

		verifyResult: function (enable, scopeData)
		{
			var me = this,
				btn = me.getView(),
				manager = FBEditor.editor.Manager,
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

			insertTableItem = btn.down('panel-toolstab-main-button-table-menu-insertTable');

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

				if (!els.node.hasParentName('table'))
				{
					return false;
				}

				// если курсор в таблице, активируем кнопку принудительно
				btn.enable();

				insertTableItem.disable();
			}
			else
			{
				insertTableItem.enable();
			}
		}
	}
);