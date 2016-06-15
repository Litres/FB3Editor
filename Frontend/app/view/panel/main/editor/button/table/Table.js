/**
 * Кнопка вставки table.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.Table',
	{
		extend: 'FBEditor.view.panel.main.editor.button.AbstractButton',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.TableController',
			'FBEditor.view.panel.main.editor.button.table.menu.Menu'
		],
		id: 'main-editor-button-table',
		xtype: 'main-editor-button-table',
		controller: 'main.editor.button.table',
		html: '<i class="fa fa-table fa-lg"></i>',
		tooltip: 'Таблица',
		elementName: 'table',

		initComponent: function ()
		{
			var me = this;

			me.menu = Ext.create('FBEditor.view.panel.main.editor.button.table.menu.Menu');

			me.callParent(arguments);
		}
	}
);