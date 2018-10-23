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

		xtype: 'main-editor-button-table',
		controller: 'main.editor.button.table',

		//html: '<i class="fa fa-table fa-lg"></i>',
		text: 'Таблица',
		arrowVisible: false,

		tooltipText: 'Таблица',
		elementName: 'table',

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.button.table.menu.Menu} Меню
		 */
		menu: null,

		/**
		 * @private
		 * @property {FBEditor.view.panel.main.editor.button.table.menu.item.insertTable.Item} Пункт меню.
		 */
		insertTable: null,

		initComponent: function ()
		{
			var me = this;

			me.menu = Ext.create('FBEditor.view.panel.main.editor.button.table.menu.Menu');

			me.callParent(arguments);
		},

		/**
		 * Возвращает меню.
		 * @return {FBEditor.view.panel.main.editor.button.table.menu.Menu}
		 */
		getMenu: function ()
		{
			return this.menu;
		},

		/**
		 * Возвращает пункт меню.
		 * @return {FBEditor.view.panel.main.editor.button.table.menu.item.insertTable.Item}
		 */
		getInsertTable: function ()
		{
			var me = this,
				insertTable;

			insertTable = me.insertTable || me.down('main-editor-button-table-menu-insertTable');
			me.insertTable = insertTable;

			return insertTable;
		}
	}
);