/**
 * Меню для вставки таблицы.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.editor.button.table.menu.size.SizeMenu',
	{
		extend: 'Ext.menu.Menu',
		requires: [
			'FBEditor.view.panel.main.editor.button.table.menu.size.Picker'
		],

		minWidth: 80,

		/**
		 * @property {FBEditor.view.panel.main.editor.button.table.menu.size.Picker}
		 */
		picker: null,

		initComponent: function ()
		{
			var me = this,
				picker;

			picker = Ext.create('FBEditor.view.panel.main.editor.button.table.menu.size.Picker');
			me.picker = picker;
			me.items = [
				picker
			];

			me.callParent(arguments);
		},

		onHide: function ()
		{
			var me = this;

			// размерность таблицы по-умолчанию
			me.picker.setActiveCell([0, 0]);

			me.callParent(arguments);
		}
	}
);